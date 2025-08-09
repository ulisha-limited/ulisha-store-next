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
import "@fortawesome/fontawesome-svg-core/styles.css";
import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import BottomNav from "@/components/layouts/BottomNav";
import Session from "@/components/auth/Session";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

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
