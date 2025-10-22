/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();

  const { data: categories, error } = await supabase
    .from("product_categories")
    .select("name")
    .order("created_at", { ascending: false });

  if (error || !categories) return [];

  return categories.map((category) => ({
    url: `https://www.ulishastore.com/category/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, "-"))}`,
  }));
}
