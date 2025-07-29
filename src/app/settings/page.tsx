"use client";

import { useState } from "react";
import {
  DollarSign,
  Bell,
  Lock,
  User,
  MapPin,
  ChevronRightIcon,
  CreditCard,
  Shield,
  Globe,
  Languages,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import cookies from "js-cookie";

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      cookies.remove("partnero_session_uuid");
      cookies.remove("currency");
      setLoading(false);
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Settings</h1>
        <div className="space-y-6">
          {/* Account Settings */}
          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Account Settings
              </h2>
            </div>
            <div className="p-6 space-y-2">
              <div className="flex items-center space-x-3 py-2">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Navigation Items */}
              <Link
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-md -mx-2 px-2"
                href="/settings/account-security"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    Account & Security
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 rounded-md -mx-2 px-2"
                href="/settings/account-switch"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Account Switch</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-0">
              {/* Address Management */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/address-management"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    Address Management
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Payment Settings */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/payment-settings"
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Payment Settings</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Privacy */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/privacy"
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Privacy</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Country/Region */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/country-region"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Country/Region</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Global</span>{" "}
                  {/* Placeholder or actual value */}
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              {/* Language */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/language"
              >
                <div className="flex items-center space-x-3">
                  <Languages className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Language</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">English</span>{" "}
                  {/* Placeholder or actual value */}
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              {/* Notification Settings */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/notification-preferences"
              >
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    Notification Settings
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              {/* AI & Searching Settings */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/ai-searching-settings"
              >
                <div className="flex items-center space-x-3">
                  <SettingsIcon className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    AI & Searching Settings
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Currency Preferences */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/settings/currency-preferences"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">
                    Currency Preferences
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full text-center py-3 text-lg font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? "Logging out..." : "Log out"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
