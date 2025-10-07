/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Ulisha Store",
  description:
    "Read our terms of service to understand the rules and regulations for using Ulisha Store.",
  keywords: [
    "Ulisha Store",
    "Terms of Service",
    "Terms and Conditions",
    "User Agreement",
    "Online Shopping",
    "E-commerce",
    "Customer Agreement",
    "Legal Terms",
  ],
  openGraph: {
    title: "Terms of Service - Ulisha Store",
    description:
      "Read our terms of service to understand the rules and regulations for using Ulisha Store.",
    url: "https://www.ulishastore.com/legal/terms",
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
    title: "Terms of Service - Ulisha Store",
    description:
      "Read our terms of service to understand the rules and regulations for using Ulisha Store.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The rules, obligations, and rights that govern your use of our
          services.
        </p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome to Ulisha Store, the online platform owned and operated by
              Ulisha Limited (“Ulisha Limited,” “we,” “our,” or “us”). These
              Terms and Conditions govern your access to and use of our website,
              products, and services.
            </p>
            <p className="text-gray-600">
              By accessing this website, we assume you accept these terms and
              conditions in full. Do not continue to use Ulisha Store&apos;s
              website if you do not accept all of the terms and conditions
              stated on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. License
            </h2>
            <p className="text-gray-600 mb-4">
              Unless otherwise stated, Ulisha Store and/or its licensors own the
              intellectual property rights for all material on this website. All
              intellectual property rights are reserved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. User Account
            </h2>
            <p className="text-gray-600 mb-4">
              You must be at least 18 years of age to use this website. You must
              provide true, accurate, current, and complete information about
              yourself as prompted by the registration form.
            </p>
            <p className="text-gray-600">
              You are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your computer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Products and Pricing
            </h2>
            <p className="text-gray-600 mb-4">
              Prices for products are subject to change without notice. We
              reserve the right at any time to modify or discontinue any product
              without notice at any time.
            </p>
            <p className="text-gray-600">
              We shall not be liable to you or any third party for any
              modification, price change, suspension, or discontinuance of any
              product.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Payment and Shipping
            </h2>
            <p className="text-gray-600 mb-4">
              We accept various payment methods including credit cards, bank
              transfers, and cryptocurrencies. All payments must be received in
              full before products are shipped.
            </p>
            <p className="text-gray-600">
              Shipping times may vary depending on the delivery location and
              product availability. We are not responsible for delays caused by
              customs or other factors beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Affiliate Program
            </h2>
            <p className="text-gray-600 mb-4">
              Our affiliate program allows users to earn commissions by
              referring new customers. Commissions are paid according to our
              affiliate terms and conditions.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify or terminate the affiliate program
              at any time without prior notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Privacy Policy
            </h2>
            <p className="text-gray-600">
              Your privacy is important to us. Please review our Privacy Policy
              to understand how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-600">
              In no event shall Ulisha Store be liable for any direct, indirect,
              incidental, special, consequential or punitive damages arising out
              of or relating to your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms and Conditions, please
              contact us:
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Email: support@ulishastore.com</li>
              <li>Phone: +234 (0) 706 043 8205</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
