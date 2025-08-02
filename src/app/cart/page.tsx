/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client"; // This directive makes the component a Client Component in Next.js 13+

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinus,
  faPlus,
  faBagShopping,
  faSpinner,
  faCircleExclamation,
  faCircleInfo,
  faShoppingCart,
  faExclamationCircle,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import type { Product } from "@/store/cartStore";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useCurrencyStore } from "../../store/currencyStore";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabase"; // Ensure this path is correct
import Image from "next/image";

// Define a type for your address structure from 'user_addresses' table
interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state_province: string;
  // Add any other address fields you have, e.g., 'zip_code', 'country'
}

export default function Cart() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    loading: cartLoading,
    fetchCart,
    // clearCart is removed from destructuring here as it's not needed for navigation
    // It would be used on the actual /checkout page after order submission
  } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const { formatPrice } = useCurrencyStore();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Minimum 2 items required for checkout
  const canCheckout = items.length >= 2;

  // Fetch cart on component mount or user change
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // Listen for currency changes (if this is a custom event)
  useEffect(() => {
    const handleCurrencyChange = () => {
      // Force re-render by updating a state (e.g., re-evaluating price displays)
    };

    window.addEventListener("currencyChange", handleCurrencyChange);
    return () =>
      window.removeEventListener("currencyChange", handleCurrencyChange);
  }, []);

  // Effect to manage notification display
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const subtotal = items.reduce((sum, item) => {
    if (item.product) {
      return sum + item.product.price * item.quantity;
    }
    return 0;
  }, 0);

  const total = subtotal; // Total is just subtotal
  const paymentAmount = subtotal; // Payment amount is also just subtotal

  const showAppNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
    },
    []
  );

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      showAppNotification("Failed to update quantity.", "error");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      showAppNotification("Item removed from cart.", "success");
    } catch (error) {
      console.error("Error removing item:", error);
      showAppNotification("Failed to remove item from cart.", "error");
    }
  };

  const handlePayment = async (price: number) => {
    try {
      // const { data } = await axios.post("/api/paystack/initialize", {
      //   email: user?.email,
      //   amount: price,
      // });

      // if (!data.status)
      //   return toast.error(data.message || "Failed to initialize payment");
      // window.location.href = data.data.authorization_url;

      const { data } = await axios.post("/api/mixpay/create-payment", {
        amount: price,
      });
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.paymentUrl) {
        router.push(data.paymentUrl);
      } else {
        throw new Error("Payment URL not returned");
      }
    } catch (error) {
      console.log("Error initializing payment:", error);
      toast.error("Failed to initialize payment");
    }
  };

  /**
   * MODIFIED handleProceedToCheckout FUNCTION:
   * This function now only performs preliminary checks and then navigates
   * to the /checkout page. The actual order creation logic should be
   * moved to the component that lives at the /checkout route.
   */
  const handleProceedToCheckout = async () => {
    setCheckoutLoading(true); // Still show loading state during navigation
    setError(null); // Clear previous errors

    try {
      // TEST ONLY

      const totalPrice = items.reduce((sum, item) => {
        if (item.product) {
          return sum + item.product.price * item.quantity;
        }
        return sum;
      }, 0);
      
      handlePayment(totalPrice);

      // if (!user?.id) {
      //   showAppNotification("Please log in to proceed to checkout.", "error");
      //   router.push("/login");
      //   setCheckoutLoading(false); // Make sure to turn off loading on early exit
      //   return;
      // }

      // // Fetch user's primary address to ensure it exists before proceeding
      // const { data: addresses, error: addressError } = await supabase
      //   .from("user_addresses")
      //   .select("*")
      //   .eq("user_id", user.id)
      //   .order("is_primary", { ascending: false }) // Assuming an 'is_primary' column
      //   .limit(1);

      // if (addressError) {
      //   console.error("Failed to fetch address:", addressError);
      //   showAppNotification(
      //     `Failed to fetch address: ${addressError.message}`,
      //     "error"
      //   );
      //   setCheckoutLoading(false); // Make sure to turn off loading on early exit
      //   return;
      // }

      // if (!addresses || addresses.length === 0) {
      //   showAppNotification(
      //     "Please add a delivery address to your profile before checking out.",
      //     "error"
      //   );
      //   router.push("/profile/addresses");
      //   setCheckoutLoading(false); // Make sure to turn off loading on early exit
      //   return;
      // }

      // router.push("/checkout");
    } finally {
      // The finally block will always execute, ensuring loading is turned off
      // However, for immediate returns within try, we set it manually.
      // For successful navigation, the new page will manage its own loading state.
      setCheckoutLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-xl animate-fade-in max-w-sm w-full">
          <FontAwesomeIcon icon={faShoppingCart} className="h-20 w-20 text-gray-400 mx-auto mb-6 drop-shadow-md" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Your cart is empty!
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Looks like you haven&apos;t added anything yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-orange-500 hover:bg-primary-orange/90 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Determine if checkout button should be disabled
  const isCheckoutDisabled =
    checkoutLoading || !canCheckout || paymentAmount <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-10 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
              <FontAwesomeIcon icon={faShoppingCart} className="h-7 w-7 sm:h-8 sm:w-8 text-orange-500" />
              <span>Your Shopping Cart</span>
            </h2>
          </div>

          {/* Global Notification System */}
          {notification && (
            <div
              className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg animate-fade-in-up ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              } max-w-[calc(100%-2rem)]`}
            >
              {notification.type === "success" ? (
                <FontAwesomeIcon icon={faCircleInfo} className="w-5 h-5 mr-2 flex-shrink-0" />
              ) : (
                <FontAwesomeIcon icon={faCircleExclamation} className="w-5 h-5 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm sm:text-base break-words">
                {notification.message}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <FontAwesomeIcon icon={faCircleXmark} className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main Cart Content: Single column on mobile, two-column on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="divide-y divide-gray-100 space-y-4 sm:space-y-6">
                {items.map((item) => {
                  if (!item.product) return null;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center justify-between py-4 first:pt-0 last:pb-0 group"
                    >
                      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-grow w-full sm:w-auto">
                        <div className="relative flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm border border-gray-100 transition-transform duration-300 group-hover:scale-105"
                            width={96}
                            height={96}
                          />
                          <button
                            onClick={() => handleRemoveItem(item.product_id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-0 group-hover:scale-100 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 z-10"
                            aria-label="Remove item"
                            disabled={cartLoading}
                          >
                            <FontAwesomeIcon icon={faCircleXmark} className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 sm:text-sm">
                            {item.product.category}
                          </p>
                          {(item.selected_color || item.selected_size) && (
                            <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-1 sm:gap-2">
                              {item.selected_color && (
                                <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                  Color: {item.selected_color}
                                </span>
                              )}
                              {item.selected_size && (
                                <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                                  Size: {item.selected_size}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-lg sm:text-xl font-bold text-orange-500 mt-2">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end w-full sm:w-auto mt-3 sm:mt-0">
                        <div className="flex items-center border border-gray-300 rounded-full p-0.5 sm:p-1 shadow-sm bg-gray-50">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity - 1
                              )
                            }
                            className="p-1 sm:p-1.5 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={cartLoading || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-medium text-base sm:text-lg text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product_id,
                                item.quantity + 1
                              )
                            }
                            className="p-1 sm:p-1.5 rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={cartLoading}
                            aria-label="Increase quantity"
                          >
                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-8 self-start bg-gray-50 p-5 rounded-xl shadow-inner border border-gray-200 mt-6 lg:mt-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 border-b pb-3 border-gray-200">
                Order Summary
              </h3>

              {/* Minimum item checkout warning */}
              {!canCheckout && (
                <div className="mb-5 p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg flex items-start animate-fade-in">
                  <FontAwesomeIcon icon={faCircleInfo} className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    You need at least 2 items in your cart to proceed to
                    checkout.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-5 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-start animate-fade-in">
                  <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="flex justify-between items-center text-base sm:text-lg mb-2">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-base sm:text-lg mb-5 pb-4 border-b border-gray-200">
                <span className="text-gray-700">Delivery Fee:</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(0)}{" "}
                </span>
              </div>
              <div className="flex justify-between items-center text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                disabled={isCheckoutDisabled}
                className={`w-full inline-flex items-center justify-center px-6 py-3 sm:py-4 rounded-full text-white text-base sm:text-lg font-semibold tracking-wide transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg
                  ${
                    isCheckoutDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-primary-orange/50"
                  }`}
              >
                {checkoutLoading ? (
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                ) : (
                  <FontAwesomeIcon icon={faBagShopping} className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                )}
                {checkoutLoading
                  ? "Processing Order..."
                  : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
