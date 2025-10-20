/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import type { MetadataRoute } from "next";
import staticSitemap from "./sitemaps/static";
import categoriesSitemap from "./sitemaps/categories";
import productsSitemap from "./sitemaps/products";

export const revalidate = 86400; // 24 hours (in seconds)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [staticUrls, categoryUrls, productUrls] = await Promise.all([
    staticSitemap(),
    categoriesSitemap(),
    productsSitemap(),
  ]);

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
