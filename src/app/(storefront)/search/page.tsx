import { createSupabaseServerClient } from "@/lib/supabase/server";

async function fetchProducts(searchQuery: string) {
  const start = performance.now();

  const supabase = createSupabaseServerClient();
  const result = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .or(
      `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,shipping_location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`,
    )
    .order("created_at", { ascending: false })
    .range(0, 9);

  const end = performance.now();

  return {
    ...result,
    durationMs: end - start,
  };
}

import SearchUI from "@/components/ui/products/SearchUI";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || "";
  const { data, count, durationMs } = await fetchProducts(searchQuery);

  return (
    <SearchUI
      initialProducts={data || []}
      searchQuery={searchQuery}
      searchDuration={durationMs}
      resultsCount={count || 0}
    />
  );
}
