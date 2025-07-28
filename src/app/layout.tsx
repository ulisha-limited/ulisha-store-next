import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import Session from "@/components/Session";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ulisha Store",
  description: "Your one-stop shop for all things trendy and affordable.",
  openGraph: {
    title: "Ulisha Store",
    description: "Your one-stop shop for all things trendy and affordable.",
    url: "https://ulishastore.com",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://ulishastore.com/favicon.png",
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
    title: "Ulisha Store",
    description: "Your one-stop shop for all things trendy and affordable.",
    images: ["https://ulishastore.com/favicon.png"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-white min-h-screen flex flex-col">
          <Nav />
          <NextTopLoader showSpinner={false} color="#FF6600" />
          <div className="flex-1 pt-[90px]">{children}</div>
          <Footer />
          <BottomNav />
        </div>
        <Session />
      </body>
    </html>
  );
}
