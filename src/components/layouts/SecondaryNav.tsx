/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHamburger, faX } from "@fortawesome/free-solid-svg-icons";

export function SecondaryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const primaryLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/web", label: "Web" },
    { href: "/about", label: "About" },
  ];

  const legalLinks = [
    { href: "/legal/terms", label: "Terms" },
    { href: "/legal/privacy-policy", label: "Privacy" },
    { href: "/legal/return-policy", label: "Refund Policy" },
  ];

  return (
    <div className="w-full border-b border-gray-200">
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center py-2 text-xs text-gray-300 space-x-4">
          <Link href="/login" prefetch={false} className="hover:underline">
            Login
          </Link>
          <Link href="/signup" prefetch={false} className="hover:underline">
            Sign Up
          </Link>
        </div>
      </div>

      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              prefetch={false}
              className="font-semibold text-gray-900 text-lg"
            >
              Ulisha
            </Link>

            {/* Desktop Primary Links */}
            <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className="hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FontAwesomeIcon icon={faX} />
              ) : (
                <FontAwesomeIcon icon={faHamburger} />
              )}
            </button>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-gray-200 py-3 space-y-2">
              {[...primaryLinks, ...legalLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className="block px-2 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 py-2 text-xs text-gray-500">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
