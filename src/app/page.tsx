/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { PromoPopup } from "@/components/PromoPopup";
import { usePromoPopup } from "@/hooks/usePromoPopup";
import { AdCarousel } from "@/components/AdCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import type { Product } from "@/store/cartStore";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1); // starts from 1 since we fetch first page separately
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

    if (!data) {
      throw new Error("Failed to fetch products");
    }

    if (page === 1) setNewProducts(data.filter((p) => p.created_at));
    if (page > 1) setProducts((prev) => [...prev, ...data]);
    if (page !== 1) setPage(page);
    setHasMore(data.length === PAGE_SIZE);
  }, []);

  useEffect(() => {
    const fetchFirstPage = async () => {
      try {
        await fetchProducts(1);
      } catch (err) {
        console.error("Failed to fetch first page:", err);
      }
    };

    fetchFirstPage();
  }, [fetchProducts]);

  const fetchNextPage = useCallback(async () => {
    const nextPage = page + 1;
    setIsFetchingMore(true);

    try {
      await fetchProducts(nextPage);
    } catch (err) {
      console.error("Failed to fetch next page:", err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, fetchProducts]);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://www.ulishastore.com/#organization",
                name: "Ulisha Store",
                url: "https://www.ulishastore.com",
                logo: "https://www.ulishastore.com/favicon.png",
                email: "ulishastore@gmail.com",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+2349134781219",
                  contactType: "customer service",
                },
                sameAs: [
                  "https://x.com/ulishastores",
                  "https://www.instagram.com/ulisha_store",
                  "https://www.tiktok.com/@ulishastores",
                ],
                description:
                  "Ulisha Store – your one‑stop shop for fashion, accessories, electronics & more, offering quality products at competitive prices.",
              },
              {
                "@type": "WebSite",
                "@id": "https://www.ulishastore.com/#website",
                url: "https://www.ulishastore.com/",
                name: "Ulisha Store",
                description:
                  "Online store offering a wide range of fashion, electronics, accessories, and more.",
                publisher: {
                  "@id": "https://www.ulishastore.com/#organization",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://www.ulishastore.com/search?&q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }),
        }}
      />
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow">
          <div className="bg-orange-500 text-white py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center sm:justify-end space-x-4 text-sm">
                <a
                  href="tel:+2347060438205"
                  className="flex items-center hover:text-white/90 transition-colors"
                >
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2" />
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
