/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { usePathname } from "next/navigation";

const baseUrl = "https://www.ulishastore.com";

const BreadcrumbJsonLd = () => {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const itemListElement = pathParts.map((part, index) => {
    const name = decodeURIComponent(part.replace(/-/g, " "));
    const item = `${baseUrl}/${pathParts.slice(0, index + 1).join("/")}`;
    return {
      "@type": "ListItem",
      position: index + 2,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      item,
    };
  });

  itemListElement.unshift({
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: baseUrl,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default BreadcrumbJsonLd;
