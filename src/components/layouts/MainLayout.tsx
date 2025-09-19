/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import NextTopLoader from "nextjs-toploader";
import NavComponent from "./Nav";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { usePathname } from "next/navigation";

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

  const hideNav = hiddenPaths.some((path) => pathname.startsWith(path));
  const isFooterHidden = hideFooter.some((page) => pathname.startsWith(page));

  const contentPaddingClass = hideNav ? "" : "pt-[90px]";

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {!hideNav && <NavComponent />}
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
