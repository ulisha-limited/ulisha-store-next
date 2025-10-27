

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_affiliate_commission"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    referrer_id uuid;
    commission numeric;
BEGIN
    -- Get the referrer's affiliate account ID for the order's user
    SELECT ar.referrer_id INTO referrer_id
    FROM affiliate_referrals ar
    WHERE ar.referred_user_id = NEW.user_id
    AND ar.status = 'active'
    LIMIT 1;

    -- If there's a referrer, calculate and record commission
    IF referrer_id IS NOT NULL THEN
        -- Calculate commission using the current commission rate
        SELECT (NEW.total * affiliate_settings.commission_rate / 100) INTO commission
        FROM affiliate_settings
        LIMIT 1;

        -- Insert the commission record
        INSERT INTO affiliate_commissions (
            affiliate_id,
            order_id,
            amount,
            status
        ) VALUES (
            referrer_id,
            NEW.id,
            commission,
            'pending'
        );

        -- Update the affiliate's total earnings
        UPDATE affiliate_accounts
        SET earnings = earnings + commission
        WHERE id = referrer_id;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."calculate_affiliate_commission"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clear_user_cart_after_order"("p_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_session_id uuid;
  v_items_deleted integer;
BEGIN
  -- Get active shopping session
  SELECT id INTO v_session_id
  FROM shopping_sessions 
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_session_id IS NOT NULL THEN
    -- Delete cart items and count deleted rows
    DELETE FROM cart_items_new 
    WHERE session_id = v_session_id AND is_saved_for_later = false;
    
    GET DIAGNOSTICS v_items_deleted = ROW_COUNT;
    
    -- Update shopping session timestamp
    UPDATE shopping_sessions 
    SET updated_at = now()
    WHERE id = v_session_id;
    
    RAISE NOTICE 'Cleared % cart items for user: %', v_items_deleted, p_user_id;
    RETURN true;
  ELSE
    RAISE NOTICE 'No active shopping session found for user: %', p_user_id;
    RETURN false;
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to clear cart for user %: %', p_user_id, SQLERRM;
    RETURN false;
END;
$$;


ALTER FUNCTION "public"."clear_user_cart_after_order"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_order_with_items"("p_user_id" "uuid", "p_total" numeric, "p_delivery_fee" numeric DEFAULT 0, "p_delivery_fee_paid" boolean DEFAULT true, "p_payment_option" "text" DEFAULT 'full'::"text", "p_delivery_name" "text" DEFAULT NULL::"text", "p_delivery_phone" "text" DEFAULT NULL::"text", "p_delivery_address" "text" DEFAULT NULL::"text", "p_payment_method" "text" DEFAULT 'flutterwave'::"text", "p_cart_items" "jsonb" DEFAULT '[]'::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_price numeric;
  v_variant_id uuid;
  v_selected_color text;
  v_selected_size text;
  v_item_count integer;
