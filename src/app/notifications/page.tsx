/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - Ulisha Store",
  description: "View your notifications and updates",
};

export default function Notification() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
        <p className="text-gray-700">
          No notifications available at the moment.
        </p>
      </div>
    </div>
  );
}
