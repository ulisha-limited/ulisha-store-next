/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Ulisha Store",
  description:
    "Read our privacy policy to understand how we collect, use, and protect your personal information at Ulisha Store.",
  keywords: [
    "Ulisha Store",
    "Privacy Policy",
    "Data Protection",
    "Personal Information",
    "User Privacy",
    "Online Shopping",
    "E-commerce",
    "Customer Data",
  ],
  openGraph: {
    title: "Privacy Policy - Ulisha Store",
    description:
      "Read our privacy policy to understand how we collect, use, and protect your personal information at Ulisha Store.",
    url: "https://www.ulishastore.com/legal/privacy-policy",
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
    title: "Privacy Policy - Ulisha Store",
    description:
      "Read our privacy policy to understand how we collect, use, and protect your personal information at Ulisha Store.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center mb-8">
            <FontAwesomeIcon
              icon={faShield}
              className="text-red-500"
              size="3x"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Privacy Policy
          </h1>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 mb-4">
                At Ulisha Store, we are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit our website or use our
                services.
              </p>
              <p className="text-gray-600">
                By accessing or using our website, you agree to the collection
                and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <p className="text-gray-600 mb-4">
                We may collect personal information that you voluntarily provide
                to us when registering on the website, placing an order,
                subscribing to our newsletter, or contacting us. This may
                include your name, email address, phone number, shipping
                address, and payment information.
              </p>
              <p className="text-gray-600">
                We may also collect non-personal information such as browser
                type, device information, and usage data through cookies and
                similar technologies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>Process and fulfill your orders</li>
                <li>
                  Send you updates, newsletters, and promotional materials
                </li>
                <li>Improve our website and services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                4. Sharing Your Information
              </h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information with trusted
                service providers who assist us in operating our website and
                conducting our business, as long as those parties agree to keep
                this information confidential.
              </p>
              <p className="text-gray-600">
                We may also disclose your information if required by law or to
                protect our rights and safety.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your
                experience on our website, analyze usage patterns, and deliver
                personalized content. You can choose to disable cookies through
                your browser settings, but this may affect your ability to use
                certain features of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction.
              </p>
              <p className="text-gray-600">
                However, please note that no method of transmission over the
                Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Your Rights
              </h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, update, or delete your personal
                information. If you wish to exercise these rights, please
                contact us using the information provided below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page with an updated effective date. We
                encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                9. Contact Us
              </h2>
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about this Privacy Policy,
                please contact us:
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Email: support@ulishastore.com</li>
                <li>Phone: +234 (0) 706 043 8205</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
