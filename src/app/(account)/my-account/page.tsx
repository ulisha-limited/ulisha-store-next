/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useAuthStore } from "@/store/authStore";
import {
  faArrowLeft,
  faArrowRightFromBracket,
  faBox,
  faChartLine,
  faChevronRight,
  faClock,
  faCommentDots,
  faCreditCard,
  faGear,
  faMessage,
  faRepeat,
  faShieldHalved,
  faTruckFast,
  faUsers,
  faUser,
  faHouse,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow-sm border border-slate-200/60 rounded-2xl overflow-hidden">
    {children}
  </div>
);

const CardHeader = ({
  title,
  actionLink,
  actionText,
}: {
  title: string;
  actionLink?: string;
  actionText?: string;
}) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60">
    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    {actionLink && actionText && (
      <Link
        href={actionLink}
        className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center space-x-1 transition-colors"
      >
        <span>{actionText}</span>
        <FontAwesomeIcon icon={faChevronRight} className="h-3 w-3" />
      </Link>
    )}
  </div>
);

const Navbar = () => {
  return (
    <nav className="hidden lg:block sticky top-0 z-50 border-b border-slate-200/60 shadow-sm bg-[repeating-linear-gradient(135deg,#f8fafc,#f8fafc_14px,#ffffff_14px,#ffffff_28px)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-orange-50 transition-colors"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="w-5 h-5 text-slate-700"
          />
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

const Breadcrumb = ({ current }: { current: string }) => {
  return (
    <div className="hidden lg:block border-b border-slate-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3 text-sm">
        <nav className="flex items-center space-x-2 text-slate-500">
          <Link
            href="/"
            className="hover:text-orange-500 flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{current}</span>
        </nav>
      </div>
    </div>
  );
};

export default function MyAccount() {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const ADMIN_EMAILS = [
    "paulelite606@gmail.com",
    "obajeufedo2@gmail.com",
    "mrepol742@gmail.com",
  ];

  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "");

  const orderLinks = [
    { href: "?status=to-pay", icon: faCreditCard, label: "To Pay" },
    { href: "?status=to-ship", icon: faBox, label: "To Ship" },
    { href: "?status=to-receive", icon: faTruckFast, label: "To Receive" },
    { href: "?status=to-review", icon: faCommentDots, label: "To Review" },
  ];

  const adminLinks = [
    {
      href: "/my-account/admin/dashboard",
      icon: faChartLine,
      label: "Dashboard",
    },
    { href: "/my-account/admin/orders", icon: faBox, label: "Orders" },
    {
      href: "/my-account/admin/products",
      icon: faTruckFast,
      label: "Products",
    },
    { href: "/my-account/admin/users", icon: faUsers, label: "Users" },
    {
      href: "/my-account/admin/short-links",
      icon: faShieldHalved,
      label: "Short Links",
    },
    {
      href: "/my-account/admin/reviews",
      icon: faCommentDots,
      label: "Reviews",
    },
    {
      href: "/my-account/admin/affiliate/join",
      icon: faChartLine,
      label: "Affiliate Dashboard",
    },
    {
      href: "/my-account/admin/affiliates/referrals",
      icon: faUsers,
      label: "My Referrals",
    },
    {
      href: "/my-account/admin/affiliates/earnings",
      icon: faCreditCard,
      label: "My Earnings",
    },
    {
      href: "/my-account/admin/affiliates/payouts",
      icon: faBox,
      label: "Payouts",
    },
  ];

  const moreLinks = [
    { href: "/my-account/settings", icon: faGear, label: "Account Settings" },
    { href: "/message", icon: faMessage, label: "My Messages" },
    { href: "/recently-viewed", icon: faClock, label: "Recently Viewed" },
    { href: "/buy-again", icon: faRepeat, label: "Buy Again" },
  ];

  if (!isAdmin) {
    moreLinks.push(
      {
        href: "/my-account/affiliate/join",
        icon: faChartLine,
        label: "Join Affiliate",
      },
      {
        href: "/my-account/affiliate/referrals",
        icon: faUsers,
        label: "My Referrals",
      },
      {
        href: "/my-account/affiliate/earnings",
        icon: faCreditCard,
        label: "Reward History",
      },
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar />
      <Breadcrumb current="My Account" />
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-2">
        <div className="flex items-center py-4 lg:hidden">
          <Link
            className="rounded-full hover:bg-gray-200 transition-colors"
            href="/"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-gray-700"
              size="lg"
            />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
            Back
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {getInitials(user?.user_metadata?.full_name)}
            </div>
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {user?.user_metadata?.full_name}
              </h1>
            </div>
          </div>
          <Link
            href="/logout"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-500 bg-white border border-slate-300/70 rounded-lg px-5 py-2.5 transition-all duration-300 hover:border-red-400/80 hover:shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>Logout</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-10 mt-7">
          {isAdmin && (
            <Card>
              <CardHeader title="Admin Panel" />
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      className="group flex flex-col items-center justify-center p-5 bg-slate-50 hover:bg-orange-500 rounded-lg transition-all duration-300"
                    >
                      <FontAwesomeIcon
                        icon={link.icon}
                        className="h-7 w-7 text-orange-500 group-hover:text-white transition-colors"
                      />
                      <span className="mt-2 text-sm font-semibold text-slate-700 group-hover:text-white transition-colors text-center">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>
          )}
          <Card>
            <CardHeader
              title="My Orders"
              actionLink="/my-account/orders"
              actionText="View all orders"
            />
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {orderLinks.map((link) => (
                  <Link
                    key={link.href}
                    prefetch={false}
                    href={`/my-account/orders${link.href}`}
                    className="group text-center bg-slate-100/80 rounded-lg p-5 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="h-8 w-8 text-slate-500 group-hover:text-orange-500 transition-colors"
                    />
                    <p className="mt-3 font-semibold text-slate-700">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-400">0 Items</p>
                  </Link>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Account & More" />
            <div className="p-3">
              <div className="flex flex-col divide-y divide-slate-100">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    prefetch={false}
                    href={link.href}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon
                        icon={link.icon}
                        className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors"
                      />
                      <span className="font-medium text-slate-700">
                        {link.label}
                      </span>
                    </div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
