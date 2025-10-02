/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { create } from "zustand";
import cookies from "js-cookie";
import { supabase } from "@/lib/supabase";

interface CurrencyState {
  currency: "NGN" | "USD";
  exchangeRate: number;
  loading: boolean;
  error: string | null;
  setCurrency: (currency: "NGN" | "USD") => Promise<void>;
  formatPrice: (price: number) => string;
  convertPrice: (price: number) => number;
  initialize: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: cookies.get("currency") as "NGN" | "USD",
  exchangeRate: 1630, // 1 USD = 1630 NGN
  loading: false,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null });

      // Get currency from cookies first
      const savedCurrency = cookies.get("currency") as "NGN" | "USD";
      if (savedCurrency) {
        set({ currency: savedCurrency });
      }

      // Try to get user preference from database
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("user_preferences")
          .select("currency")
          .eq("user_id", session.user.id)
          .single();

        if (!error && data?.currency) {
          cookies.set("currency", data.currency, { expires: 365 });
          set({ currency: data.currency as "NGN" | "USD" });
        }
      }
    } catch (error) {
      console.error("Error initializing currency:", error);
      set({ error: "Failed to load currency preferences" });
    } finally {
      set({ loading: false });
    }
  },

  setCurrency: async (currency) => {
    try {
      set({ loading: true, error: null });

      // Update cookies immediately
      cookies.set("currency", currency, { expires: 365 });
      set({ currency });

      // Try to save to database if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { error } = await supabase.from("user_preferences").upsert({
          user_id: session.user.id,
          currency,
        });

        if (error) {
          console.error("Error saving currency preference:", error);
          // Don't throw error, just log it since cookies update succeeded
        }
      }

      // Notify other components of currency change
      window.dispatchEvent(
        new CustomEvent("currencyChange", {
          detail: { currency },
        })
      );
    } catch (error) {
      console.error("Error updating currency:", error);
      set({ error: "Failed to update currency preference" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  convertPrice: (price) => {
    const { currency, exchangeRate } = get();

    if (currency === "USD") {
      return price / exchangeRate;
    }

    return price;
  },

  formatPrice: (price) => {
    const { currency, exchangeRate } = get();

    if (currency === "USD") {
      const usdPrice = price / exchangeRate;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(usdPrice);
    }

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },
}));