BEGIN
  -- Input validation
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;
  
  IF p_total IS NULL OR p_total <= 0 THEN
    RAISE EXCEPTION 'Total amount must be greater than 0, got: %', p_total;
  END IF;
  
  IF p_delivery_name IS NULL OR trim(p_delivery_name) = '' THEN
    RAISE EXCEPTION 'Delivery name is required';
  END IF;
  
  IF p_delivery_phone IS NULL OR trim(p_delivery_phone) = '' THEN
    RAISE EXCEPTION 'Delivery phone is required';
  END IF;
  
  IF p_delivery_address IS NULL OR trim(p_delivery_address) = '' THEN
    RAISE EXCEPTION 'Delivery address is required';
  END IF;

  -- Validate payment option
  IF p_payment_option NOT IN ('full', 'partial') THEN
    RAISE EXCEPTION 'Payment option must be either "full" or "partial", got: %', p_payment_option;
  END IF;

  -- Validate cart items
  v_item_count := jsonb_array_length(p_cart_items);
  IF v_item_count = 0 THEN
    RAISE EXCEPTION 'Cart items are required to create an order';
  END IF;

  -- Log order creation attempt
  RAISE NOTICE 'Creating order for user % with total % and % items', p_user_id, p_total, v_item_count;

  -- Create the order
  INSERT INTO orders (
    user_id,
    total,
    delivery_fee,
    delivery_fee_paid,
    payment_option,
    status,
    delivery_name,
    delivery_phone,
    delivery_address,
    payment_method,
    payment_ref,
    created_at
  ) VALUES (
    p_user_id,
    p_total,
    COALESCE(p_delivery_fee, 0),
    COALESCE(p_delivery_fee_paid, true),
    COALESCE(p_payment_option, 'full'),
    'pending',
    trim(p_delivery_name),
    trim(p_delivery_phone),
    trim(p_delivery_address),
    COALESCE(p_payment_method, 'flutterwave'),
    'pending',
    now()
  ) RETURNING id INTO v_order_id;

  -- Insert order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    -- Extract and validate item data
    BEGIN
      v_product_id := (v_item->>'product_id')::uuid;
      v_quantity := (v_item->>'quantity')::integer;
      v_price := (v_item->>'price')::numeric;
      
      -- Handle variant data with proper null checks
      v_variant_id := CASE 
        WHEN v_item->>'variant_id' IS NULL OR 
             v_item->>'variant_id' = 'null' OR 
             v_item->>'variant_id' = '' OR
             v_item->>'variant_id' = 'undefined'
        THEN NULL 
        ELSE (v_item->>'variant_id')::uuid 
      END;
      
      v_selected_color := CASE 
        WHEN v_item->>'selected_color' IS NULL OR 
             v_item->>'selected_color' = 'null' OR 
             v_item->>'selected_color' = '' OR
             v_item->>'selected_color' = 'undefined'
        THEN NULL 
        ELSE v_item->>'selected_color' 
      END;
      
      v_selected_size := CASE 
        WHEN v_item->>'selected_size' IS NULL OR 
             v_item->>'selected_size' = 'null' OR 
             v_item->>'selected_size' = '' OR
             v_item->>'selected_size' = 'undefined'
        THEN NULL 
        ELSE v_item->>'selected_size' 
      END;

    EXCEPTION
      WHEN OTHERS THEN
        RAISE EXCEPTION 'Invalid item data in cart: %', v_item::text;
    END;

    -- Validate extracted data
    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Product ID is required for order item: %', v_item::text;
    END IF;
    
    IF v_quantity IS NULL OR v_quantity <= 0 THEN
      RAISE EXCEPTION 'Valid quantity is required for order item, got: %', v_quantity;
    END IF;
    
    IF v_price IS NULL OR v_price <= 0 THEN
      RAISE EXCEPTION 'Valid price is required for order item, got: %', v_price;
    END IF;

    -- Verify product exists
    IF NOT EXISTS (SELECT 1 FROM products WHERE id = v_product_id) THEN
      RAISE EXCEPTION 'Product not found: %', v_product_id;
    END IF;

    -- Insert order item
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      price,
      variant_id,
      selected_color,
      selected_size,
      created_at
    ) VALUES (
      v_order_id,
      v_product_id,
      v_quantity,
      v_price,
      v_variant_id,
      v_selected_color,
      v_selected_size,
      now()
    );

    RAISE NOTICE 'Added item to order: product_id=%, quantity=%, price=%', v_product_id, v_quantity, v_price;
  END LOOP;

  -- Log successful order creation
  RAISE NOTICE 'Order created successfully: % with % items', v_order_id, v_item_count;

  RETURN v_order_id;

EXCEPTION
  WHEN OTHERS THEN
    -- Log the error details
    RAISE EXCEPTION 'Failed to create order for user %: %', p_user_id, SQLERRM;
END;
$$;


ALTER FUNCTION "public"."create_order_with_items"("p_user_id" "uuid", "p_total" numeric, "p_delivery_fee" numeric, "p_delivery_fee_paid" boolean, "p_payment_option" "text", "p_delivery_name" "text", "p_delivery_phone" "text", "p_delivery_address" "text", "p_payment_method" "text", "p_cart_items" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_referral_code"("user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  base_code text;
  final_code text;
  counter integer := 0;
BEGIN
  -- Generate base code from user_id
  base_code := substr(replace(user_id::text, '-', ''), 1, 8);
  final_code := upper(base_code);
  
  -- Keep trying until we find a unique code
  WHILE EXISTS (
    SELECT 1 FROM affiliate_accounts WHERE referral_code = final_code
  ) LOOP
    counter := counter + 1;
    final_code := upper(base_code || counter::text);
  END LOOP;
  
  RETURN final_code;
END;
$$;


ALTER FUNCTION "public"."generate_unique_referral_code"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_total_users"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
DECLARE
  total_count integer;
BEGIN
  SELECT COUNT(*) INTO total_count FROM auth.users;
  RETURN total_count;
END;
$$;


ALTER FUNCTION "public"."get_total_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_count"() RETURNS bigint
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT COUNT(*)::bigint FROM auth.users;
$$;


ALTER FUNCTION "public"."get_user_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_admin_on_order"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Just log the order for now
  RAISE NOTICE 'New order received: %', NEW.id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_admin_on_order"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."track_page_view"("p_session_id" "text", "p_user_id" "uuid" DEFAULT NULL::"uuid", "p_page_path" "text" DEFAULT '/'::"text", "p_user_agent" "text" DEFAULT ''::"text", "p_ip_address" "text" DEFAULT ''::"text", "p_referrer" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO analytics_page_views (
    session_id, user_id, page_path, user_agent, ip_address, referrer
  )
  VALUES (
    p_session_id, p_user_id, p_page_path, p_user_agent, p_ip_address, p_referrer
  );
END;
$$;


