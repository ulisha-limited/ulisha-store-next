/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import Recaptcha from "@/components/Recaptcha";
import Register from "../../../components/auth/Register";
import { Metadata } from "next";
import { isMobileRequest } from "@/lib/device";

export const metadata: Metadata = {
  title: "Register",
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

export default async function RegisterPage() {
  const isMobile = await isMobileRequest();

  return (
    <Recaptcha>
      <Register isMobile={isMobile} />
    </Recaptcha>
  );
}
