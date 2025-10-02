/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import {
  faNoteSticky,
  faQuestion,
  faRefresh,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Legal() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Legal & Policies
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Find information about our terms, policies, and frequently asked
          questions.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            href="/legal/terms"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <FontAwesomeIcon
              icon={faNoteSticky}
              className="text-blue-500"
              size="3x"
            />
            <h2 className="text-xl font-semibold text-gray-800 my-2">
              Terms & Conditions
            </h2>
            <p className="text-gray-600 text-sm">
              Read the rules and guidelines for using our services.
            </p>
          </Link>

          <Link
            href="/legal/privacy-policy"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <FontAwesomeIcon
              icon={faShield}
              className="text-red-500"
              size="3x"
            />
            <h2 className="text-xl font-semibold text-gray-800 my-2">
              Privacy Policy
            </h2>
            <p className="text-gray-600 text-sm">
              Understand how we handle your personal data.
            </p>
          </Link>

          <Link
            href="/legal/return-policy"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <FontAwesomeIcon
              icon={faRefresh}
              className="text-orange-500"
              size="3x"
            />
            <h2 className="text-xl font-semibold text-gray-800 my-2">
              Return Policy
            </h2>
            <p className="text-gray-600 text-sm">
              Learn about our return and refund process.
            </p>
          </Link>

          <Link
            href="/faq"
            className="block p-6 bg-white rounded-2xl shadow hover:shadow-lg transition-shadow border border-gray-200"
          >
            <FontAwesomeIcon
              icon={faQuestion}
              className="text-orange-500"
              size="3x"
            />
            <h2 className="text-xl font-semibold text-gray-800 my-2">FAQ</h2>
            <p className="text-gray-600 text-sm">
              Find answers to common questions about our services.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