ALTER FUNCTION "public"."track_page_view"("p_session_id" "text", "p_user_id" "uuid", "p_page_path" "text", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_affiliate_referral_count"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment referral count
    UPDATE affiliate_accounts
    SET referral_count = referral_count + 1
    WHERE id = NEW.referrer_id;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement referral count
    UPDATE affiliate_accounts
    SET referral_count = GREATEST(0, referral_count - 1)
    WHERE id = OLD.referrer_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_affiliate_referral_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_daily_stats"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  today_date date := CURRENT_DATE;
  unique_visitors_count integer := 0;
  page_views_count integer := 0;
  new_users_count integer := 0;
  orders_count integer := 0;
  revenue_amount numeric := 0;
BEGIN
  -- Calculate unique visitors for today
  SELECT COUNT(DISTINCT session_id)
  INTO unique_visitors_count
  FROM analytics_page_views
  WHERE DATE(created_at) = today_date;

  -- Calculate total page views for today
  SELECT COUNT(*)
  INTO page_views_count
  FROM analytics_page_views
  WHERE DATE(created_at) = today_date;

  -- Calculate new users for today (users who signed up today)
  SELECT COUNT(*)
  INTO new_users_count
  FROM auth.users
  WHERE DATE(created_at) = today_date;

  -- Calculate orders count for today
  SELECT COUNT(*)
  INTO orders_count
  FROM orders
  WHERE DATE(created_at) = today_date;

  -- Calculate revenue for today
  SELECT COALESCE(SUM(total), 0)
  INTO revenue_amount
  FROM orders
  WHERE DATE(created_at) = today_date
    AND status != 'cancelled';

  -- Insert or update the daily stats
  INSERT INTO analytics_daily_stats (
    date,
    unique_visitors,
    page_views,
    new_users,
    orders_count,
    revenue
  )
  VALUES (
    today_date,
    unique_visitors_count,
    page_views_count,
    new_users_count,
    orders_count,
    revenue_amount
  )
  ON CONFLICT (date)
  DO UPDATE SET
    unique_visitors = EXCLUDED.unique_visitors,
    page_views = EXCLUDED.page_views,
    new_users = EXCLUDED.new_users,
    orders_count = EXCLUDED.orders_count,
    revenue = EXCLUDED.revenue,
    updated_at = now();
END;
$$;


ALTER FUNCTION "public"."update_daily_stats"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_order_payment_status"("p_order_id" "uuid", "p_payment_ref" "text", "p_status" "text" DEFAULT 'completed'::"text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_order_exists boolean;
  v_current_status text;
BEGIN
  -- Check if order exists and get current status
  SELECT EXISTS(SELECT 1 FROM orders WHERE id = p_order_id), 
         (SELECT status FROM orders WHERE id = p_order_id LIMIT 1)
  INTO v_order_exists, v_current_status;
  
  IF NOT v_order_exists THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  -- Only update if order is still pending
  IF v_current_status != 'pending' THEN
    RAISE NOTICE 'Order % is already in status: %', p_order_id, v_current_status;
    RETURN false;
  END IF;

  -- Update order with payment information
  UPDATE orders 
  SET 
    payment_ref = p_payment_ref,
    status = p_status
  WHERE id = p_order_id AND status = 'pending';

  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to update order payment status for order: %', p_order_id;
  END IF;

  RAISE NOTICE 'Payment status updated for order: % to status: %', p_order_id, p_status;
  RETURN true;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to update payment status for order %: %', p_order_id, SQLERRM;
END;
$$;


ALTER FUNCTION "public"."update_order_payment_status"("p_order_id" "uuid", "p_payment_ref" "text", "p_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_order_total"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE orders
  SET total = (
    SELECT COALESCE(SUM(quantity * price), 0)
    FROM order_items
    WHERE order_id = NEW.order_id
  )
  WHERE id = NEW.order_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_order_total"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_product_price"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.discount_active = true AND NEW.discount_price IS NOT NULL THEN
    NEW.price = NEW.discount_price;
  ELSE
    NEW.price = NEW.original_price;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_product_price"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_variant_data"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- If variant_id is provided, validate that all variant fields are consistent
  IF NEW.variant_id IS NOT NULL THEN
    -- Check that color and size are also provided
    IF NEW.selected_color IS NULL OR NEW.selected_size IS NULL THEN
      RAISE EXCEPTION 'When variant_id is provided, selected_color and selected_size must also be provided';
    END IF;
    
    -- Verify that the variant exists and matches the selected color and size
    IF NOT EXISTS (
      SELECT 1 FROM product_variants
      WHERE id = NEW.variant_id
      AND color = NEW.selected_color
      AND size = NEW.selected_size
    ) THEN
      RAISE EXCEPTION 'Invalid variant data: variant does not match selected color and size';
    END IF;
  ELSE
    -- If no variant_id, ensure color and size are also null
    IF NEW.selected_color IS NOT NULL OR NEW.selected_size IS NOT NULL THEN
      RAISE EXCEPTION 'When variant_id is null, selected_color and selected_size must also be null';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_variant_data"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."advertisements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "button_text" "text" NOT NULL,
    "button_link" "text" NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."advertisements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "referral_code" "text" NOT NULL,
    "earnings" numeric DEFAULT 0,
    "paid_earnings" numeric DEFAULT 0,
    "status" "text" DEFAULT 'pending'::"text",
    "payment_details" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "referral_count" integer DEFAULT 0
);


ALTER TABLE "public"."affiliate_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_commissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "affiliate_id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_commissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid" NOT NULL,
    "referred_user_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_referrals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."affiliate_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commission_rate" numeric DEFAULT 10.0 NOT NULL,
    "min_payout" numeric DEFAULT 5000.0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."affiliate_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_daily_stats" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "unique_visitors" integer DEFAULT 0,
    "page_views" integer DEFAULT 0,
    "new_users" integer DEFAULT 0,
    "orders_count" integer DEFAULT 0,
    "revenue" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_daily_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."analytics_page_views" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "text" NOT NULL,
    "user_id" "uuid",
    "page_path" "text" NOT NULL,
    "user_agent" "text",
    "ip_address" "text",
    "referrer" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."analytics_page_views" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."app_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "logo_url" "text" NOT NULL,
    "favicon_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."app_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items_new" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid",
    "product_id" "uuid",
    "quantity" integer DEFAULT 1 NOT NULL,
    "price_snapshot" numeric NOT NULL,
    "is_saved_for_later" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "variant_id" "uuid",
    "selected_color" "text" DEFAULT ''::"text",
    "selected_size" "text",
    CONSTRAINT "check_cart_quantity_positive" CHECK (("quantity" > 0)),
    CONSTRAINT "check_variant_data" CHECK (((("variant_id" IS NOT NULL) AND ("selected_color" IS NOT NULL) AND ("selected_size" IS NOT NULL)) OR (("variant_id" IS NULL) AND ("selected_color" IS NULL) AND ("selected_size" IS NULL))))
);


