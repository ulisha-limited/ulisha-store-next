"use client";

import { useState, useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/supabase-types";

const PAGE_SIZE = 10;
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function SearchUI({
  initialProducts,
  searchQuery,
  searchDuration,
  resultsCount,
}: {
  initialProducts: Product[];
  searchQuery: string;
  searchDuration: number;
  resultsCount: number;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !isFetchingMore && hasMore) {
        setIsFetchingMore(true);
        const from = (page + 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        const { data } = await supabase
          .from("products")
          .select("*")
          .or(
            `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,shipping_location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`,
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        if (data && data.length > 0) {
          setProducts((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
          setHasMore(data.length === PAGE_SIZE);
        } else {
          setHasMore(false);
        }
        setIsFetchingMore(false);
      }
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, isFetchingMore, searchQuery]);

  return (
    <>
      <div className="mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-3 mb-4 text-sm text-gray-700">
            <div>
              <span className="font-semibold text-gray-900">Results for:</span>{" "}
              <span className="text-primary-orange">{searchQuery}</span>
            </div>
            <div className="text-right text-gray-600">
              <span className="font-medium">{resultsCount}</span> total results
              ·{" "}
              <span className="font-mono">{Math.floor(searchDuration)}ms</span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.length > 0 &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>

          <div ref={sentinelRef} style={{ height: 1 }} />

          {isFetchingMore && (
            <div className="text-center py-4 text-gray-700">
              Loading more...
            </div>
          )}
        </div>
      </div>
    </>
  );
}
