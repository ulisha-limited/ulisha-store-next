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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white shadow-sm border border-slate-200/60 rounded-xl">
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
  <div className="flex items-center justify-between p-5 border-b border-slate-200/60">
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

export default function MyAccount() {
  const user = useAuthStore((state) => state.user);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(
        0
      )}`.toUpperCase();
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
    { href: "/my-account/admin/dashboard", icon: faChartLine, label: "Dashboard" },
    { href: "/my-account/admin/orders", icon: faBox, label: "Orders" },
    { href: "/my-account/admin/products", icon: faTruckFast, label: "Products" },
    { href: "/my-account/admin/users", icon: faUsers, label: "Users" },
    { href: "/my-account/admin/short-links", icon: faShieldHalved, label: "Short Links" },
    { href: "/my-account/admin/reviews", icon: faCommentDots, label: "Reviews" },
    { href: "/my-account/admin/affiliate/join", icon: faChartLine, label: "Affiliate Dashboard" },
    { href: "/my-account/admin/affiliates/referrals", icon: faUsers, label: "My Referrals" },
    { href: "/my-account/admin/affiliates/earnings", icon: faCreditCard, label: "My Earnings" },
    { href: "/my-account/admin/affiliates/payouts", icon: faBox, label: "Payouts" },
  ];

  const moreLinks = [
    { href: "/my-account/settings", icon: faGear, label: "Account Settings" },
    { href: "/message", icon: faMessage, label: "My Messages" },
    { href: "/recently-viewed", icon: faClock, label: "Recently Viewed" },
    { href: "/buy-again", icon: faRepeat, label: "Buy Again" },
  ];

  if (!isAdmin) {
    moreLinks.push(
      { href: "/my-account/affiliate/join", icon: faChartLine, label: "Join Affiliate" },
      { href: "/my-account/affiliate/referrals", icon: faUsers, label: "My Referrals" },
      { href: "/my-account/affiliate/earnings", icon: faCreditCard, label: "Reward History" }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow">
        {/* ✅ Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Account Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {getInitials(user?.user_metadata?.full_name)}
            </div>
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.user_metadata?.full_name}
              </h1>
            </div>
          </div>
          <Link
            href="/logout"
            className="mt-4 sm:mt-0 flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-red-500 bg-white border border-slate-300/70 rounded-lg px-4 py-2 transition-all duration-300 hover:border-red-400/80 hover:shadow-sm"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span>Logout</span>
          </Link>
        </div>

        {/* Rest of content... */}
        <div className="grid grid-cols-1 gap-8">
          {isAdmin && (
            <Card>
              <CardHeader title="Admin Panel" />
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={false}
                      className="group flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-orange-500 rounded-lg transition-all duration-300"
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

          {/* Orders */}
          <Card>
            <CardHeader
              title="My Orders"
              actionLink="/my-account/orders"
              actionText="View all orders"
            />
            <div className="p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {orderLinks.map((link) => (
                  <Link
                    key={link.href}
                    prefetch={false}
                    href={`/my-account/orders${link.href}`}
                    className="group text-center bg-slate-100/80 rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="h-8 w-8 text-slate-500 group-hover:text-orange-500 transition-colors"
                    />
                    <p className="mt-2 font-semibold text-slate-700">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-400">0 Items</p>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          {/* More Links */}
          <Card>
            <CardHeader title="Account & More" />
            <div className="p-3">
              <div className="flex flex-col space-y-1">
                {moreLinks.map((link) => (
                  <Link
                    key={link.href}
                    prefetch={false}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
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
