/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const PROTECTED_ROUTE_REGEX = [
  /^\/logout/,
  /^\/orders/,
  /^\/message/,
  /^\/settings/,
  /^\/admin/,
  /^\/wishlist/,
  /^\/cart/,
  /^\/notifications/,
  /^\/my-account/,
];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const authLoaded = useAuthStore((state) => state.authLoaded);
  const router = useRouter();
  const pathname = usePathname();

  const isProtected = PROTECTED_ROUTE_REGEX.some((regex) =>
    regex.test(pathname || "")
  );

  if (!authLoaded) {
    return (
      <div className="h-screen flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (isProtected && !user) {
    if (typeof window !== "undefined") {
      if (/^\/logout/.test(pathname || "")) {
        router.replace("/login");
      } else {
        router.replace(
          "/login?next=" + encodeURIComponent(window.location.pathname)
        );
      }
    }

    return null;
  }

  return <>{children}</>;
}
