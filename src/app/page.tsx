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
import { supabase } from "@/lib/supabase";
import { ProductCard } from "@/components/ProductCard";
import { PromoPopup } from "@/components/PromoPopup";
import { usePromoPopup } from "@/hooks/usePromoPopup";
import { AdCarousel } from "@/components/AdCarousel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { Database } from "@/supabase-types";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const PAGE_SIZE = 10;
type Product = Database["public"]["Tables"]["products"]["Row"];

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
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
    const maxPages = user ? 14 : 6;

    if (!hasMore || isFetchingMore || page >= maxPages) return;

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
  }, [fetchNextPage, hasMore, isFetchingMore, page, user]);

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
        <div className="flex-grow relative">

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

            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Stuff You Might Like
            </h2>
            <div className="flex overflow-x-auto gap-4 mt-2 pb-2">
              {[...products, ...newProducts]
                .sort(() => Math.random() - 0.5)
                .slice(0, 15)
                .map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[220px] max-w-xs flex-shrink-1"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>

            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Trending Products
            </h2>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...products, ...newProducts]
                .filter(
                  (product) =>
                    (product.discount_percentage
                      ? product.discount_percentage
                      : 0) > 30,
                )
                .slice(0, 15)
                .map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>

            <h2 className="mt-3 text-lg font-semibold text-gray-900">
              Discover Products
            </h2>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {((!user && page < 6) || (user && page < 14)) ? (
              <>
                <div ref={sentinelRef} style={{ height: 1 }} />
                {isFetchingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  </div>
                )}
                {!hasMore && (
                  <div className="text-center py-4 text-gray-500">
                    No more products to load.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {!user ? (
                  <>
                  <Link href="/login" className="bg-orange-500 text-white shadow hover:bg-orange-600 hover:shadow-lg transition px-3 py-1 mr-3 rounded font-medium">
                    Login
                  </Link>
                   to view more
                  </>
                ) : (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
