/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCartShopping,
  faHamburger,
  faHeart,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";

export function SecondaryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore((state) => state);

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
        <div className="mx-auto px-4 flex flex-row py-2 text-xs text-gray-300 space-x-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-2">
              <Link
                href="https://www.ulishalimited.com"
                prefetch={false}
                className="hover:underline"
              >
                Ulisha Limited
              </Link>
            </div>
            <div className="flex gap-4">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    prefetch={false}
                    className="hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    prefetch={false}
                    className="hover:underline"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/wishlist"
                    prefetch={false}
                    className="hover:underline"
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </Link>
                  <Link
                    href="/cart"
                    prefetch={false}
                    className="hover:underline"
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </Link>
                  <Link
                    href="/notifications"
                    prefetch={false}
                    className="hover:underline"
                  >
                    <FontAwesomeIcon icon={faBell} />
                  </Link>
                  <Link
                    href="/my-account"
                    prefetch={false}
                    className="hover:underline"
                  >
                    {user.email}
                  </Link>
                </>
              )}
            </div>
          </div>
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
              Ulisha Store
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
