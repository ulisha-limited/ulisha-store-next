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
  faChartLine,
  faChevronRight,
  faClock,
  faCommentDots,
  faCreditCard,
  faEllipsis,
  faGear,
  faMessage,
  faRepeat,
  faTruckFast,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function MyAccount() {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const ADMIN_EMAILS = [
    "paulelite606@gmail.com",
    "obajeufedo2@gmail.com",
    "mrepol742@gmail.com",
  ];

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
            <FontAwesomeIcon icon={faCaretDown} size="xl" />
          </div>
        </div>

        {ADMIN_EMAILS.includes(user?.email ?? "") && (
          <div className="bg-white shadow-md rounded-lg mb-6">
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <span>Admin Control</span>
                 
              </div>

              <div className="flex justify-around items-center">
                <Link
                  href="/my-account/admin/dashboard"
                  className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="mb-3"
                    size="2x"
                  />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/my-account/admin/orders"
                  className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
                >
                  <FontAwesomeIcon icon={faBox} className="mb-3" size="2x" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/my-account/admin/products"
                  className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    className="mb-3"
                    size="2x"
                  />
                  <span>Products</span>
                </Link>
                <Link
                  href="/my-account/admin/users"
                  className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="mb-3"
                    size="2x"
                  />
                  <span>Users</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <span>My Orders</span>
              <Link
                href="/my-account/orders"
                className="text-gray-500 hover:text-orange-500 flex items-center space-x-2"
              >
                <span>View all</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </div>

            <div className="flex justify-around items-center">
              <Link
                href="/my-account/orders?status=to-pay"
                className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faCreditCard}
                  className="mb-3"
                  size="2x"
                />
                <span>To Pay</span>
              </Link>
              <Link
                href="/my-account/orders?status=to-ship"
                className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon icon={faBox} className="mb-3" size="2x" />
                <span>To Ship</span>
              </Link>
              <Link
                href="/my-account/orders?status=to-receive"
                className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className="mb-3"
                  size="2x"
                />
                <span>To Receive</span>
              </Link>
              <Link
                href="/my-account/orders?status=to-review"
                className={`hover:text-orange-500 text-gray-700 flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="mb-3"
                  size="2x"
                />
                <span>To Review</span>
              </Link>
              <Link
                href="/my-account/orders?status=refund"
                className={`hover:text-orange-500 text-gray-700 hidden md:flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  className="mb-3"
                  size="2x"
                />
                <span>Refund</span>
              </Link>
              <Link
                href="/my-account/orders?status=cancel"
                className={`hover:text-orange-500 text-gray-700 hidden md:flex flex-col items-center justify-center text-xs p-2 transition-colors`}
              >
                <FontAwesomeIcon icon={faXmark} className="mb-3" size="2x" />
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <span>More</span>
            </div>

            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              <Link
                href="/my-account/settings"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faGear} size="xl" />
                <span>Settings</span>
              </Link>
              <Link
                href="/message"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faMessage} size="xl" />
                <span>Messages</span>
              </Link>
              <Link
                href="/recently-viewed"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faClock} size="xl" />
                <span>Recently viewed</span>
              </Link>
              <Link
                href="/buy-again"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#FF6600] transition-colors"
              >
                <FontAwesomeIcon icon={faRepeat} size="xl" />
                <span>Buy Again</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
