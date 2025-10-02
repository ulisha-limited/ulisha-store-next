/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */

import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faExclamation,
  faShield,
  faStopwatch20,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Web from "@/components/Web";

export const metadata: Metadata = {
  title: "Get the Ulisha Store App Today!",
  description:
    "Quick, secure, and convenient shopping — all at your fingertips.",
  keywords: [
    "Ulisha Store",
    "Android App",
    "Desktop App",
    "IOS App",
    "Download Ulisha",
    "Ulisha Store App",
    "Store App",
    "Shopping App",
    "Ecommerce App",
  ],
  openGraph: {
    title: "Get the Ulisha Store App Today!",
    description:
      "Quick, secure, and convenient shopping — all at your fingertips.",
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
    title: "Get the Ulisha Store App Today!",
    description:
      "Quick, secure, and convenient shopping — all at your fingertips.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function RegisterPage() {
  return <Web />;
}
