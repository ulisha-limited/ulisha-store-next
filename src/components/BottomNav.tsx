"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Home,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  Search,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

const getInitials = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : "";
};

export default function BottomNav() {
  const location = { pathname: usePathname() };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Function to check user session
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
        // Implement logic to check if user is admin (e.g., from user_metadata or a separate 'profiles' table)
        // For demonstration, let's assume an admin role in user_metadata for now
        setIsAdmin(session.user.user_metadata?.role === "admin");
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        checkUser();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center text-xs p-2 ${
            location.pathname.startsWith("/category")
              ? "text-[#FF6600]"
              : "text-gray-400"
          } hover:text-[#FF6600] transition-colors`}
        >
          <Search className="h-5 w-5 mb-1" />{" "}
          {/* Using Search icon for categories */}
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
        {isLoggedIn ? (
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
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
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
