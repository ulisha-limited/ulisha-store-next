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

import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  faExclamation,
  faShield,
  faStopwatch20,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function RegisterPage() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ulisha Store",
    operatingSystem: "ANDROID",
    applicationCategory: "ShoppingApplication",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "5",
    },
    offers: {
      "@type": "Offer",
      price: "0",
    },
    creator: {
      "@type": "Person",
      name: "Ulisha Limited",
      url: "https://www.ulishalimited.com",
    },
  };

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplication),
        }}
      />

      <div className="w-full">
        <section className="h-screen flex flex-col items-center justify-center text-center px-6">
          <Image
            src="/ulisha-store-icon-192.png"
            alt="Ulisha Store App"
            width={80}
            height={80}
            className="mb-9"
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-950">
            Meet the Ulisha Store App
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl">
            Seamless shopping, exclusive deals, and everything you love from
            Ulisha — now in your pocket.
          </p>
        </section>

        <section className="h-screen flex flex-col justify-center items-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 max-w-7xl w-full text-center">
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faStopwatch20}
                size="7x"
                className="text-gray-950"
              />
              <h3 className="mt-6 text-2xl font-semibold text-gray-950">
                Fast & Smooth
              </h3>
              <p className="mt-3 text-gray-600 max-w-sm">
                Optimized performance lets you browse and checkout in seconds.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faExclamation}
                size="7x"
                className="text-gray-950"
              />
              <h3 className="mt-6 text-2xl font-semibold text-gray-950">
                Exclusive Offers
              </h3>
              <p className="mt-3 text-gray-600 max-w-sm">
                Unlock app-only discounts, flash sales, and curated deals.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faShield}
                size="7x"
                className="text-gray-950"
              />
              <h3 className="mt-6 text-2xl font-semibold text-gray-950">
                Secure & Reliable
              </h3>
              <p className="mt-3 text-gray-600 max-w-sm">
                Your data and transactions are protected with top-tier security.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FontAwesomeIcon
                icon={faBell}
                size="7x"
                className="text-gray-950"
              />

              <h3 className="mt-6 text-2xl font-semibold text-gray-950">
                Realtime Notifications
              </h3>
              <p className="mt-3 text-gray-600 max-w-sm">
                Get to know parcel status, location and delivery right at your
                notification.
              </p>
            </div>
          </div>
        </section>

        <section className="h-screen flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-950">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Try the app on your device:
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="https://assets.ulishastore.com/android/ulishastore.apk"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download for Android
            </Link>
            <button
              onClick={handleInstallClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download for Desktop
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-500 italic">
            iOS version is coming soon. Stay tuned!
          </p>
        </section>
      </div>
    </>
  );
}