ALTER TABLE "public"."cart_items_new" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "price" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "variant_id" "uuid",
    "selected_color" "text",
    "selected_size" "text",
    "delivery_type" "text" DEFAULT 'standard'::"text",
    CONSTRAINT "check_delivery_type" CHECK (("delivery_type" = ANY (ARRAY['standard'::"text", 'express'::"text"]))),
    CONSTRAINT "check_quantity_positive" CHECK (("quantity" > 0)),
    CONSTRAINT "check_variant_data" CHECK (((("variant_id" IS NOT NULL) AND ("selected_color" IS NOT NULL) AND ("selected_size" IS NOT NULL)) OR (("variant_id" IS NULL) AND ("selected_color" IS NULL) AND ("selected_size" IS NULL))))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "total" numeric DEFAULT 0 NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "delivery_address" "text" NOT NULL,
    "delivery_phone" "text" NOT NULL,
    "delivery_name" "text" NOT NULL,
    "payment_ref" "text" NOT NULL,
    "payment_method" "text" NOT NULL,
    CONSTRAINT "check_total_positive" CHECK (("total" >= (0)::numeric))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" bigint NOT NULL,
    "user_id" "text",
    "total_amount" smallint,
    "total_items" smallint,
    "items" character varying,
    "payment_access_code" "text",
    "payment_reference" "text",
    "payment_method" "text",
    "payment_status" boolean,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" smallint
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


ALTER TABLE "public"."payments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."payments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_categories" (
    "id" bigint NOT NULL,
    "name" character varying NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."product_categories" OWNER TO "postgres";


ALTER TABLE "public"."product_categories" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."product_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "image_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "rating" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_review" "text",
    CONSTRAINT "product_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."product_ratings" OWNER TO "postgres";


COMMENT ON COLUMN "public"."product_ratings"."user_review" IS 'Review from user for product';



CREATE TABLE IF NOT EXISTS "public"."product_reviews" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" character varying,
    "rate" integer,
    "description" "text",
    "images" "text",
    "videos" "text",
    "is_anonymous" boolean
);


ALTER TABLE "public"."product_reviews" OWNER TO "postgres";


ALTER TABLE "public"."product_reviews" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."product_reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."product_variants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "color" "text" NOT NULL,
    "size" "text" NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."product_variants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "store_id" "uuid",
    "rating" numeric DEFAULT 5,
    "original_price" numeric,
    "discount_price" numeric,
    "discount_active" boolean DEFAULT false,
    "discount_percentage" numeric GENERATED ALWAYS AS (
CASE
    WHEN (("original_price" > (0)::numeric) AND ("discount_price" > (0)::numeric)) THEN "round"((((1)::numeric - ("discount_price" / "original_price")) * (100)::numeric))
    ELSE (0)::numeric
END) STORED,
    "shipping_location" "text" DEFAULT 'Nigeria'::"text" NOT NULL,
    "variant" "text"[],
    CONSTRAINT "check_discount_price" CHECK ((("discount_price" IS NULL) OR (("discount_price" > (0)::numeric) AND ("discount_price" < "original_price")))),
    CONSTRAINT "check_shipping_location" CHECK (("shipping_location" = ANY (ARRAY['Nigeria'::"text", 'Abroad'::"text"])))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shopping_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL
);


ALTER TABLE "public"."shopping_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stores" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "logo" "text" NOT NULL,
    "banner" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "address" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "store_url" "text" NOT NULL
);


ALTER TABLE "public"."stores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_addresses" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"(),
    "name" "text" NOT NULL,
    "phone_no" "text" NOT NULL,
    "street" character varying NOT NULL,
    "zip" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "country" character varying,
    "is_primary" boolean DEFAULT false NOT NULL,
    "id" bigint NOT NULL,
    "state" "text" NOT NULL,
    "city" "text" NOT NULL,
    "notes" "text"
);


