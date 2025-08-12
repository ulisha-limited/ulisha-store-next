/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState } from "react";
import { faCircleChevronLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function ShortLinks() {
  const [showShortlinkForm, setShowShortlinkForm] = useState(false);
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
                Shortlink
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowShortlinkForm(!showShortlinkForm)}
                className="bg-orange-500 text-white px-2 py-1 rounded-md hover:bg-orange-500/90 transition-colors flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                <span>Add Shortlink</span>
              </button>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
