/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import type { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id")
    .order("created_at", { ascending: false });

  if (error || !products) return [];

  return products.map((product) => ({
    url: `https://www.ulishastore.com/product/${product.id}`,
  }));
}
