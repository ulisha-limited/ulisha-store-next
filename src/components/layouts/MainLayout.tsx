/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */

"use client";

import NextTopLoader from "nextjs-toploader";
import NavComponent from "./Nav";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { usePathname } from "next/navigation";
import { SecondaryNav } from "./SecondaryNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const hiddenPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/logout",
    "/my-account",
    "/settings",
  ];

  const hideFooter = [
    "/my-account",
    "/message",
    "/recently-viewed",
    "/buy-again",
    "/wishlist",
    "/cart",
    "/notifications",
  ];

  const secondaryNav = [
    "/about",
    "/faq",
    "/legal",
    "/legal/privacy-policy",
    "/legal/return-policy",
    "/legal/terms",
    "/web",
  ];

  const hideNav = hiddenPaths.some((path) => pathname.startsWith(path));
  const isFooterHidden = hideFooter.some((page) => pathname.startsWith(page));
  const isSecondaryNav = secondaryNav.some((page) => pathname.startsWith(page));
  const contentPaddingClass = hideNav || isSecondaryNav ? "" : "pt-[90px]";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {!hideNav && !isSecondaryNav && <NavComponent />}
      {isSecondaryNav && <SecondaryNav />}
      <NextTopLoader showSpinner={false} color="#FF6600" />
      <div className={`flex-1 ${contentPaddingClass} pb-[90px] md:pb-0`}>
        {children}
      </div>
      {!isFooterHidden && !hideNav && <Footer />}
      <BottomNav /> {/* ✅ Always visible on all pages */}
      {!hideNav && <ToastContainer />}
    </div>
  );
}
