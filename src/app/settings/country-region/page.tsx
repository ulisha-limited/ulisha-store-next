/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "react-toastify";

interface CountryApiData {
  name: {
    common: string;
  };
  cca2: string;
}

interface Country {
  name: string;
  code: string;
}

export default function CountryRegionPage() {
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        ); // Request only necessary fields
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CountryApiData[] = await response.json();

        const sortedCountries = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(sortedCountries);

        if (user) {
          const { data: userPref, error: userPrefError } = await supabase
            .from("user_preferences")
            .select("country")
            .eq("user_id", user.id)
            .single();

          if (userPrefError && userPrefError.code !== "PGRST116")
            throw userPrefError;

          if (userPref && userPref.country) {
            setSelectedCountry(userPref.country);
          } else if (sortedCountries.length > 0) {
            setSelectedCountry("NG"); // Default to Nigeria if available
          }
        } else if (sortedCountries.length > 0) {
          setSelectedCountry("NG"); // Default for guests
        }
      } catch (err) {
        console.error("Failed to fetch countries or user preference:", err);
        toast.error("Failed to load countries. Please try again later.");
        // Fallback to a predefined list if API fails
        setCountries([
          { name: "Nigeria", code: "NG" },
          { name: "United States", code: "US" },
          { name: "Canada", code: "CA" },
          { name: "United Kingdom", code: "GB" },
        ]);
        setSelectedCountry("NG"); // Set default if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [user]); // Re-run if user changes (e.g., logs in/out)

  const handleCountryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCountryCode = event.target.value;
    setSelectedCountry(newCountryCode); // Optimistic update

    if (!user) {
      return toast.error("Please log in to change your country preference.");
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from("user_preferences")
        .upsert(
          { user_id: user.id, country: newCountryCode },
          { onConflict: "user_id" }
        );

      if (updateError) throw updateError;
      toast.success("Country preference updated successfully!");
    } catch (err) {
      console.error("Error updating country in Supabase:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update country preference. Please try again."
      );
      // Revert if update fails (optional, could also refetch)
      // loadUserPreferences(); // Re-fetch to get the true state
    } finally {
      setLoading(false);
    }
  };

  const currentCountryName =
    countries.find((c) => c.code === selectedCountry)?.name || "Loading...";

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
          {/* Reduced font size for the heading */}
          <h1 className="text-2xl font-extrabold text-gray-900">
            Country/Region
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
                  htmlFor="country-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Select Your Region
                </label>
                <div className="relative">
                  <select
                    id="country-select"
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    disabled={loading || countries.length === 0}
                    className={`
                      text-black
                      block w-full
                      px-3 py-2 pr-10
                      text-base sm:text-sm
                      border-gray-300 rounded-md
                      shadow-sm
                      ${
                        loading || countries.length === 0
                          ? "opacity-50 cursor-not-allowed bg-gray-100"
                          : "bg-white"
                      }
                    `}
                  >
                    {loading && <option value="">Loading countries...</option>}
                    {!loading && countries.length === 0 && (
                      <option value="">No countries available</option>
                    )}
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
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
                  <span>Current Country:</span>
                  <span className="font-medium text-gray-900">
                    {currentCountryName}
                  </span>
                </p>
                <p className="mt-3 p-3 bg-blue-50 rounded-md text-blue-800 text-sm">
                  Your country selection may affect pricing, shipping options,
                  and available payment methods.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
