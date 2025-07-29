"use client";

import { useState, useEffect } from "react";
import { ChevronRightIcon, LayoutDashboardIcon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  // Initial load for user preferences might still be useful for initial display (e.g., email)
  useEffect(() => {
    // Only fetch user preferences if needed for initial display on THIS page
    // Otherwise, move data fetching to individual sub-pages
  }, [user]);

  const showNotification = (message: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }

    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error logging out:", err);
      showNotification("Failed to log out.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Admin Panel
        </h1>
        {/* Changed to Buyer Settings as per image */}
        {(success || error) && (
          <div
            className={`p-4 rounded-md ${
              success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{success || error}</p>
          </div>
        )}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-0">
              {/* Dashboard */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/admin/dashboard"
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboardIcon className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Dashboard</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
