/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.ulishastore.com" },
    { url: "https://www.ulishastore.com/login" },
    { url: "https://www.ulishastore.com/register" },
    { url: "https://www.ulishastore.com/faq" },
    { url: "https://www.ulishastore.com/legal" },
    { url: "https://www.ulishastore.com/legal/terms" },
    { url: "https://www.ulishastore.com/legal/privacy" },
    { url: "https://www.ulishastore.com/legal/return-policy" },
    { url: "https://www.ulishastore.com/web" },
    { url: "https://www.ulishastore.com/about" },
  ];
}