ALTER TABLE "public"."user_addresses" OWNER TO "postgres";


ALTER TABLE "public"."user_addresses" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_addresses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."user_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "currency" "text" DEFAULT 'NGN'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_role" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "text",
    "role" "text"
);


ALTER TABLE "public"."user_role" OWNER TO "postgres";


ALTER TABLE "public"."user_role" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_role_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "firebase_uid" "text" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."advertisements"
    ADD CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_accounts"
    ADD CONSTRAINT "affiliate_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_accounts"
    ADD CONSTRAINT "affiliate_accounts_referral_code_key" UNIQUE ("referral_code");



ALTER TABLE ONLY "public"."affiliate_accounts"
    ADD CONSTRAINT "affiliate_accounts_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."affiliate_commissions"
    ADD CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_referrals"
    ADD CONSTRAINT "affiliate_referrals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."affiliate_referrals"
    ADD CONSTRAINT "affiliate_referrals_referred_user_id_key" UNIQUE ("referred_user_id");



ALTER TABLE ONLY "public"."affiliate_settings"
    ADD CONSTRAINT "affiliate_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_daily_stats"
    ADD CONSTRAINT "analytics_daily_stats_date_key" UNIQUE ("date");



ALTER TABLE ONLY "public"."analytics_daily_stats"
    ADD CONSTRAINT "analytics_daily_stats_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."analytics_page_views"
    ADD CONSTRAINT "analytics_page_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items_new"
    ADD CONSTRAINT "cart_items_new_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items_new"
    ADD CONSTRAINT "cart_items_new_session_id_product_id_key" UNIQUE ("session_id", "product_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_product_id_key" UNIQUE ("user_id", "product_id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."product_categories"
    ADD CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_ratings"
    ADD CONSTRAINT "product_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_ratings"
    ADD CONSTRAINT "product_ratings_product_id_user_id_key" UNIQUE ("product_id", "user_id");



ALTER TABLE ONLY "public"."product_reviews"
    ADD CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_product_id_color_size_key" UNIQUE ("product_id", "color", "size");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_variant_key" UNIQUE ("variant");



ALTER TABLE ONLY "public"."shopping_sessions"
    ADD CONSTRAINT "shopping_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shopping_sessions"
    ADD CONSTRAINT "unique_active_session" UNIQUE ("user_id", "status");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "unique_store_url" UNIQUE ("store_url");



ALTER TABLE ONLY "public"."user_addresses"
    ADD CONSTRAINT "user_addresses_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."user_addresses"
    ADD CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_role"
    ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_firebase_uid_key" UNIQUE ("firebase_uid");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_advertisements_active_created" ON "public"."advertisements" USING "btree" ("active", "created_at" DESC);



CREATE INDEX "idx_affiliate_accounts_referral_code" ON "public"."affiliate_accounts" USING "btree" ("referral_code");



CREATE INDEX "idx_affiliate_accounts_user_id" ON "public"."affiliate_accounts" USING "btree" ("user_id");



CREATE INDEX "idx_affiliate_commissions_affiliate_id" ON "public"."affiliate_commissions" USING "btree" ("affiliate_id");



CREATE INDEX "idx_affiliate_referrals_referred_user_id" ON "public"."affiliate_referrals" USING "btree" ("referred_user_id");



CREATE INDEX "idx_affiliate_referrals_referrer_id" ON "public"."affiliate_referrals" USING "btree" ("referrer_id");



CREATE INDEX "idx_analytics_daily_stats_date" ON "public"."analytics_daily_stats" USING "btree" ("date" DESC);



CREATE INDEX "idx_analytics_page_views_created_at" ON "public"."analytics_page_views" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_analytics_page_views_session_id" ON "public"."analytics_page_views" USING "btree" ("session_id");



CREATE INDEX "idx_analytics_page_views_user_id" ON "public"."analytics_page_views" USING "btree" ("user_id");



CREATE INDEX "idx_cart_items_new_product_id" ON "public"."cart_items_new" USING "btree" ("product_id");



CREATE INDEX "idx_cart_items_new_session_id" ON "public"."cart_items_new" USING "btree" ("session_id");



CREATE INDEX "idx_cart_items_new_variant_id" ON "public"."cart_items_new" USING "btree" ("variant_id");



CREATE INDEX "idx_cart_items_variant_lookup" ON "public"."cart_items_new" USING "btree" ("variant_id", "selected_color", "selected_size");



CREATE INDEX "idx_order_items_delivery_type" ON "public"."order_items" USING "btree" ("delivery_type");



CREATE INDEX "idx_order_items_order_id" ON "public"."order_items" USING "btree" ("order_id");



CREATE INDEX "idx_order_items_order_product" ON "public"."order_items" USING "btree" ("order_id", "product_id");



CREATE INDEX "idx_order_items_variant_id" ON "public"."order_items" USING "btree" ("variant_id");



CREATE INDEX "idx_order_items_variant_lookup" ON "public"."order_items" USING "btree" ("variant_id", "selected_color", "selected_size");



CREATE INDEX "idx_orders_created_at" ON "public"."orders" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_orders_payment_ref" ON "public"."orders" USING "btree" ("payment_ref");



CREATE INDEX "idx_orders_payment_ref_status" ON "public"."orders" USING "btree" ("payment_ref", "status") WHERE (("payment_ref" IS NOT NULL) AND ("payment_ref" <> 'pending'::"text"));



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_orders_user_status_created" ON "public"."orders" USING "btree" ("user_id", "status", "created_at" DESC);



CREATE INDEX "idx_product_images_product_id" ON "public"."product_images" USING "btree" ("product_id");



CREATE INDEX "idx_product_ratings_product_id" ON "public"."product_ratings" USING "btree" ("product_id");



CREATE INDEX "idx_product_ratings_user_id" ON "public"."product_ratings" USING "btree" ("user_id");



CREATE INDEX "idx_product_variants_color_size" ON "public"."product_variants" USING "btree" ("color", "size");



CREATE INDEX "idx_product_variants_product_id" ON "public"."product_variants" USING "btree" ("product_id");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category");



CREATE INDEX "idx_products_created_at" ON "public"."products" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_products_shipping_location" ON "public"."products" USING "btree" ("shipping_location");



CREATE INDEX "idx_products_store_id" ON "public"."products" USING "btree" ("store_id");



CREATE INDEX "idx_shopping_sessions_user_id" ON "public"."shopping_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_shopping_sessions_user_id_status" ON "public"."shopping_sessions" USING "btree" ("user_id", "status");



CREATE INDEX "idx_stores_user_id" ON "public"."stores" USING "btree" ("user_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_firebase_uid" ON "public"."users" USING "btree" ("firebase_uid");



CREATE OR REPLACE TRIGGER "calculate_commission_trigger" AFTER INSERT ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."calculate_affiliate_commission"();



CREATE OR REPLACE TRIGGER "order_notification_trigger" AFTER INSERT ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."notify_admin_on_order"();



CREATE OR REPLACE TRIGGER "update_cart_items_new_updated_at" BEFORE UPDATE ON "public"."cart_items_new" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_order_total_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."order_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_order_total"();



CREATE OR REPLACE TRIGGER "update_product_price_trigger" BEFORE INSERT OR UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_product_price"();



CREATE OR REPLACE TRIGGER "update_referral_count_trigger" AFTER INSERT OR DELETE ON "public"."affiliate_referrals" FOR EACH ROW EXECUTE FUNCTION "public"."update_affiliate_referral_count"();



CREATE OR REPLACE TRIGGER "update_shopping_sessions_updated_at" BEFORE UPDATE ON "public"."shopping_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_preferences_updated_at" BEFORE UPDATE ON "public"."user_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "validate_cart_variant_data" BEFORE INSERT OR UPDATE ON "public"."cart_items_new" FOR EACH ROW EXECUTE FUNCTION "public"."validate_variant_data"();



CREATE OR REPLACE TRIGGER "validate_order_variant_data" BEFORE INSERT OR UPDATE ON "public"."order_items" FOR EACH ROW EXECUTE FUNCTION "public"."validate_variant_data"();



ALTER TABLE ONLY "public"."affiliate_accounts"
    ADD CONSTRAINT "affiliate_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."affiliate_commissions"
    ADD CONSTRAINT "affiliate_commissions_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliate_accounts"("id");



ALTER TABLE ONLY "public"."affiliate_commissions"
    ADD CONSTRAINT "affiliate_commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."affiliate_referrals"
    ADD CONSTRAINT "affiliate_referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."affiliate_referrals"
    ADD CONSTRAINT "affiliate_referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."affiliate_accounts"("id");



ALTER TABLE ONLY "public"."analytics_page_views"
    ADD CONSTRAINT "analytics_page_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."cart_items_new"
    ADD CONSTRAINT "cart_items_new_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items_new"
    ADD CONSTRAINT "cart_items_new_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."shopping_sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items_new"
    ADD CONSTRAINT "cart_items_new_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "fk_cart_items_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "fk_order_items_product" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."product_images"
    ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_ratings"
    ADD CONSTRAINT "product_ratings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_ratings"
    ADD CONSTRAINT "product_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."product_variants"
    ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shopping_sessions"
    ADD CONSTRAINT "shopping_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."stores"
    ADD CONSTRAINT "stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_preferences"
    ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can insert page views" ON "public"."analytics_page_views" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view advertisements" ON "public"."advertisements" FOR SELECT USING (true);



CREATE POLICY "Anyone can view affiliate settings" ON "public"."affiliate_settings" FOR SELECT USING (true);



CREATE POLICY "Anyone can view app settings" ON "public"."app_settings" FOR SELECT USING (true);



CREATE POLICY "Anyone can view product images" ON "public"."product_images" FOR SELECT USING (true);



CREATE POLICY "Anyone can view product variants" ON "public"."product_variants" FOR SELECT USING (true);



CREATE POLICY "Anyone can view products" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Enable delete for users based on user_id" ON "public"."user_addresses" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable insert for users based on user_id" ON "public"."user_addresses" FOR INSERT WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable read access for all users" ON "public"."product_categories" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."user_addresses" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Only admins can manage advertisements" ON "public"."advertisements" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"]))) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])));



CREATE POLICY "Only admins can manage affiliate settings" ON "public"."affiliate_settings" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"]))) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])));



CREATE POLICY "Only admins can manage app settings" ON "public"."app_settings" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = 'paulelite606@gmail.com'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = 'paulelite606@gmail.com'::"text"));



CREATE POLICY "Only admins can manage daily stats" ON "public"."analytics_daily_stats" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"]))))) WITH CHECK (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])))));



CREATE POLICY "Only admins can manage product images" ON "public"."product_images" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = 'paulelite606@gmail.com'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = 'paulelite606@gmail.com'::"text"));



