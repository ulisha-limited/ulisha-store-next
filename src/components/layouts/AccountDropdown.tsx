/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCartShopping,
  faEye,
  faGears,
  faRepeat,
  faShoppingBag,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export function AccountDropdown({
  isOpen,
  isMobile,
}: {
  isOpen: boolean;
  isMobile: boolean;
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black/5 z-50"
        >
          <div className="py-2">
            <div className="px-4 pb-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">
                {user?.user_metadata?.full_name}
              </h3>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {!isMobile && (
              <>
                <Link
                  href="/cart"
                  prefetch={false}
                  className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    className=" text-gray-500"
                  />
                  <span>Your Cart</span>
                </Link>
                <Link
                  href="/my-account/orders"
                  prefetch={false}
                  className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faBell} className=" text-gray-500" />
                  <span>Your Notifications</span>
                </Link>
              </>
            )}
            <Link
              href="/my-account/orders"
              prefetch={false}
              className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faCartShopping}
                className=" text-gray-500"
              />
              <span>Your Orders</span>
            </Link>
            <Link
              href="/recently-viewed"
              prefetch={false}
              className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faEye} className=" text-gray-500" />
              <span>Recently Viewed</span>
            </Link>
            <Link
              href="/buy-again"
              prefetch={false}
              className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faRepeat} className=" text-gray-500" />
              <span>Buy Again</span>
            </Link>
            <Link
              href="/my-account"
              prefetch={false}
              className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faGears} className=" text-gray-500" />
              <span>Settings</span>
            </Link>

            <hr className="my-1" />
            <Link
              href="/logout"
              prefetch={false}
              className="text-sm flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faSignOut} className=" text-gray-500" />
              <span>Sign out</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
