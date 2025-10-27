DROP POLICY IF EXISTS "Only admins can manage advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Only admins can manage affiliate settings" ON public.affiliate_settings;
DROP POLICY IF EXISTS "Only admins can manage app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Only admins can manage daily stats" ON public.analytics_daily_stats;
DROP POLICY IF EXISTS "Only admins can view daily stats" ON public.analytics_daily_stats;
DROP POLICY IF EXISTS "Only admins can view page views" ON public.analytics_page_views;
DROP POLICY IF EXISTS "Only admins can manage product images" ON public.product_images;
DROP POLICY IF EXISTS "Only admins can manage product variants" ON public.product_variants;
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;

-- Only admins can manage app_settings
CREATE POLICY "Only admins can manage app_settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage affiliate_settings
CREATE POLICY "Only admins can manage affiliate_settings"
ON public.affiliate_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage advertisements
CREATE POLICY "Only admins can manage advertisements"
ON public.advertisements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage daily stats
CREATE POLICY "Only admins can manage daily stats"
ON public.analytics_daily_stats
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can view daily stats
CREATE POLICY "Only admins can view daily stats"
ON public.analytics_daily_stats
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can view page views
CREATE POLICY "Only admins can view page views"
ON public.analytics_page_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage product images
CREATE POLICY "Only admins can manage product images"
ON public.product_images
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage product variants
CREATE POLICY "Only admins can manage product variants"
ON public.product_variants
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

-- Only admins can manage products
CREATE POLICY "Only admins can manage products"
ON public.products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);
