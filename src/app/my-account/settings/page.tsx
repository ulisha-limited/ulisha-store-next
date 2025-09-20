/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDollarSign,
  faBell,
  faLock,
  faUser,
  faMapMarkerAlt,
  faChevronRight,
  faCreditCard,
  faShieldAlt,
  faGlobe,
  faLanguage,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-10">
        
      
<div className="flex items-center space-x-3">
  <Link
    href="/my-account"
    className="inline-flex items-center text-gray-600 hover:text-orange-500 transition-colors"
  >
    <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
  </Link>
  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
    Settings
  </h1>
</div>
<p className="mt-1 text-gray-500 text-sm sm:text-base">
  Manage your account preferences, privacy, and notifications.
</p>
        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Account Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/70 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                Account Settings
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/account-security"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    Account & Security
                  </span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/account-switch"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Account Switch</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </section>

          {/* Preferences & Management */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/70 overflow-hidden">
            <div className="divide-y divide-gray-100">
              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/address-management"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Address Management</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/payment-settings"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Payment Settings</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/privacy"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Privacy</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/country-region"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faGlobe} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Country/Region</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Global</span>
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
                </div>
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/language"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faLanguage} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Language</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">English</span>
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
                </div>
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/notification-preferences"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Notification Settings</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/ai-searching-settings"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faCog} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">AI & Searching Settings</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/currency-preferences"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Currency Preferences</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
