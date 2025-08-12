/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import { useCategoryStore } from "@/store/categoryStore";
import Image from "next/image";

type Category = { name: string };

const slugify = (s: string) =>
  s
    .normalize("NFKD") // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function Footer() {
  const { categories = [], fetchCategories } = useCategoryStore();

  // Fetch once on mount (avoids re-runs if the function identity changes)
  useEffect(() => {
    fetchCategories?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasCategories = categories && categories.length > 0;

  return (
    // Only visible on large screens and up; hidden on small/medium
    <footer className="hidden md:block bg-gray-900 text-white mt-12 mb-12 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          {hasCategories ? (
            <ul className="flex flex-wrap text-gray-400 gap-x-2 gap-y-1">
              {categories.map((category: Category) => (
                <li key={category.name}>
                  <Link
                    href={`/category/${slugify(category.name)}`}
                    className="hover:text-[#FF6600] transition-colors whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No categories found.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* About UlishaStore Section */}
          <div>
            <div className="mb-4">
              <span className="text-xl lg:text-2xl font-bold">
                <span className="text-[#FF6600]">Ulisha</span>
                <span className="text-white">Store</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for fashion, accessories, shoes, and smart
              devices. We bring you the best quality products at competitive
              prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/category"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Category
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Faq
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy-policy"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/return-policy"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-8 w-auto bg-white rounded p-1"
                width={8}
                height={8}
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-8 w-auto bg-white rounded p-1"
                width={8}
                height={8}
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-8 w-auto bg-white rounded p-1"
                width={8}
                height={8}
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">
              We accept all major international payment methods.
            </p>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <span>ulishastore@gmail.com</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1AhYhxox4X/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/ulishastores"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/ulisha_store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@ulishastores"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                {/* Use <Tiktok className="w-6 h-6" /> if available in your lucide-react version */}
                <FontAwesomeIcon icon={faTiktok} className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; <span>{new Date().getFullYear()}</span> Ulisha Limited. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
