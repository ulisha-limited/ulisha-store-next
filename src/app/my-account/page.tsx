/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useAuthStore } from "@/store/authStore";
import {
  faArrowRightArrowLeft,
  faBox,
  faCaretDown,
  faChevronRight,
  faCommentDots,
  faCreditCard,
  faEllipsis,
  faTruckFast,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyAccount() {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div
              className="rounded-full bg-orange-500 flex items-center justify-center"
              style={{ width: "40px", height: "40px", color: "white" }}
            >
              {getInitials(user?.user_metadata?.full_name)}
            </div>
            <h1 className="me-3 text-3xl">{user?.user_metadata?.full_name}</h1>
          </div>
          <div>
            <FontAwesomeIcon icon={faCaretDown} className="text-gray-600" size="xl" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-gray-600">My Orders</span>
            <div>
              <span className="text-gray-600">All</span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-gray-600"
              />
            </div>
          </div>
          <div className="flex justify-around items-center">
            <Link
              href="/my-account/orders?status=to-pay"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faCreditCard}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">To Pay</span>
            </Link>
            <Link
              href="/my-account/orders?status=to-ship"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faBox}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">To Ship</span>
            </Link>
            <Link
              href="/my-account/orders?status=to-receive"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faTruckFast}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">To Receive</span>
            </Link>
            <Link
              href="/my-account/orders?status=to-review"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faCommentDots}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">To Review</span>
            </Link>
            <Link
              href="/my-account/orders?status=refund"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faArrowRightArrowLeft}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">Refund</span>
            </Link>
            <Link
              href="/my-account/orders?status=cancel"
              className={`flex flex-col items-center justify-center text-xs p-2 ${
                location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
              } hover:text-[#FF6600] transition-colors`}
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="mb-3 text-gray-600"
                size="2x"
              />
              <span className="text-gray-600">Cancel</span>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-gray-600">More</span>
          </div>

          <div className="grid grid-cols-2 gap-4 px-4 pb-4">
            <Link
              href="/my-account/settings"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/message"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link
              href="/recently-viewed"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              <span>Recently viewed</span>
            </Link>
            <Link
              href="/buy-again"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              <span>Buy Again</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
