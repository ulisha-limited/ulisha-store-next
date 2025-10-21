/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


"use client";

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
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/my-account" },
    { label: "Settings", href: "/my-account/settings" },
  ];

  return (
    <nav className="hidden lg:block sticky top-0 z-50 border-b border-slate-200/60 shadow-sm bg-[repeating-linear-gradient(135deg,#f8fafc,#f8fafc_14px,#ffffff_14px,#ffffff_28px)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-50 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5 text-slate-700" />
        </Link>
        <div className="flex space-x-10">
          <Link
            href="/"
            className="text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/my-account"
            className="text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/my-account/settings"
            className="text-sm font-medium text-slate-700 hover:text-orange-500 transition-colors"
          >
            Settings
          </Link>
        </div>
        <Link
          href="/my-account"
          className="flex items-center space-x-2 text-slate-600 hover:text-orange-500 transition-colors"
        >
          <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
          <span className="text-sm font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );
};

const Breadcrumb = ({ current }: { current: string }) => (
  <div className="hidden lg:block bg-slate-50 border-b border-slate-200/60">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 text-sm">
      <nav className="flex items-center space-x-2 text-slate-500">
        <Link href="/" className="hover:text-orange-500 flex items-center gap-1">
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href="/my-account" className="hover:text-orange-500">
          My Account
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{current}</span>
      </nav>
    </div>
  </div>
);

export default function Settings() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <Breadcrumb current="Settings" />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 space-y-10 flex-grow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-500 text-sm sm:text-base">
            Manage your account preferences, privacy, and notifications.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200/70 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
            </div>
            <div className="divide-y divide-gray-100">
              <Link
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                href="/my-account/settings/account-security"
              >
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Account & Security</span>
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
      </main>
    </div>
  );
}
