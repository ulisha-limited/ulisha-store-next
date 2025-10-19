/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleExclamation,
  faCircleInfo,
  faMapPin,
  faCreditCard,
  faCircleCheck,
  faCircleXmark,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyStore } from "@/store/currencyStore";
import { supabase } from "@/lib/supabase";
import { Database } from "@/supabase-types";
import Image from "next/image";

type Product = Database["public"]["Tables"]["products"]["Row"];
type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
type UserAddress = Database["public"]["Tables"]["user_addresses"]["Row"];

export default function Checkout() {
  const { items, loading: cartLoading, fetchCart, clearCart } = useCartStore();

  const user = useAuthStore((state) => state.user);
  const { formatPrice } = useCurrencyStore();
  const router = useRouter();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null,
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash_on_delivery"); // Default
  const [loading, setLoading] = useState(true);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Calculate subtotal and total

  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + (item.product?.price || 0) * item.quantity;
    // return sum + 0 * item.quantity;
  }, 0);
  const deliveryFee = 0; // Placeholder for delivery fee
  const total = subtotal + deliveryFee;

  const showAppNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  ); // Fetch cart and addresses on component mount

  useEffect(() => {
    const loadCheckoutData = async () => {
      setLoading(true);
      setError(null);
      if (!user) {
        showAppNotification("Please log in to proceed to checkout.", "error");
        router.push("/login");
        setLoading(false);
        return;
      }

      await fetchCart(); // Ensure cart is up-to-date

      try {
        const { data: userAddresses, error: addressError } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_primary", { ascending: false }); // Fetch primary first

        if (addressError) {
          throw new Error(`Failed to fetch addresses: ${addressError.message}`);
        }

        setAddresses(userAddresses);
        if (userAddresses && userAddresses.length > 0) {
          // Select the primary address or the first one if no primary
          const primary =
            userAddresses.find((addr) => addr.is_primary) || userAddresses[0];
          setSelectedAddress(primary);
        } else {
          showAppNotification(
            "No delivery address found. Please add one in your profile.",
            "error",
          );
          router.push("/profile/addresses");
        }
      } catch (err: unknown) {
        console.error("Error loading checkout data:", err);
        if (
          err &&
          typeof err === "object" &&
          "message" in err &&
          typeof (err as { message?: string }).message === "string"
        ) {
          setError((err as { message: string }).message);
        } else {
          setError("Failed to load checkout information.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [user, fetchCart, router, showAppNotification]);

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!selectedAddress) {
      setError("Please select a delivery address.");
      showAppNotification("Please select a delivery address.", "error");
      return;
    }
    if (!selectedPaymentMethod) {
      setError("Please select a payment method.");
      showAppNotification("Please select a payment method.", "error");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty. Cannot place an empty order.");
      showAppNotification(
        "Your cart is empty. Cannot place an empty order.",
        "error",
      );
      return;
    }

    setCheckoutProcessing(true);
    setError(null); // Clear previous errors

    try {
      const deliveryAddressString = `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zip ? `, ${selectedAddress.zip}` : ""} : ""}`;

      const cartItemsForRpc = items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        // price: item.product.price,
        // variant_id: item.variant_id || null,
        // selected_color: item.selected_color || null,
        // selected_size: item.selected_size || null,
      })); // Call Supabase RPC function to create order and order items

      const { data: newOrderId, error: orderError } = await supabase.rpc(
        "create_order_with_items",
        {
          p_user_id: user.id, // user.id should be available here due to earlier check
          p_total: total,
          p_delivery_fee: deliveryFee,
          p_delivery_fee_paid: deliveryFee === 0, // Or based on actual payment logic
          p_payment_option: "full", // Assuming full payment for simplicity
          p_delivery_name: selectedAddress.name,
          p_delivery_phone: selectedAddress.phone_no,
          p_delivery_address: deliveryAddressString,
          p_payment_method: selectedPaymentMethod,
          p_cart_items: JSON.stringify(cartItemsForRpc),
        },
      );

      if (orderError) {
        console.error("Supabase Order creation error:", orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!newOrderId) {
        throw new Error(
          "Order creation failed - no order ID returned from Supabase.",
        );
      } // Fetch the newly created order with its items for the WhatsApp message

      const { data: updatedOrder, error: fetchOrderError } = await supabase
        .from("orders")
        .select(
          `
          id,
          total,
          delivery_name,
          delivery_phone,
          delivery_address,
          payment_method,
          items:order_items (
            id,
            product_id,
            quantity,
            price,
            selected_color,
            selected_size,
            product:products (
              name,
              image,
              price,
              category
            )
          )
          `,
        )
        .eq("id", newOrderId)
        .single();

      if (fetchOrderError) {
        console.error("Error fetching updated order:", fetchOrderError);
        throw fetchOrderError;
      }

      if (!updatedOrder) {
        throw new Error("Failed to retrieve order details after creation.");
      } // Generate and open WhatsApp message

      await clearCart(); // Clear cart after successful order
      showAppNotification(
        "Order placed successfully! Redirecting to orders...",
        "success",
      );
      router.push("/orders"); // Redirect to an orders page, or confirmation page
    } catch (err: unknown) {
      console.error("Checkout Error:", err);
      const errorMessage =
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
          ? (err as { message: string }).message
          : "Failed to place order.";
      setError(errorMessage);
      showAppNotification(errorMessage, "error");
    } finally {
      setCheckoutProcessing(false);
      setShowConfirmModal(false); // Close modal regardless of success/failure
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faSpinner}
          className="h-8 w-8 animate-spin text-primary-orange"
        />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center p-6 bg-white rounded-lg shadow-xl animate-fade-in max-w-sm w-full">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="h-20 w-20 text-gray-400 mx-auto mb-6 drop-shadow-md"
          />

          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            Your cart is empty!
          </h2>

          <p className="text-base text-gray-600 mb-6">
            Looks like you haven&apos;t added anything yet.
          </p>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-orange hover:bg-primary-orange/90 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-6 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-10 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center space-x-2 sm:space-x-3">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="h-7 w-7 sm:h-8 sm:w-8 text-primary-orange"
              />
              <span>Checkout</span>
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
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="w-5 h-5 mr-2 flex-shrink-0"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="w-5 h-5 mr-2 flex-shrink-0"
                />
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

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-start animate-fade-in">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          {/* Order Summary Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3 border-gray-200">
              Order Summary
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-base text-gray-700">
                <span>Subtotal ({items.length} items):</span>

                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center text-base text-gray-700">
                <span>Delivery Fee:</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-orange-500 pt-3 border-t border-gray-200 mt-3">
                <span>Total:</span>
                <span className="text-primary-orange">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
          {/* Delivery Address Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b pb-3 border-gray-200">
              <FontAwesomeIcon
                icon={faMapPin}
                className="h-6 w-6 text-primary-orange"
              />
              <span>Delivery Address</span>
            </h3>

            {addresses.length === 0 ? (
              <div className="p-4 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg flex items-start">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
                />

                <p className="text-sm">
                  You don&apos;t have any saved addresses. Please
                  <button
                    onClick={() => router.push("/profile/addresses")}
                    className="text-blue-700 underline hover:no-underline font-medium"
                  >
                    add one in your profile settings
                  </button>
                  to proceed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                      selectedAddress?.id === address.id
                        ? "border-primary-orange ring-2 ring-primary-orange bg-primary-orange/5"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={address.id}
                      checked={selectedAddress?.id === address.id}
                      onChange={() => setSelectedAddress(address)}
                      className="form-radio h-4 w-4 text-primary-orange border-gray-300 focus:ring-primary-orange cursor-pointer"
                    />

                    <div className="ml-3 text-sm flex-grow">
                      <p className="font-semibold text-gray-900">
                        {address.name} ({address.phone_no})
                      </p>

                      <p className="text-gray-700">
                        {address.street}, {address.city}, {address.state}
                        {address.zip}
                      </p>

                      <p className="text-gray-700">
                        {address.notes ? `Note: ${address.notes}` : ""}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Payment Method Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2 border-b pb-3 border-gray-200">
              <FontAwesomeIcon
                icon={faCreditCard}
                className="h-6 w-6 text-primary-orange"
              />
              <span>Payment Method</span>
            </h3>

            <div className="space-y-4">
              <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                  selectedPaymentMethod === "mix_pay"
                    ? "border-primary-orange ring-2 ring-primary-orange bg-primary-orange/5"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mix_pay"
                  checked={selectedPaymentMethod === "mix_pay"}
                  onChange={() => setSelectedPaymentMethod("mix_pay")}
                  className="form-radio h-4 w-4 text-primary-orange border-gray-300 focus:ring-primary-orange cursor-pointer"
                />

                <div className="ml-3 text-sm flex flex-column gap-2">
                  <Image
                    src="/vendor/MixPay Protocol/MixPay Protocol_id4GAN0jCM_2.jpeg"
                    width="50"
                    height="50"
                    alt="MixPay"
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      MixPay (Crypto)
                    </p>

                    <p className="text-gray-700">
                      Pay securely with a wide range of cryptocurrencies via
                      MixPay network.
                    </p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                  selectedPaymentMethod === "paystack"
                    ? "border-primary-orange ring-2 ring-primary-orange bg-primary-orange/5"
                    : "border-gray-300 hover:border-gray-400 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paystack"
                  checked={selectedPaymentMethod === "paystack"}
                  onChange={() => setSelectedPaymentMethod("paystack")}
                  className="form-radio h-4 w-4 text-primary-orange border-gray-300 focus:ring-primary-orange cursor-pointer"
                />

                <div className="ml-3 text-sm flex flex-column gap-2">
                  <Image
                    src="/vendor/Paystack/Paystack_idoIEO_8K-_0.jpeg"
                    width="50"
                    height="50"
                    alt="Paystack"
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Paystack (Card & Wallet)
                    </p>

                    <p className="text-gray-700">
                      Pay instantly using cards, bank transfer, or e-wallets
                      with Paystack.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
          {/* Place Order Button */}
          <button
            onClick={() => setShowConfirmModal(true)} // Show confirmation modal
            disabled={
              checkoutProcessing || !selectedAddress || items.length === 0
            }
            className={`w-full inline-flex items-center bg-orange-400 justify-center px-6 py-3 sm:py-4 rounded-full text-white text-base sm:text-lg font-semibold tracking-wide transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg
              ${
                checkoutProcessing || !selectedAddress || items.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-orange hover:bg-primary-orange-dark focus:outline-none focus:ring-4 focus:ring-primary-orange/50"
              }`}
          >
            {checkoutProcessing ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3"
              />
            ) : (
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3"
              />
            )}

            {checkoutProcessing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform animate-scale-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Your Order
            </h3>

            <p className="text-gray-700 mb-6">
              You are about to place an order for
              <span className="font-semibold text-primary-orange">
                {" "}
                {formatPrice(total)}{" "}
              </span>
              to be delivered to
              <span className="font-semibold text-gray-900">
                {" "}
                {selectedAddress?.name}
              </span>
              .
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={checkoutProcessing}
              >
                Cancel
              </button>

              <button
                onClick={handlePlaceOrder}
                className="px-5 py-2 rounded-full bg-orange-400 text-white hover:bg-primary-orange-dark transition-colors flex items-center"
                disabled={checkoutProcessing}
              >
                {checkoutProcessing && (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="animate-spin h-4 w-4 mr-2"
                  />
                )}
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
