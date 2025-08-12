/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";

import NextTopLoader from "nextjs-toploader";
import NavComponent from "./Nav";
import ProtectedRoute from "../auth/ProtectedRoute";
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
  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/logout",
  ];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {!isAuthPage && <NavComponent />}
      <NextTopLoader showSpinner={false} color="#FF6600" />
      <div className="flex-1 pt-[90px] mb-[90px] md:mb-0">
        <ProtectedRoute>{children}</ProtectedRoute>
      </div>
      {!isAuthPage && (
        <>
          <ToastContainer />
          <Footer />
          <BottomNav />
        </>
      )}
    </div>
  );
}
