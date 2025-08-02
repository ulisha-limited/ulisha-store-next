/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useCurrencyStore } from "@/store/currencyStore";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase"; // Assuming you still need supabase for updates
import Link from "next/link";
import { toast } from "react-toastify";

export default function CurrencyPreferencesPage() {
  const {
    currency,
    setCurrency,
    loading: currencyStoreLoading,
  } = useCurrencyStore();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false); // Local loading for this page
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCurrencyChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCurrency = event.target.value as "NGN" | "USD";
    if (!user) {
      return toast.error("Please log in to change currency preference.");
    }
    try {
      setLoading(true);
      // Assuming setCurrency in your store also updates Supabase
      await setCurrency(newCurrency);
      toast.success("Currency preference updated successfully!");
    } catch (err) {
      console.error("Error updating currency:", err);
      toast.error("Failed to update currency preference. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-8">
          <Link
            href="/settings"
            className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back to settings"
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} className="w-6 h-6 text-gray-700" />
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900">
            Currency Preferences
          </h1>
        </div>

        {(success || error) && (
          <div
            className={`p-4 rounded-md mb-4 ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{success || error}</p>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-4">
                <label
                  htmlFor="currency-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Currency
                </label>
                <div className="relative">
                  <select
                    id="currency-select"
                    name="currency"
                    value={currency}
                    onChange={handleCurrencyChange}
                    disabled={loading || currencyStoreLoading}
                    className={`
                      text-black
                      block w-full
                      px-3 py-2 pr-10
                      text-base sm:text-sm
                      border-gray-300 rounded-md
                      shadow-sm
                      ${
                        loading || currencyStoreLoading
                          ? "opacity-50 cursor-not-allowed bg-gray-100"
                          : "bg-white"
                      }
                    `}
                  >
                    <option value="NGN">Nigerian Naira (NGN) ₦</option>
                    <option value="USD">US Dollar (USD) $</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center justify-between">
                  <span>Current selection:</span>
                  <span className="font-medium text-gray-900">
                    {currency === "NGN"
                      ? "Nigerian Naira (₦)"
                      : "US Dollar ($)"}
                  </span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Exchange rate:</span>
                  <span className="font-medium text-gray-900">
                    1 USD = ₦1,630
                  </span>
                </p>
                {currency === "USD" && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-blue-800 text-sm">
                      <strong>Note:</strong> Prices are converted from Nigerian
                      Naira for display purposes. All payments are processed in
                      NGN through our local payment gateway.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