CREATE POLICY "Only admins can manage product variants" ON "public"."product_variants" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"]))) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])));



CREATE POLICY "Only admins can manage products" ON "public"."products" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"]))) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])));



CREATE POLICY "Only admins can view daily stats" ON "public"."analytics_daily_stats" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])))));



CREATE POLICY "Only admins can view page views" ON "public"."analytics_page_views" FOR SELECT TO "authenticated" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" = ANY (ARRAY['paulelite606@gmail.com'::"text", 'obajeufedo2@gmail.com'::"text"])))));



CREATE POLICY "Users can create their own affiliate account" ON "public"."affiliate_accounts" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own order items" ON "public"."order_items" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."id" = "order_items"."order_id") AND ("orders"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can create their own orders" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own ratings" ON "public"."product_ratings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own shopping sessions" ON "public"."shopping_sessions" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own stores" ON "public"."stores" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own cart items" ON "public"."cart_items_new" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."shopping_sessions"
  WHERE (("shopping_sessions"."id" = "cart_items_new"."session_id") AND ("shopping_sessions"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can delete their own ratings" ON "public"."product_ratings" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own shopping sessions" ON "public"."shopping_sessions" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own stores" ON "public"."stores" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own cart items" ON "public"."cart_items_new" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."shopping_sessions"
  WHERE (("shopping_sessions"."id" = "cart_items_new"."session_id") AND ("shopping_sessions"."user_id" = "auth"."uid"()) AND ("shopping_sessions"."status" = 'active'::"text")))));



