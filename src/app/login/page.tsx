import Login from "./login.client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Ulisha Store",
  description: "Sign in to your account to continue shopping at Ulisha Store.",
  keywords: [
    "Ulisha Store",
    "Login",
    "Sign In",
    "Account Access",
    "Online Shopping",
    "E-commerce",
    "Affordable Products",
    "Trendy Items",
    "Quality Goods",
  ],
  openGraph: {
    title: "Login - Ulisha Store",
    description:
      "Sign in to your account to continue shopping at Ulisha Store.",
    url: "https://ulishastore.com/login",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://ulishastore.com/favicon.png",
        width: 1200,
        height: 630,
        alt: "Ulisha Store Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Ulisha Store",
    description:
      "Sign in to your account to continue shopping at Ulisha Store.",
    images: ["https://ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function LoginPage() {
  return <Login />;
}
