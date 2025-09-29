/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
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
import CanonicalUrl from "@/components/Canonical";
import MainLayout from "@/components/layouts/MainLayout";
import RegisterSW from "./register-sw";

config.autoAddCss = false;

const latoSans = Lato({
  variable: "--font-lato-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ulishastore.com"),
  title:
    "Ulisha Store - Shop with ease, Quality Products, Effortless Shopping.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="hostname" content="www.ulishastore.com" />
        <meta name="google-adsense-account" content="ca-pub-5077097159223655" />
        <meta
          name="p:domain_verify"
          content="b455103d3d00b5b90ad6fd02adcda753"
        />
        <meta name="manifest" content="/manifest.webmanifest" />
        <CanonicalUrl />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5077097159223655"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${latoSans.variable} antialiased`}>
        <RegisterSW />
        <MainLayout>{children}</MainLayout>
        <Session />
      </body>
    </html>
  );
}
