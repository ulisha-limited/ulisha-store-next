import Script from "next/script";
import config from "@/config/index";

export default function GoogleAnalytics() {
  if (!config.googleAnalyticsId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${config.googleAnalyticsId}');
        `}
      </Script>
    </>
  );
}
