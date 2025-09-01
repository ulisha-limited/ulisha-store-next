/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { useRouter } from "next/router";
import { faSpinner, faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CheckoutButton = () => {
  const router = useRouter();

  const isCheckoutDisabled = false;
  const checkoutLoading = false;

  const handleProceedToCheckout = () => {
    if (!isCheckoutDisabled && !checkoutLoading) {
      router.push("/checkout");
    }
  };

  return (
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
        <FontAwesomeIcon icon={faCartShopping} className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
      )}
      {checkoutLoading ? "Processing Order..." : "Proceed to Checkout"}
    </button>
  );
};

export default CheckoutButton;
