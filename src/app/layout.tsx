/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import BottomNav from "@/components/layouts/BottomNav";
import Session from "@/components/auth/Session";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Ulisha Store - Shop with ease, Quality Products, Effortless Shopping.",
  description: "Your one-stop shop for all things trendy and affordable.",
  alternates: {
    types: {
      "application/xml": "https://www.ulishastore.com/sitemap.xml",
    },
  },
  keywords: [
    "Ulisha Store",
    "Online Shopping",
    "Affordable Products",
    "Trendy Items",
    "Quality Goods",
    "E-commerce",
    "Fashion",
    "Electronics",
    "Home Decor",
    "Gadgets",
    "Lifestyle",
    "Shop Online",
    "Buy Now",
    "Best Deals",
    "Customer Service",
    "Fast Shipping",
    "Secure Payment",
    "Satisfaction Guaranteed",
    "Shop with Confidence",
  ],
  openGraph: {
    title:
      "Ulisha Store - Shop with ease, Quality Products, Effortless Shopping.",
    description: "Your one-stop shop for all things trendy and affordable.",
    url: "https://www.ulishastore.com",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://www.ulishastore.com/favicon.png",
        width: 1200,
        height: 630,
        alt: "Ulisha Store - Your one-stop shop for all things trendy and affordable.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ulisha Store - Shop with ease, Quality Products, Effortless Shopping.",
    description: "Your one-stop shop for all things trendy and affordable.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
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
        <Script
          id="ld-json-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ulisha Store",
              url: "https://www.ulishastore.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.ulishastore.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Script
          id="ld-json-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ulisha Store",
              url: "https://www.ulishastore.com",
              logo: "https://www.ulishastore.com/favicon.png",
              sameAs: [
                "https://x.com/ulishastores",
                "https://tiktok.com/@ulishastores",
                "https://instagram.com/ulisha_store",
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+2349134781219",
                  contactType: "customer service",
                  areaServed: "NG",
                  availableLanguage: ["English"],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-white min-h-screen flex flex-col">
          <Nav />
          <NextTopLoader showSpinner={false} color="#FF6600" />
          <div className="flex-1 pt-[90px] mb-[90px] md:mb-0">
            <ProtectedRoute>{children}</ProtectedRoute>
          </div>
          <ToastContainer />
          <Footer />
          <BottomNav />
        </div>
        <Session />
      </body>
    </html>
  );
}
