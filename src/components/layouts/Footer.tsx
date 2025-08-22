/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faTiktok,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import { faClock, faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import TrustPilotWidget from "../TrustPilotWidget";

export default function Footer() {
  return (
    // Only visible on large screens and up; hidden on small/medium
    <footer className="hidden md:block bg-gray-900 text-white mt-12 mb-12 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* About UlishaStore Section */}
          <div>
            <h3 className="mb-3">
              <span className="text-xl lg:text-2xl font-bold">
                <span className="text-[#FF6600]">Ulisha</span>
                <span className="text-white">Store</span>
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for fashion, accessories, shoes, and smart
              devices. We bring you the best quality products at competitive
              prices.
            </p>
            <div className="flex space-x-2 mt-3">
              <Link
                href="https://www.facebook.com/share/1AhYhxox4X/?mibextid=wwXIfr"
                target="_blank"
                className="hover:text-[#FF6600] transition-colors bg-gray-800 p-2 rounded"
              >
                <FontAwesomeIcon icon={faFacebook} size="1x" />
              </Link>
              <Link
                href="https://www.pinterest.com/ulishastore"
                target="_blank"
                className="hover:text-[#FF6600] transition-colors bg-gray-800 p-2 rounded"
              >
                <FontAwesomeIcon icon={faPinterest} size="1x" />
              </Link>
              <Link
                href="https://x.com/ulishastores"
                target="_blank"
                className="hover:text-[#FF6600] transition-colors bg-gray-800 p-2 rounded"
              >
                <FontAwesomeIcon icon={faTwitter} size="1x" />
              </Link>
              <Link
                href="https://www.instagram.com/ulisha_store"
                target="_blank"
                className="hover:text-[#FF6600] transition-colors bg-gray-800 p-2 rounded"
              >
                <FontAwesomeIcon icon={faInstagram} size="1x" />
              </Link>
              <Link
                href="https://www.tiktok.com/@ulishastores"
                target="_blank"
                className="hover:text-[#FF6600] transition-colors bg-gray-800 p-2 rounded"
              >
                {/* Use <Tiktok className="w-6 h-6" /> if available in your lucide-react version */}
                <FontAwesomeIcon icon={faTiktok} size="1x" />
              </Link>
            </div>
            <TrustPilotWidget />
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Links</h3>
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
                  prefetch={false}
                  href="/faq"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Faq
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  href="/about"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  href="/sitemap.xml"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  prefetch={false}
                  href="/legal/terms"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
                  href="/legal/privacy-policy"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  prefetch={false}
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
            <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
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
            <h3 className="text-lg font-semibold mb-3">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Link
                  href="tel:+2349134781219"
                  className="flex items-center hover:text-[#FF6600] transition-colors"
                >
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  Delta, Nigeria
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Link
                  href="tel:+2349134781219"
                  className="flex items-center hover:text-[#FF6600] transition-colors"
                >
                  <FontAwesomeIcon icon={faPhone} className="me-2" />
                  +234 913 478 1219
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Link
                  href="mailto:support@ulishastore.com"
                  className="flex items-center hover:text-[#FF6600] transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  support@ulishastore.com
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Link
                  href="tel:+2349134781219"
                  className="flex items-center hover:text-[#FF6600] transition-colors"
                >
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Mon-Sat: 8AM - 6PM
                </Link>
              </li>
            </ul>
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
