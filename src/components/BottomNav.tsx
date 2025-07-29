"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  Group,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : "";
};

export default function BottomNav() {
  const location = { pathname: usePathname() };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuthStore((state) => state);

  /*
   * Check if the user is an admin based on their email.
   * Need changes to role base restrictions in the future.
   * For now, we use a hardcoded list of admin emails.
   * This should be replaced with a more secure method in production.
   */
  const ADMIN_EMAILS = [
    "paulelite606@gmail.com",
    "obajeufufredo2@gmail.com",
    "mrepol742@gmail.com",
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-800 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname === "/" ? "text-[#FF6600]" : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        {user && user.email && ADMIN_EMAILS.includes(user.email) && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center text-xs p-2 ${
              location.pathname === "/admin"
                ? "text-[#FF6600]"
                : "text-gray-400"
            } hover:text-[#FF6600] transition-colors`}
          >
            <LayoutDashboard className="h-5 w-5 mb-1" />
            <span>Admin Panel</span>
          </Link>
        )}
        <Link
          href="/category"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname.startsWith("/category")
              ? "text-[#FF6600]"
              : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <Group className="h-5 w-5 mb-1" />
          <span>Categories</span>
        </Link>
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname === "/orders" ? "text-[#FF6600]" : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          <span>Orders</span>
        </Link>

        {/* User profile / Login */}
        {!!user ? (
          <>
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex flex-col items-center justify-center text-xs p-2 focus:outline-none ${
                  isProfileOpen ? "text-[#FF6600]" : "text-gray-400"
                } hover:text-[#FF6600] transition-colors`}
              >
                <div
                  className="rounded-full bg-orange-500 flex items-center justify-center mb-1"
                  style={{
                    width: "40px",
                    height: "40px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                >
                  {getInitials(user?.user_metadata?.full_name)}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link
            href="/login"
            className={`flex flex-col items-center justify-center text-xs p-2 ${
              location.pathname === "/login"
                ? "text-[#FF6600]"
                : "text-gray-400"
            } hover:text-[#FF6600] transition-colors`}
          >
            <UserIcon className="h-5 w-5 mb-1" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
