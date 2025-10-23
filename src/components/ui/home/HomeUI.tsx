/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { PromoPopup } from "@/components/ui/home/PromoPopup";
import { usePromoPopup } from "@/hooks/usePromoPopup";
import { AdCarousel } from "@/components/ui/home/AdCarousel";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Database } from "@/supabase-types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Advertisement = Database["public"]["Tables"]["advertisements"]["Row"];
const PAGE_SIZE = 10;

export default function HomePageUI({
  advertisements,
  initialProducts,
}: {
  advertisements: Advertisement[];
  initialProducts: Product[];
}) {
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { showPopup, closePopup } = usePromoPopup();

  const fetchProducts = useCallback(async (page: number) => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!data) return;

    setProducts((prev) => [...prev, ...data]);
    setHasMore(data.length === PAGE_SIZE);
    setPage(page);
  }, []);

  const fetchNextPage = useCallback(async () => {
    const nextPage = page + 1;
    setIsFetchingMore(true);
    try {
      await fetchProducts(nextPage);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, fetchProducts]);

  useEffect(() => {
    const maxPages = user ? 14 : 6;
    if (!hasMore || isFetchingMore || page >= maxPages) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    if (sentinelRef.current) observer.current.observe(sentinelRef.current);

    return () => observer.current?.disconnect();
  }, [fetchNextPage, hasMore, isFetchingMore, page, user]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow relative">
          <AdCarousel advertisements={advertisements} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* New This Week */}
            <h2 className="text-lg font-semibold text-gray-900">
              New this week
            </h2>
            <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
              {[...products].slice(0, 15).map((product, index) => (
                <div
                  key={index}
                  className="min-w-[220px] max-w-xs flex-shrink-1 gap-4"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Stuff You Might Like */}
            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Stuff You Might Like
            </h2>
            <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
              {[...products].slice(16, 30).map((product, index) => (
                <div
                  key={index}
                  className="min-w-[220px] max-w-xs flex-shrink-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Trending */}
            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Trending Products
            </h2>
            <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
              {[...products].slice(31, 40).map((product, index) => (
                <div
                  key={index}
                  className="min-w-[220px] max-w-xs flex-shrink-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Discover */}
            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Discover Products
            </h2>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...products]
                .slice(41, products.length)
                .map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
            </div>

            {/* Infinite Scroll Trigger or Auth Prompt */}
            {(!user && page < 6) || (user && page < 14) ? (
              <>
                <div ref={sentinelRef} style={{ height: 1 }} />
                {isFetchingMore && (
                  <div className="text-center py-4 text-gray-700">
                    Loading more...
                  </div>
                )}
                {!hasMore && (
                  <div className="text-center py-4 text-gray-700">
                    No more products to load.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      className="bg-orange-500 text-white shadow hover:bg-orange-600 hover:shadow-lg transition px-3 py-1 mr-3 rounded font-medium"
                    >
                      Login
                    </Link>
                    to view more
                  </>
                ) : (
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="bg-orange-500 text-white shadow hover:bg-orange-600 hover:shadow-lg transition px-3 py-1 rounded font-medium"
                  >
                    Go up
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <PromoPopup isVisible={showPopup} onClose={closePopup} />
    </>
  );
}
