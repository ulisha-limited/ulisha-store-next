/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { supabase } from "@/lib/supabase";
import ProductFeed from "@/components/ProductFeed";
import type { Product } from "@/store/cartStore";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const PAGE_SIZE = 10;
  const from = 0;
  const to = PAGE_SIZE - 1;

  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  const newThisWeek =
    data?.filter((p) => {
      const createdAt = new Date(p.created_at);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }) ?? [];

  return <ProductFeed initialProducts={data || []} newProducts={newThisWeek} />;
}
