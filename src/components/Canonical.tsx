"use client"

import { usePathname } from "next/navigation";

export default function CanonicalUrl() {
  const pathname = usePathname();
  const baseUrl = "https://www.ulishastore.com";
  const canonicalUrl = `${baseUrl}${pathname}`;
  return <link rel="canonical" href={`${canonicalUrl}`} />;
}
