/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
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
  faAndroid,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import {
  faClock,
  faDesktop,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import TrustPilotWidget from "../TrustPilotWidget";
import { isMobile } from "@/utils/mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function Footer() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const mobile = isMobile();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (mobile) return;

  return (
    <footer className={`bg-gray-900 text-white ${mobile ? "hidden" : "block"}`}>
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

            <h3 className="text-lg font-semibold my-3">Download App</h3>
            <div className="flex gap-3">
              <Image
                src="/images/android-qrcode.png"
                alt="Ulisha Store Android Download QRCode"
                width="125"
                height="100"
                className="rounded-lg"
              />
              <div className="flex flex-col gap-2">
                <Link
                  className="flex items-center gap-2 bg-white text-gray-800 py-2 px-3 rounded-lg shadow-sm
                   hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium"
                  href="/web"
                  prefetch={false}
                >
                  <FontAwesomeIcon
                    icon={faAndroid}
                    className="text-green-600"
                  />
                  Android
                </Link>
                <Link
                  className="flex items-center gap-2 bg-white text-gray-800 py-2 px-3 rounded-lg shadow-sm
                   hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium"
                  href="/web"
                  prefetch={false}
                >
                  <FontAwesomeIcon icon={faApple} className="text-gray-600" />
                  Apple
                </Link>
                <Link
                  className="flex items-center gap-2 bg-white text-gray-800 py-2 px-3 rounded-lg shadow-sm
                   hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-sm font-medium"
                  href="/web"
                  prefetch={false}
                >
                  <FontAwesomeIcon icon={faDesktop} className="text-blue-600" />
                  Desktop
                </Link>
              </div>
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
