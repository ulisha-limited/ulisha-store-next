/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import Recaptcha from "@/components/Recaptcha";
import Register from "../../components/auth/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Ulisha Store",
  description: "Create an account to start shopping at Ulisha Store.",
  keywords: [
    "Ulisha Store",
    "Register",
    "Create Account",
    "Sign Up",
    "Online Shopping",
    "E-commerce",
    "Affordable Products",
    "Trendy Items",
    "Quality Goods",
  ],
  openGraph: {
    title: "Register - Ulisha Store",
    description: "Create an account to start shopping at Ulisha Store.",
    url: "https://www.ulishastore.com/register",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://www.ulishastore.com/favicon.png",
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
    title: "Register - Ulisha Store",
    description: "Create an account to start shopping at Ulisha Store.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function RegisterPage() {
  return (
    <Recaptcha>
      <Register />
    </Recaptcha>
  );
}
