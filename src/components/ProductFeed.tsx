/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ProductCard } from "@/components/ProductCard";
import { PromoPopup } from "@/components/PromoPopup";
import { usePromoPopup } from "@/hooks/usePromoPopup";
import { AdCarousel } from "@/components/AdCarousel";
import { Phone } from "lucide-react";
import type { Product } from "@/store/cartStore";

const PAGE_SIZE = 10;

export default function ProductFeed({
  initialProducts,
  newProducts,
}: {
  initialProducts: Product[];
  newProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialProducts.length === PAGE_SIZE);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const { showPopup, closePopup } = usePromoPopup();

  const fetchNextPage = useCallback(async () => {
    const nextPage = page + 1;
    setIsFetchingMore(true);

    try {
      const res = await fetch(`/api/products?page=${nextPage}`);
      const data: Product[] = await res.json();

      setProducts((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error("Failed to fetch next page:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page]);

  useEffect(() => {
    if (!hasMore || isFetchingMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => observer.current?.disconnect();
  }, [fetchNextPage, hasMore, isFetchingMore, page]);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow">
          <div className="bg-orange-500 text-white py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm">
                <a
                  href="tel:+2347060438205"
                  className="flex items-center hover:text-white/90 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span>Call to place order: +234 913 478 1219</span>
                </a>
              </div>
            </div>
          </div>

          <AdCarousel />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg font-semibold text-gray-900">
              New this week
            </h2>
            <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
              {newProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[220px] max-w-xs flex-shrink-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              Discover Products
            </h2>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            {!hasMore && (
              <div className="text-center py-4 text-gray-500">
                No more products to load.
              </div>
            )}
          </div>
        </div>
      </div>

      <PromoPopup isVisible={showPopup} onClose={closePopup} />
    </>
  );
}
