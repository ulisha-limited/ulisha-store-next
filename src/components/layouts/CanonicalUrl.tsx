/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


 "use client"

import { usePathname } from "next/navigation";

export default function CanonicalUrl() {
  const pathname = usePathname();
  const baseUrl = "https://www.ulishastore.com";
  const canonicalUrl = `${baseUrl}${pathname}`;
  return <link rel="canonical" href={`${canonicalUrl}`} />;
}
