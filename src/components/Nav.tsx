"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Mail,
  Camera,
  Search,
  Heart,
  ShoppingCart,
  LogIn,
  LogOut,
  Settings,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCategoryStore } from "@/store/categoryStore";
import { usePathname, useSearchParams } from "next/navigation";

export default function Nav() {
  const location = { pathname: usePathname() };
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, signOut } = useAuthStore((state) => state);
  const cartItems = useCartStore((state) => state.items);
  const { categories, fetchCategories } = useCategoryStore();
  const searchParams = useSearchParams();

  /*
   * Check if the user is an admin based on their email.
   * Need changes to role base restrictions in the future.
   * For now, we use a hardcoded list of admin emails.
   * This should be replaced with a more secure method in production.
   */
  const ADMIN_EMAILS = [
    "paulelite606@gmail.com",
    "obajeufedo2@gmail.com",
    "mrepol742@gmail.com",
  ];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleCameraClick = () => {
    alert("Camera icon clicked!");
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#007BFF] pt-2 pb-1 shadow-md z-50 transition-transform duration-300">
      <div className="flex items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center space-x-2 group hidden md:inline mr-3"
        >
          <span className="text-xl lg:text-2xl font-bold">
            <span className="text-[#FF6600]">Ulisha</span>
            <span className="text-white">Store</span>
          </span>
        </Link>
        <Link
          href="/message"
          className="text-white hover:text-[#FF6600] transition-colors mr-3"
        >
          <Mail className="h-5 w-5" />
        </Link>
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-grow flex items-center bg-white rounded-full h-10 px-1 relative"
        >
          <input
            type="text"
            placeholder="Sunglasses Men"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none border-none text-sm px-3 pr-10 text-gray-700" // Input text color
          />
          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute right-10 mx-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500" // Camera icon color
            aria-label="Open camera search"
          >
            <Camera size={20} />
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-1"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </form>
        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="text-white hover:text-[#FF6600] transition-colors mx-2"
        >
          <Heart className="h-5 w-5" />
        </Link>
        {/* Cart */}
        <Link
          href="/cart"
          className="text-white hover:text-[#FF6600] transition-colors hidden md:inline mx-1 relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
              {cartItemCount}
            </span>
          )}
        </Link>
        {/* User profile */}
        {!!user ? (
          <div className="relative profile-menu hidden md:inline">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="text-white hover:text-[#FF6600] transition-colors focus:outline-none mx-2"
            >
              <div
                className="rounded-full bg-orange-500 flex items-center justify-center"
                style={{ width: "40px", height: "40px", color: "white" }}
              >
                {getInitials(user?.user_metadata?.full_name)}
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                {user && user.email && ADMIN_EMAILS.includes(user.email) && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin Panel</span>
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
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsProfileOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="items-center text-white hover:text-[#FF6600] transition-colors hidden md:flex mx-1"
          >
            <LogIn className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Sign In</span>
          </Link>
        )}
      </div>

      {/* Categories (Horizontal Scroll) */}
      <div
        className="flex overflow-x-auto whitespace-nowrap px-4 mt-2"
        style={{ scrollbarWidth: "none" }}
      >
        <Link
          key="all"
          href="/"
          className={`text-white text-sm px-3 py-1 pb-2 font-medium relative ${
            location.pathname === "/" ? "text-orange-300" : ""
          }`}
        >
          All
          {location.pathname === "/" && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-orange-500 rounded-full"></span>
          )}
        </Link>

        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${category.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className={`text-white text-sm px-3 py-1 pb-2 font-medium relative ${
              location.pathname ===
              `/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`
                ? "text-orange-300"
                : ""
            }`}
          >
            {category.name}
            {location.pathname ===
              `/category/${category.name
                .toLowerCase()
                .replace(/\s+/g, "-")}` && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-orange-500 rounded-full"></span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
