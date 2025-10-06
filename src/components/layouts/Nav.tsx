/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faSearch,
  faHeart,
  faShoppingCart,
  faBell,
  faRobot,
  faX,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCategoryStore } from "@/store/categoryStore";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { AccountDropdown } from "../AccountDropdown";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { isMobile } from "@/utils/mobile";

// Array of placeholder texts for the search bar
const placeholders = [
  "Sunglasses Men",
  "Blue Sneakers",
  "Vintage T-shirt",
  "Water Bottle",
  "Leather Wallet",
  "Wireless Headphones",
  "Hiking Backpack",
  "Yoga Mat",
  "Smartwatch",
  "Graphic Novel",
];

export function Nav() {
  const location = { pathname: usePathname() };
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user } = useAuthStore((state) => state);
  const cartItems = useCartStore((state) => state.items);
  const { categories, fetchCategories } = useCategoryStore();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobile = isMobile();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Effect to handle the changing placeholder
  useEffect(() => {
    let currentIndex = 0;
    setCurrentPlaceholder(placeholders[currentIndex]);

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[currentIndex]);
    }, 5000); // Change placeholder every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim())
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  /**
   * Handles the camera icon click by programmatically clicking the hidden file input.
   */
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles the file selection event.
   * @param e - The change event from the file input.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file for image search:", file);
      alert(`Searching for image: ${file.name}`);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  const cartItemCount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#007BFF] pb-1 shadow-md z-50 transition-transform duration-300">
      <div className={`bg-gray-900 ${mobile ? "hidden" : "block"}`}>
        <div className="mx-auto px-4 flex flex-row py-2 text-xs text-gray-300 space-x-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-2">
              <Link
                href="https://www.ulishalimited.com/ushop"
                prefetch={false}
                className="hover:underline"
              >
                UShop
              </Link>
              <Link href="/web" prefetch={false} className="hover:underline">
                Download
              </Link>
              <div className="flex flex-row">
                <Link
                  href="https://www.facebook.com/share/1AhYhxox4X/?mibextid=wwXIfr"
                  prefetch={false}
                  className="hover:underline"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </Link>
                <Link
                  href="https://www.pinterest.com/ulishastore"
                  prefetch={false}
                  className="hover:underline"
                >
                  <FontAwesomeIcon icon={faPinterest} />
                </Link>
                <Link
                  href="https://x.com/ulishastores"
                  prefetch={false}
                  className="hover:underline"
                >
                  <FontAwesomeIcon icon={faX} />
                </Link>
                <Link
                  href="https://www.instagram.com/ulisha_store"
                  prefetch={false}
                  className="hover:underline"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </Link>
                <Link
                  href="https://www.tiktok.com/@ulishastores"
                  prefetch={false}
                  className="hover:underline"
                >
                  <FontAwesomeIcon icon={faTiktok} />
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="tel:+2349134781219" className="hover:underline">
                <FontAwesomeIcon icon={faPhone} className="me-1" />
                +2349134781219
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 px-4">
        <Link
          href="/"
          prefetch={false}
          className="items-center space-x-2 group hidden md:inline mr-3 text-xl lg:text-2xl font-semibold hover:text-[#FF6600] transition-colors bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
          style={{
            backgroundImage:
              "linear-gradient(270deg, #fb923c, #f97316, #fbbf24, #fb923c)",
            backgroundSize: "200% auto",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "gradient-x 3s ease-in-out infinite",
          }}
        >
          <b>Ulisha</b>
        </Link>
        <Link
          href="/message"
          prefetch={false}
          className="text-white hover:text-[#FF6600] transition-colors mr-3"
          aria-label="Message"
        >
          <FontAwesomeIcon icon={faRobot} size="lg" />
        </Link>
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-grow flex items-center bg-white rounded-full h-10 px-1 relative"
        >
          <input
            type="text"
            placeholder={currentPlaceholder}
            value={searchQuery}
            aria-label="Searchbar"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none border-none text-sm px-3 pr-10 text-gray-700"
          />
          {/* Add the hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCameraClick}
            className="absolute right-10 mx-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500"
            aria-label="Open camera search"
          >
            <FontAwesomeIcon icon={faCamera} size="lg" />
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white rounded-full h-8 w-8 flex items-center justify-center mr-1"
            aria-label="Search"
          >
            <FontAwesomeIcon icon={faSearch} size="sm" />
          </button>
        </form>
        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="text-white hover:text-[#FF6600] transition-colors mx-3"
        >
          <FontAwesomeIcon icon={faHeart} size="lg" />
        </Link>
        {/* Cart */}
        <Link
          href="/cart"
          className="text-white hover:text-[#FF6600] transition-colors hidden md:inline mx-2 relative"
        >
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
              {cartItemCount}
            </span>
          )}
        </Link>
        <Link
          href="/notifications"
          className="text-white hover:text-[#FF6600] transition-colors hidden md:inline mx-3 relative"
        >
          <FontAwesomeIcon icon={faBell} size="lg" />
        </Link>
        {/* User profile */}
        {!mobile && (
          <>
            {!!user ? (
              <div
                ref={dropdownRef}
                className="relative inline-block text-left"
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="items-center text-white hover:text-[#FF6600] transition-colors flex mx-1 outline-0"
                >
                  <div
                    className="rounded-full bg-orange-500 flex items-center justify-center"
                    style={{ width: "30px", height: "30px", color: "white" }}
                  >
                    {getInitials(user?.user_metadata?.full_name)}
                  </div>
                </button>

                {/* Dropdown positioned below the button */}
                <AccountDropdown isOpen={isOpen} />
              </div>
            ) : (
              <Link
                href="/login"
                className="items-center text-white hover:text-[#FF6600] transition-colors flex mx-1"
              >
                Login
              </Link>
            )}
          </>
        )}
      </div>

      {/* Categories (Horizontal Scroll) */}
      <div
        className="flex overflow-x-auto whitespace-nowrap px-2 mt-2"
        style={{ scrollbarWidth: "none" }}
      >
        <Link
          key="all"
          href="/"
          className={`text-white text-sm px-3 py-1 pb-2 font-medium relative hover:text-orange-500 ${
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
            href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            className={`text-white text-sm px-2 py-1 pb-2 font-medium relative hover:text-orange-500 ${
              location.pathname ===
              `/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`
                ? "text-orange-300"
                : ""
            }`}
          >
            {category.name}
            {location.pathname ===
              `/category/${category.name.toLowerCase().replace(/\s+/g, "-")}` && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-orange-500 rounded-full"></span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function NavComponent() {
  return (
    <Suspense>
      <Nav />
    </Suspense>
  );
}
