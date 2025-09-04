/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import Link from "next/link";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faTachometerAlt,
  faCog,
  faUser,
  faBell,
} from "@fortawesome/free-solid-svg-icons";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { usePathname } from "next/navigation";

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : "";
};

export default function BottomNav() {
  const location = { pathname: usePathname() };
  const { user } = useAuthStore((state) => state);
  const cartItems = useCartStore((state) => state.items);

  /*
   * Check if the user is an admin based on their email.
   * Need changes to role base restrictions in the future.
   * For now, we use a hardcoded list of admin emails.
   * This should be replaced with a more secure method in production.
   */

  const cartItemCount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <FontAwesomeIcon icon={faHome} className="mb-1" size="xl" />
          <span>Home</span>
        </Link>
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname === "/cart" ? "text-[#FF6600]" : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <span className="relative flex items-center justify-center">
            <FontAwesomeIcon icon={faShoppingCart} className="mb-1" size="xl" />
            {cartItemCount > 0 && (
              <span className="absolute -top-3 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </Link>
        <Link
          href="/notifications"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname.startsWith("/notifications")
              ? "text-[#FF6600]"
              : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <FontAwesomeIcon icon={faBell} className="mb-1" size="xl" />

          <span>Notifications</span>
        </Link>

        {/* User profile / Login */}
        {!!user ? (
          <Link
            href="/my-account"
            className={`flex flex-col items-center justify-center text-xs p-2 ${
              /^my-account/.test(location.pathname)
                ? "text-[#FF6600]"
                : "text-gray-400"
            } hover:text-[#FF6600] transition-colors`}
          >
            <div
              className="rounded-full bg-orange-500 flex items-center justify-center mb-1"
              style={{
                width: "30px",
                height: "30px",
                color: "white",
                fontSize: "1rem",
              }}
            >
              {getInitials(user?.user_metadata?.full_name)}
            </div>
          </Link>
        ) : (
          <Link
            href="/login"
            className={`flex flex-col items-center justify-center text-xs p-2 ${
              location.pathname === "/login"
                ? "text-[#FF6600]"
                : "text-gray-400"
            } hover:text-[#FF6600] transition-colors`}
          >
            <FontAwesomeIcon icon={faUser} className="mb-1" size="xl" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
