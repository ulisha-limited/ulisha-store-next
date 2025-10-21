import Script from "next/script";
import config from "@/config/index";

export default function GoogleAdsense() {
  if (!config.googleAdsenseCaPub) return null;

  return (
    <>
      <meta
        name="google-adsense-account"
        content={`${config.googleAdsenseCaPub}`}
      />
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.googleAdsenseCaPub}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      ></Script>
    </>
  );
}