CREATE POLICY "Users can insert their own preferences" ON "public"."user_preferences" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own cart items" ON "public"."cart_items" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own affiliate account" ON "public"."affiliate_accounts" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own cart items" ON "public"."cart_items_new" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."shopping_sessions"
  WHERE (("shopping_sessions"."id" = "cart_items_new"."session_id") AND ("shopping_sessions"."user_id" = "auth"."uid"()) AND ("shopping_sessions"."status" = 'active'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."shopping_sessions"
  WHERE (("shopping_sessions"."id" = "cart_items_new"."session_id") AND ("shopping_sessions"."user_id" = "auth"."uid"()) AND ("shopping_sessions"."status" = 'active'::"text")))));



CREATE POLICY "Users can update their own data" ON "public"."users" FOR UPDATE TO "authenticated" USING (("firebase_uid" = (("current_setting"('request.jwt.claims'::"text"))::json ->> 'sub'::"text"))) WITH CHECK (("firebase_uid" = (("current_setting"('request.jwt.claims'::"text"))::json ->> 'sub'::"text")));



CREATE POLICY "Users can update their own preferences" ON "public"."user_preferences" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own ratings" ON "public"."product_ratings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own shopping sessions" ON "public"."shopping_sessions" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own stores" ON "public"."stores" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view all product ratings" ON "public"."product_ratings" FOR SELECT USING (true);



CREATE POLICY "Users can view all stores" ON "public"."stores" FOR SELECT USING (true);



