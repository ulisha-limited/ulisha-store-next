/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faPlusCircle,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { toast } from "react-toastify";
// Example data type for a payment method
interface PaymentMethod {
  id: string;
  type: "card" | "bank_account";
  last4: string;
  brand?: string;
  is_default: boolean;
  expires?: string; // MM/YY for cards
}

export default function PaymentSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expires: "12/26",
      is_default: true,
    },
    {
      id: "pm_2",
      type: "card",
      brand: "Mastercard",
      last4: "5555",
      expires: "08/25",
      is_default: false,
    },
  ]); // Mock data, fetch from backend in real app

  const handleDeletePaymentMethod = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this payment method?"))
      return;
    setLoading(true);
    setTimeout(() => {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      toast.success("Payment method deleted successfully!");
      setLoading(false);
    }, 500);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          is_default: pm.id === id,
        }))
      );
      toast.success("Default payment method updated successfully!");
      setLoading(false);
    }, 500);
  };

  const handleAddPaymentMethod = () => {
    toast.success(
      "This feature is under development. Please check back later."
    );
  };

  return (
    // Apply font-sans to the top-level div for general text.
    // Ensure Montserrat is configured for font-sans in your tailwind.config.js
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center mb-8">
          <Link
            href="/my-account/settings"
            className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back to settings"
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} className="w-6 h-6 text-gray-700" />
          </Link>
          {/* Reduced font size for the heading */}
          <h1 className="text-2xl font-extrabold text-gray-900">
            Payment Settings
          </h1>
        </div>

        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Your Payment Methods
            </h2>
            <button
              onClick={handleAddPaymentMethod}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-500/90 flex items-center space-x-1.5 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="w-4 h-4" />
              <span>Add New Method</span>
            </button>
          </div>
          <div className="p-6">
            {loading && (
              <div className="text-center text-gray-500 py-4">
                Loading payment methods...
              </div>
            )}
            {!loading && paymentMethods.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No payment methods added yet.
              </div>
            )}
            {!loading && paymentMethods.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-1">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="border border-gray-200 rounded-lg p-4 relative bg-gray-50 flex items-center space-x-4"
                  >
                    {method.is_default && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <FontAwesomeIcon icon={faCreditCard} className="w-8 h-8 text-gray-600" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {method.type === "card"
                          ? `${method.brand} Card`
                          : "Bank Account"}{" "}
                        ending in {method.last4}
                      </p>
                      {method.expires && (
                        <p className="text-sm text-gray-600">
                          Expires: {method.expires}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm justify-end">
                      {!method.is_default && (
                        <button
                          onClick={() =>
                            handleSetDefaultPaymentMethod(method.id)
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          disabled={loading}
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
