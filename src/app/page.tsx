/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { AdCarousel } from "@/components/AdCarousel";
import { PromoPopup } from "@/components/PromoPopup";
import {
  Search,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/store/cartStore";
import { usePromoPopup } from "@/hooks/usePromoPopup";
import { usePathname } from "next/navigation";

const PAGE_SIZE = 10;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [usesFallback, setUsesFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const location = { pathname: usePathname() };

  // Promo popup hook
  const { showPopup, closePopup } = usePromoPopup();

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setUsesFallback(false);
    setLoading(true);
    fetchProductsPage(0, true);
  }, [location.pathname]);

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
  }, [hasMore, loading, isFetchingMore, page]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchProductsPage = async (pageToFetch: number, isInitial: boolean) => {
    if (!isInitial) setIsFetchingMore(true);
    try {
      if (isInitial) setLoading(true);
      setError(null);
      const from = pageToFetch * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      if (data && data.length > 0) {
        setProducts((prev) => (isInitial ? data : [...prev, ...data]));

        if (pageToFetch === 0) {
          const newThisWeek = data
            .filter((p) => {
              if (!p.created_at) return false;
              const createdAt = new Date(p.created_at);
              const oneWeekAgo = new Date();
              oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
              return createdAt >= oneWeekAgo;
            })
            .sort(() => Math.random() - 0.5);
          setNewProducts(newThisWeek);
        }
        setPage(pageToFetch);
        setHasMore(data.length === PAGE_SIZE);
        setUsesFallback(false);
        setError(null);
      } else {
        // if (isInitial) {
        //   setProducts(fallbackProducts);
        //   setUsesFallback(true);
        // }
        setHasMore(false);
      }
    } catch (error) {
      setError(
        "Unable to load products. Please check your connection and try again."
      );
      // if (isInitial) {
      //   setProducts(fallbackProducts);
      //   setUsesFallback(true);
      // }
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
          {/* Add contact banner */}
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

          {/* Ad Carousel */}
          <AdCarousel />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">New items</h1>
            </div> */}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {usesFallback && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Currently showing demo products. Admin products will
                      appear here once uploaded.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
              </div>
            ) : (
              <>
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
                {!hasMore && products.length > 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No more products to load.
                  </div>
                )}
                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Popup */}
      <PromoPopup isVisible={showPopup} onClose={closePopup} />
    </>
  );
}