CREATE POLICY "Users can view their commissions" ON "public"."affiliate_commissions" FOR SELECT TO "authenticated" USING (("affiliate_id" IN ( SELECT "affiliate_accounts"."id"
   FROM "public"."affiliate_accounts"
  WHERE ("affiliate_accounts"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own affiliate account" ON "public"."affiliate_accounts" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own cart items" ON "public"."cart_items" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own cart items" ON "public"."cart_items_new" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."shopping_sessions"
  WHERE (("shopping_sessions"."id" = "cart_items_new"."session_id") AND ("shopping_sessions"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own data" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Users can view their own order items" ON "public"."order_items" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."id" = "order_items"."order_id") AND ("orders"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own orders" ON "public"."orders" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own preferences" ON "public"."user_preferences" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own shopping sessions" ON "public"."shopping_sessions" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their referrals" ON "public"."affiliate_referrals" FOR SELECT TO "authenticated" USING (("referrer_id" IN ( SELECT "affiliate_accounts"."id"
   FROM "public"."affiliate_accounts"
  WHERE ("affiliate_accounts"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."advertisements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_commissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_referrals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."affiliate_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_daily_stats" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."analytics_page_views" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."app_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items_new" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_images" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_variants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shopping_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stores" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_role" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."cart_items_new";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."product_categories";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."shopping_sessions";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."user_addresses";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."calculate_affiliate_commission"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_affiliate_commission"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_affiliate_commission"() TO "service_role";



GRANT ALL ON FUNCTION "public"."clear_user_cart_after_order"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."clear_user_cart_after_order"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_user_cart_after_order"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."create_order_with_items"("p_user_id" "uuid", "p_total" numeric, "p_delivery_fee" numeric, "p_delivery_fee_paid" boolean, "p_payment_option" "text", "p_delivery_name" "text", "p_delivery_phone" "text", "p_delivery_address" "text", "p_payment_method" "text", "p_cart_items" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."create_order_with_items"("p_user_id" "uuid", "p_total" numeric, "p_delivery_fee" numeric, "p_delivery_fee_paid" boolean, "p_payment_option" "text", "p_delivery_name" "text", "p_delivery_phone" "text", "p_delivery_address" "text", "p_payment_method" "text", "p_cart_items" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_order_with_items"("p_user_id" "uuid", "p_total" numeric, "p_delivery_fee" numeric, "p_delivery_fee_paid" boolean, "p_payment_option" "text", "p_delivery_name" "text", "p_delivery_phone" "text", "p_delivery_address" "text", "p_payment_method" "text", "p_cart_items" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_referral_code"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_referral_code"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_referral_code"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_total_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_total_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_total_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_admin_on_order"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_admin_on_order"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_admin_on_order"() TO "service_role";



GRANT ALL ON FUNCTION "public"."track_page_view"("p_session_id" "text", "p_user_id" "uuid", "p_page_path" "text", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."track_page_view"("p_session_id" "text", "p_user_id" "uuid", "p_page_path" "text", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."track_page_view"("p_session_id" "text", "p_user_id" "uuid", "p_page_path" "text", "p_user_agent" "text", "p_ip_address" "text", "p_referrer" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_affiliate_referral_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_affiliate_referral_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_affiliate_referral_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_daily_stats"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_daily_stats"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_daily_stats"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_order_payment_status"("p_order_id" "uuid", "p_payment_ref" "text", "p_status" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_order_payment_status"("p_order_id" "uuid", "p_payment_ref" "text", "p_status" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_order_payment_status"("p_order_id" "uuid", "p_payment_ref" "text", "p_status" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_order_total"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_order_total"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_order_total"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_product_price"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_product_price"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_product_price"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_variant_data"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_variant_data"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_variant_data"() TO "service_role";


















GRANT ALL ON TABLE "public"."advertisements" TO "anon";
GRANT ALL ON TABLE "public"."advertisements" TO "authenticated";
GRANT ALL ON TABLE "public"."advertisements" TO "service_role";



GRANT ALL ON TABLE "public"."affiliate_accounts" TO "anon";
GRANT ALL ON TABLE "public"."affiliate_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliate_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."affiliate_commissions" TO "anon";
GRANT ALL ON TABLE "public"."affiliate_commissions" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliate_commissions" TO "service_role";



GRANT ALL ON TABLE "public"."affiliate_referrals" TO "anon";
GRANT ALL ON TABLE "public"."affiliate_referrals" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliate_referrals" TO "service_role";



GRANT ALL ON TABLE "public"."affiliate_settings" TO "anon";
GRANT ALL ON TABLE "public"."affiliate_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."affiliate_settings" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_daily_stats" TO "anon";
GRANT ALL ON TABLE "public"."analytics_daily_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_daily_stats" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_page_views" TO "anon";
GRANT ALL ON TABLE "public"."analytics_page_views" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_page_views" TO "service_role";



GRANT ALL ON TABLE "public"."app_settings" TO "anon";
GRANT ALL ON TABLE "public"."app_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."app_settings" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items_new" TO "anon";
GRANT ALL ON TABLE "public"."cart_items_new" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items_new" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_categories" TO "anon";
GRANT ALL ON TABLE "public"."product_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."product_categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_images" TO "anon";
GRANT ALL ON TABLE "public"."product_images" TO "authenticated";
GRANT ALL ON TABLE "public"."product_images" TO "service_role";



GRANT ALL ON TABLE "public"."product_ratings" TO "anon";
GRANT ALL ON TABLE "public"."product_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."product_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."product_reviews" TO "anon";
GRANT ALL ON TABLE "public"."product_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."product_reviews" TO "service_role";



GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."product_reviews_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."product_variants" TO "anon";
GRANT ALL ON TABLE "public"."product_variants" TO "authenticated";
GRANT ALL ON TABLE "public"."product_variants" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."shopping_sessions" TO "anon";
GRANT ALL ON TABLE "public"."shopping_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."shopping_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."stores" TO "anon";
GRANT ALL ON TABLE "public"."stores" TO "authenticated";
GRANT ALL ON TABLE "public"."stores" TO "service_role";



GRANT ALL ON TABLE "public"."user_addresses" TO "anon";
GRANT ALL ON TABLE "public"."user_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."user_addresses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_addresses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_addresses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_addresses_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_role" TO "anon";
GRANT ALL ON TABLE "public"."user_role" TO "authenticated";
GRANT ALL ON TABLE "public"."user_role" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_role_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_role_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_role_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
