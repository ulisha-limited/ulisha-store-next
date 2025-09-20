/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faShieldAlt,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { toast } from "react-toastify";

export default function NotificationPreferencesPage() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    security: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  const loadUserPreferences = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_preferences")
        .select("order_updates, promotions, security_alerts")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      // if (data) {
      //   setNotifications({
      //     orderUpdates: data.order_updates ?? true,
      //     promotions: data.promotions ?? true,
      //     security: data.security_alerts ?? true,
      //   });
      // }
    } catch (error) {
      console.error("Error loading notification preferences:", error);
      toast.error(
        "Failed to load notification preferences. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

  const handleNotificationChange = async (type: keyof typeof notifications) => {
    if (!user) {
      return toast.error("Please log in to change notification preferences.");
    }

    try {
      setLoading(true);
      const updates = { ...notifications, [type]: !notifications[type] };
      setNotifications(updates); // Optimistic update

      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          order_updates: updates.orderUpdates,
          promotions: updates.promotions,
          security_alerts: updates.security,
          // If 'currency' is part of user_preferences and you want to preserve it,
          // you'd need to fetch its current value before upserting or pass it from context.
          // For now, assuming only these fields are updated here.
        },
        { onConflict: "user_id" }
      );

      if (error) throw error;
      toast.success("Notification preferences updated successfully");
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error(
        "Failed to update notification preferences. Please try again."
      );
      // Revert on error
      setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 font-sans">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <div className="flex items-center mb-8">
      <Link
        href="/my-account/settings"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Go back to settings"
      >
        <FontAwesomeIcon icon={faCircleChevronLeft} className="w-6 h-6 text-gray-700" />
      </Link>
      <h1 className="ml-4 text-2xl font-extrabold text-gray-900">
        Notification Settings
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
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Order Updates</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications about your orders
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => handleNotificationChange("orderUpdates")}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Promotions</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications about deals and offers
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={() => handleNotificationChange("promotions")}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Security Alerts</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications about security updates
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.security}
                    onChange={() => handleNotificationChange("security")}
                    className="sr-only peer"
                    disabled={loading}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
