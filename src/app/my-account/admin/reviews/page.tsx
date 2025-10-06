/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


"use client";

import { faCircleChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ShortLinks() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link
                href="/my-account"
                className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Go back to admin panel"
              >
                <FontAwesomeIcon
                  icon={faCircleChevronLeft}
                  className="w-6 h-6 text-gray-700"
                />
              </Link>

              <h1 className="text-2xl font-extrabold text-gray-900">
                Reviews
              </h1>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
