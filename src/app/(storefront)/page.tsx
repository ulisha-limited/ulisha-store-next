/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import HomeUI from "@/components/ui/home/HomeUI";

export default async function HomePage() {
  const supabase = createSupabaseServerClient();
  const PAGE_SIZE = 50;

  const [advertisements, products] = await Promise.all([
    supabase
      .from("advertisements")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1),
  ]);

  return (
    <HomeUI
      advertisements={advertisements.data ?? []}
      initialProducts={products.data ?? []}
    />
  );
}
