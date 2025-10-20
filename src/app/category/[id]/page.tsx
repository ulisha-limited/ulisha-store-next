/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { ProductCard } from "@/components/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryName = id.replace(/-/g, " ");

  const supabase = createSupabaseServerClient();
  const productCategories = await supabase
    .from("products")
    .select("*")
    .ilike("category", `%${categoryName}%`)
    .order("created_at", { ascending: false });

  const products = productCategories.data ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center py-4">
            <Link
              href="/"
              className="rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-gray-700"
                size="lg"
              />
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 capitalize">
              {categoryName}
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
