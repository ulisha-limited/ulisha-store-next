/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/supabase-types";
import { usePathname, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const PAGE_SIZE = 10;
type Product = Database["public"]["Tables"]["products"]["Row"];

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setLoading(true);
    fetchProductsPage(0, true);
    // eslint-disable-next-line
  }, [pathname, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading || isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchProductsPage(page + 1, false);
      }
    });
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
    return () => observer.current?.disconnect();
    // eslint-disable-next-line
  }, [hasMore, loading, isFetchingMore, page]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchProductsPage = async (pageToFetch: number, isInitial: boolean) => {
    if (!searchQuery.trim()) return;
    if (!isInitial) setIsFetchingMore(true);
    try {
      if (isInitial) setLoading(true);
      setError(null);
      const from = pageToFetch * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,shipping_location.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`,
        )
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      if (data && data.length > 0) {
        setProducts((prev) => (isInitial ? data : [...prev, ...data]));
        setPage(pageToFetch);
        setHasMore(data.length === PAGE_SIZE);
        setError(null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError(
        "Unable to load products. Please check your connection and try again.",
      );
      setHasMore(false);
    } finally {
      if (isInitial) setLoading(false);
      setIsFetchingMore(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="h-screen flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div ref={sentinelRef} style={{ height: 1 }} />
                {isFetchingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-orange"></div>
                  </div>
                )}
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No more products to load.
                  </div>
                )}
                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No products found matching your search criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <FontAwesomeIcon
          icon={faSpinner}
          className="w-12 h-12 animate-spin text-primary-orange mx-auto mt-20"
        />
      }
    >
      <Search />
    </Suspense>
  );
}
