/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


 "use client"

import { usePathname } from "next/navigation";

export default function CanonicalUrl() {
  const pathname = usePathname();
  const baseUrl = "https://www.ulishastore.com";
  const canonicalUrl = `${baseUrl}${pathname}`;
  return <link rel="canonical" href={`${canonicalUrl}`} />;
}
