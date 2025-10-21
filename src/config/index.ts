const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  maintenanceMode: process.env.MAINTENANCE_MODE === "true",
  supabaseURL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",
  paystackCallbackURLDevelopment:
    process.env.PAYSTACK_CALLBACK_URL_DEVELOPMENT ||
    "http://localhost:3000/orders",
  paystackCallbackURLProduction:
    process.env.PAYSTACK_CALLBACK_URL_PRODUCTION ||
    "https://www.ulishastore.com/orders",
  mixPayAppId: process.env.MIXPAY_APP_ID || "",
  mixPayReturnTo: process.env.MIXPAY_RETURN_TO || "",
  mixPayCallbackUrl: process.env.MIXPAY_CALLBACK_URL || "",
  enablePrerender: process.env.ENABLE_PRERENDER === "true",
  prerenderToken: process.env.PRERENDER_TOKEN || "",
  enableSentry: process.env.ENABLE_SENTRY === "true",
  sentryAuthToken: process.env.SENTRY_AUTH_TOKEN || "",
  sentryDNS: process.env.SENTRY_DNS || "",
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || "",
  redisURL: process.env.REDIS_URL || "",
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
  googleAdsenseCaPub: process.env.NEXT_PUBLIC_CA_PUB || "",
  pinterestDomainVerify: process.env.NEXT_PUBLIC_PINTEREST_DOMAIN_VERIFY || ""
};

export default config;
