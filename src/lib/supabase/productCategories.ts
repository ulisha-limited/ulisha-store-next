/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const getCachedProductCategories = cache(async () => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data ?? [];
});
