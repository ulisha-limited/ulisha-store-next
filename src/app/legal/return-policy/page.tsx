/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy - Ulisha Store",
  description:
    "Read our return policy to understand how to return items purchased from Ulisha Store.",
  keywords: [
    "Ulisha Store",
    "Return Policy",
    "Returns",
    "Refunds",
    "Exchanges",
    "Customer Service",
    "Online Shopping",
    "E-commerce",
  ],
  openGraph: {
    title: "Return Policy - Ulisha Store",
    description:
      "Read our return policy to understand how to return items purchased from Ulisha Store.",
    url: "https://www.ulishastore.com/legal/return-policy",
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
    title: "Return Policy - Ulisha Store",
    description:
      "Read our return policy to understand how to return items purchased from Ulisha Store.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Refund &amp; Return Policy
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Our process for handling returns, exchanges, and refunds to ensure
          fairness.
        </p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Return Period
            </h2>
            <p className="text-gray-600 mb-4">
              We accept returns within 7 days of delivery for most items. To be
              eligible for a return, your item must be unused and in the same
              condition that you received it.
            </p>
            <p className="text-gray-600">
              The item must be in its original packaging with all tags and
              labels attached.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Non-Returnable Items
            </h2>
            <p className="text-gray-600 mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Personal care items</li>
              <li>Intimate apparel</li>
              <li>Customized or personalized products</li>
              <li>Downloadable software products</li>
              <li>Gift cards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Return Process
            </h2>
            <p className="text-gray-600 mb-4">
              To initiate a return, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-gray-600 mb-4">
              <li className="mb-2">
                Contact our customer service team within 7 days of receiving
                your order
              </li>
              <li className="mb-2">
                Obtain a Return Merchandise Authorization (RMA) number
              </li>
              <li className="mb-2">
                Pack the item securely in its original packaging
              </li>
              <li className="mb-2">
                Include the RMA number on the outside of the package
              </li>
              <li>
                Ship the item to the address provided by our customer service
                team
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Refunds
            </h2>
            <p className="text-gray-600 mb-4">
              Once we receive and inspect your return, we will notify you of the
              approval or rejection of your refund.
            </p>
            <p className="text-gray-600 mb-4">
              If approved, your refund will be processed, and a credit will
              automatically be applied to your original method of payment within
              7-14 business days.
            </p>
            <p className="text-gray-600">
              Please note that shipping costs are non-refundable, and you will
              be responsible for the cost of returning the item.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Damaged or Defective Items
            </h2>
            <p className="text-gray-600 mb-4">
              If you receive a damaged or defective item, please contact us
              immediately with photos of the damage. We will provide a prepaid
              shipping label for return and send a replacement item.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Late or Missing Refunds
            </h2>
            <p className="text-gray-600 mb-4">
              If you haven&apos;t received a refund yet, first check your bank
              account again. Then contact your credit card company, it may take
              some time before your refund is officially posted.
            </p>
            <p className="text-gray-600">
              If you&apos;ve done all of this and you still have not received
              your refund yet, please contact us at support@ulishastore.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Exchanges
            </h2>
            <p className="text-gray-600 mb-4">
              We only replace items if they are defective or damaged. If you
              need to exchange it for the same item in a different size or
              color, send us an email at support@ulishastore.com.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our Return Policy, please contact
              us:
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Email: support@ulishastore.com</li>
              <li>Phone: +234 (0) 706 043 8205</li>
              <li>WhatsApp: +234 (0) 706 043 8205</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
