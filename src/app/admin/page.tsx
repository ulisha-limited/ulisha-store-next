/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faTachometerAlt,   // Dashboard icon
  faShoppingBasket,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Admin Panel
        </h1>
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-0">
              {/* Dashboard */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/admin/dashboard"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faTachometerAlt} className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Dashboard</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Orders */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/admin/orders"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Orders</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-gray-400" />
              </Link>

              {/* Products */}
              <Link
                className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                href="/admin/products"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faShoppingBasket} className="w-5 h-5 text-gray-400" />
                  <p className="font-medium text-gray-900">Products</p>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
