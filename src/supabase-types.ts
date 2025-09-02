export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          active: boolean | null
          button_link: string
          button_text: string
          created_at: string | null
          description: string
          id: string
          image_url: string
          title: string
        }
        Insert: {
          active?: boolean | null
          button_link: string
          button_text: string
          created_at?: string | null
          description: string
          id?: string
          image_url: string
          title: string
        }
        Update: {
          active?: boolean | null
          button_link?: string
          button_text?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      affiliate_accounts: {
        Row: {
          created_at: string | null
          earnings: number | null
          id: string
          paid_earnings: number | null
          payment_details: Json | null
          referral_code: string
          referral_count: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          earnings?: number | null
          id?: string
          paid_earnings?: number | null
          payment_details?: Json | null
          referral_code: string
          referral_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          earnings?: number | null
          id?: string
          paid_earnings?: number | null
          payment_details?: Json | null
          referral_code?: string
          referral_count?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string | null
          id: string
          order_id: string
          status: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string | null
          id?: string
          order_id: string
          status?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string | null
          id?: string
          order_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_settings: {
        Row: {
          commission_rate: number
          created_at: string | null
          id: string
          min_payout: number
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          min_payout?: number
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          created_at?: string | null
          id?: string
          min_payout?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_daily_stats: {
        Row: {
          created_at: string | null
          date: string
          id: string
          new_users: number | null
          orders_count: number | null
          page_views: number | null
          revenue: number | null
          unique_visitors: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          new_users?: number | null
          orders_count?: number | null
          page_views?: number | null
          revenue?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          new_users?: number | null
          orders_count?: number | null
          page_views?: number | null
          revenue?: number | null
          unique_visitors?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_page_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string | null
          favicon_url: string
          id: string
          logo_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          favicon_url: string
          id?: string
          logo_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          favicon_url?: string
          id?: string
          logo_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_cart_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items_new: {
        Row: {
          created_at: string | null
          id: string
          is_saved_for_later: boolean | null
          price_snapshot: number
          product_id: string | null
          quantity: number
          selected_color: string | null
          selected_size: string | null
          session_id: string | null
          updated_at: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_saved_for_later?: boolean | null
          price_snapshot: number
          product_id?: string | null
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          session_id?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_saved_for_later?: boolean | null
          price_snapshot?: number
          product_id?: string | null
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          session_id?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_new_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_new_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_new_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          delivery_type: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          selected_color: string | null
          selected_size: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_type?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_type?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string
          delivery_name: string
          delivery_phone: string
          id: string
          payment_method: string
          payment_ref: string
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address: string
          delivery_name: string
          delivery_phone: string
          id?: string
          payment_method: string
          payment_ref: string
          status?: string
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string
          delivery_name?: string
          delivery_phone?: string
          id?: string
          payment_method?: string
          payment_ref?: string
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          created_at: string
          id: number
          items: string | null
          payment_access_code: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: boolean | null
          total_amount: number | null
          total_items: number | null
          updated_at: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          items?: string | null
          payment_access_code?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: boolean | null
          total_amount?: number | null
          total_items?: number | null
          updated_at?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          items?: string | null
          payment_access_code?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: boolean | null
          total_amount?: number | null
          total_items?: number | null
          updated_at?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ratings: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          rating: number
          user_id: string | null
          user_review: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating: number
          user_id?: string | null
          user_review?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number
          user_id?: string | null
          user_review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string
          description: string | null
          id: number
          images: string | null
          is_anonymous: boolean | null
          rate: number | null
          user_id: string | null
          videos: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          images?: string | null
          is_anonymous?: boolean | null
          rate?: number | null
          user_id?: string | null
          videos?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          images?: string | null
          is_anonymous?: boolean | null
          rate?: number | null
          user_id?: string | null
          videos?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color: string
          created_at: string | null
          id: string
          product_id: string | null
          size: string
          stock: number
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          size: string
          stock?: number
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          size?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string
          discount_active: boolean | null
          discount_percentage: number | null
          discount_price: number | null
          id: string
          image: string
          name: string
          original_price: number | null
          price: number
          rating: number | null
          shipping_location: string
          store_id: string | null
          variant: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          discount_active?: boolean | null
          discount_percentage?: number | null
          discount_price?: number | null
          id?: string
          image: string
          name: string
          original_price?: number | null
          price: number
          rating?: number | null
          shipping_location?: string
          store_id?: string | null
          variant?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          discount_active?: boolean | null
          discount_percentage?: number | null
          discount_price?: number | null
          id?: string
          image?: string
          name?: string
          original_price?: number | null
          price?: number
          rating?: number | null
          shipping_location?: string
          store_id?: string | null
          variant?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_sessions: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          banner: string
          created_at: string | null
          description: string | null
          id: string
          logo: string
          name: string
          phone: string
          store_url: string
          user_id: string
        }
        Insert: {
          address: string
          banner: string
          created_at?: string | null
          description?: string | null
          id?: string
          logo: string
          name: string
          phone: string
          store_url: string
          user_id: string
        }
        Update: {
          address?: string
          banner?: string
          created_at?: string | null
          description?: string | null
          id?: string
          logo?: string
          name?: string
          phone?: string
          store_url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string
          id: number
          is_primary: boolean
          name: string
          notes: string | null
          phone_no: string
          state: string
          street: string
          user_id: string | null
          zip: number
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string
          id?: number
          is_primary?: boolean
          name: string
          notes?: string | null
          phone_no: string
          state: string
          street: string
          user_id?: string | null
          zip: number
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string
          id?: number
          is_primary?: boolean
          name?: string
          notes?: string | null
          phone_no?: string
          state?: string
          street?: string
          user_id?: string | null
          zip?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_role: {
        Row: {
          created_at: string
          id: number
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          firebase_uid: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          firebase_uid: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          firebase_uid?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clear_user_cart_after_order: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      create_order_with_items: {
        Args: {
          p_cart_items?: Json
          p_delivery_address?: string
          p_delivery_fee?: number
          p_delivery_fee_paid?: boolean
          p_delivery_name?: string
          p_delivery_phone?: string
          p_payment_method?: string
          p_payment_option?: string
          p_total: number
          p_user_id: string
        }
        Returns: string
      }
      generate_unique_referral_code: {
        Args: { user_id: string }
        Returns: string
      }
      get_total_users: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_count: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      track_page_view: {
        Args: {
          p_ip_address?: string
          p_page_path?: string
          p_referrer?: string
          p_session_id: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: undefined
      }
      update_daily_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_order_payment_status: {
        Args: { p_order_id: string; p_payment_ref: string; p_status?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
