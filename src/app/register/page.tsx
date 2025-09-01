/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import Recaptcha from "@/components/Recaptcha";
import Register from "./register.client";
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
  return  <Recaptcha><Register /></Recaptcha>;
}
