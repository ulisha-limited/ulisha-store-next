"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";

export default function Footer() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <footer className="bg-gray-900 text-white mt-12 mb-12 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          {categories.length > 0 ? (
            <ul className="flex flex-wrap text-gray-400 gap-x-2 gap-y-1">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={`/category/${category.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="hover:text-[#FF6600] transition-colors whitespace-nowrap"
                  >
                    {category.name} ({category.count})
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No categories found.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About UlishaStore Section */}
          <div>
            <div className="mb-4">
              <span className="text-xl lg:text-2xl font-bold">
                <span className="text-[#FF6600]">Ulisha</span>
                <span className="text-white">Store</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for fashion, accessories, shoes, and smart
              devices. We bring you the best quality products at competitive
              prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="h-8 w-auto bg-white rounded p-1"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-8 w-auto bg-white rounded p-1"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-8 w-auto bg-white rounded p-1"
              />
            </div>
            <p className="text-gray-400 text-xs mt-2">
              We accept all major international payment methods.
            </p>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <span>ulishastore@gmail.com</span>
              </li>
            </ul>
            <h3 className="text-lg font-semibold mt-6 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1AhYhxox4X/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/ulishastores"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/ulisha_store?"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@ulishastores"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF6600] transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} UlishaStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
