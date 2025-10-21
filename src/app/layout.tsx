/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Session from "@/components/auth/Session";
import { config } from "@fortawesome/fontawesome-svg-core";
import CanonicalUrl from "@/components/layouts/CanonicalUrl";
import RegisterSW from "./register-sw";
import { ToastContainer } from "react-toastify";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import _config from "@/config/index";
import GoogleAdsense from "@/components/GoogleAdsense";

config.autoAddCss = false;

const latoSans = Lato({
  variable: "--font-lato-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ulishastore.com"),
  title: {
    default:
      "Ulisha Store - Shop with ease, Quality Products, Effortless Shopping.",
    template: "%s | Ulisha Store",
  },
  description: "Your one-stop shop for all things trendy and affordable.",
  alternates: {
    types: {
      "application/xml": "https://www.ulishastore.com/sitemap.xml",
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProd = _config.nodeEnv === "production";

  return (
    <html lang="en">
      <head>
        <meta name="hostname" content="www.ulishastore.com" />
        <meta
          name="p:domain_verify"
          content={`${_config.pinterestDomainVerify}`}
        />
        <meta name="manifest" content="/manifest.webmanifest" />
        <CanonicalUrl />
        {isProd && <GoogleAnalytics />}
        {isProd && <GoogleAdsense />}
      </head>
      <body className={`${latoSans.variable} antialiased`}>
        <RegisterSW />
        {children}
        <ToastContainer />
        <Session />
      </body>
    </html>
  );
}
