"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface MetaColorBridgeType {
  onMetaColors: (statusColor: string, navColor: string, dark: string) => void;
}

declare global {
  interface Window {
    MetaColorBridge?: MetaColorBridgeType;
  }
}

export default function DynamicAppColor() {
  const pathname = usePathname();

  const colorGroups = [
    {
      paths: [
        "/login",
        "/register",
        "/my-account",
        "/web",
        "/legal",
        "/faq",
        "/about",
      ],
      status: "#FFFFFF",
      nav: "#FFFFFF",
      dark: "false",
    },
    {
      paths: [
        "/",
        "/product",
        "/category",
        "/whislist",
        "/cart",
        "/notification",
      ], // fallback
      status: "#007BFF",
      nav: "#101828",
      dark: "true",
    },
  ];

  const matchedGroup =
    colorGroups.find((group) =>
      group.paths.some((path) => pathname.startsWith(path)),
    ) ?? colorGroups[colorGroups.length - 1];

  useEffect(() => {
    if (typeof window !== "undefined" && window.MetaColorBridge?.onMetaColors) {
      try {
        window.MetaColorBridge.onMetaColors(
          matchedGroup.status,
          matchedGroup.nav,
          matchedGroup.dark,
        );
      } catch (e) {
        console.warn("MetaColorBridge not available", e);
      }
    }
  }, [pathname, matchedGroup.nav, matchedGroup.status, matchedGroup.dark]);

  return null;
}
