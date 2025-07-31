/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import {
  Loader,
  X,
  Plus,
  Users,
  Eye,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { toast } from "react-toastify";

interface AnalyticsData {
  totalUsers: number;
  todayVisitors: number;
  todayPageViews: number;
  todayNewUsers: number;
  todayOrders: number;
  todayRevenue: number;
  weeklyStats: Array<{
    date: string;
    unique_visitors: number;
    page_views: number;
    new_users: number;
    orders_count: number;
    revenue: number;
  }>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [showAdForm, setShowAdForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const adImageRef = useRef<HTMLInputElement>(null);

  const [adData, setAdData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    button_text: "",
    button_link: "",
    active: true,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);

      // Get today's stats
      const today = new Date().toISOString().split("T")[0];
      const { data: todayStats } = await supabase
        .from("analytics_daily_stats")
        .select("*")
        .eq("date", today)
        .single();

      // Get last 7 days stats
      const { data: weeklyStats } = await supabase
        .from("analytics_daily_stats")
        .select("*")
        .gte(
          "date",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        )
        .order("date", { ascending: true });

      // Update daily stats
      await supabase.rpc("update_daily_stats");

      setAnalytics({
        totalUsers: 0, // Will be updated when we have proper RPC function
        todayVisitors: todayStats?.unique_visitors || 0,
        todayPageViews: todayStats?.page_views || 0,
        todayNewUsers: todayStats?.new_users || 0,
        todayOrders: todayStats?.orders_count || 0,
        todayRevenue: todayStats?.revenue || 0,
        weeklyStats: weeklyStats || [],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
      setLoading(false);
    }
  };

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adData.image) {
      alert("Please select an advertisement image");
      return;
    }

    try {
      setFormLoading(true);

      const imageName = `${uuidv4()}-${adData.image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("advertisements")
        .upload(imageName, adData.image);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl: imageUrl },
      } = supabase.storage.from("advertisements").getPublicUrl(imageName);

      const { error: insertError } = await supabase
        .from("advertisements")
        .insert([
          {
            title: adData.title,
            description: adData.description,
            image_url: imageUrl,
            button_text: adData.button_text,
            button_link: adData.button_link,
            active: adData.active,
          },
        ]);

      if (insertError) throw insertError;

      setAdData({
        title: "",
        description: "",
        image: null,
        button_text: "",
        button_link: "",
        active: true,
      });

      if (adImageRef.current) adImageRef.current.value = "";

      setShowAdForm(false);
      toast.success("Advertisement added successfully!");
    } catch (error) {
      console.error("Error saving advertisement:", error);
      toast.error("Error saving advertisement. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAdImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAdData({ ...adData, image: e.target.files[0] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back to admin panel"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>

            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAdForm(!showAdForm)}
              className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Place advert</span>
            </button>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
            <Loader className="w-6 h-6 animate-spin text-primary-orange mr-2" />
            <span>Loading analytics...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                    <p className="text-xs text-gray-500">Coming soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Today&apos;s Visitors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.todayVisitors || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Page Views Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.todayPageViews || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Orders Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.todayOrders || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      New Users Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics?.todayNewUsers || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Revenue Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(analytics?.todayRevenue || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Stats Table */}
            {analytics?.weeklyStats && analytics.weeklyStats.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Last 7 Days Performance
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visitors
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Page Views
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            New Users
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Orders
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {analytics.weeklyStats.map((stat, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(stat.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.unique_visitors}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.page_views}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.new_users}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {stat.orders_count}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Intl.NumberFormat("en-NG", {
                                style: "currency",
                                currency: "NGN",
                              }).format(stat.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advertisement Form */}
      {showAdForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Add New Advertisement
            </h2>
            <button
              onClick={() => setShowAdForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleAdSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={adData.title}
                onChange={(e) =>
                  setAdData({ ...adData, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={adData.description}
                onChange={(e) =>
                  setAdData({ ...adData, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                ref={adImageRef}
                accept="image/*"
                required
                onChange={handleAdImageSelect}
                className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-orange-500 file:text-white
                    hover:file:bg-orange-500/90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Button Text
              </label>
              <input
                type="text"
                required
                value={adData.button_text}
                onChange={(e) =>
                  setAdData({ ...adData, button_text: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Button Link
              </label>
              <input
                type="text"
                required
                value={adData.button_link}
                onChange={(e) =>
                  setAdData({ ...adData, button_link: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-orange focus:ring-primary-orange"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={adData.active}
                onChange={(e) =>
                  setAdData({ ...adData, active: e.target.checked })
                }
                className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
              />
              <label
                htmlFor="active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAdForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-500/90 transition-colors flex items-center space-x-2"
              >
                {formLoading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add Advertisement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
