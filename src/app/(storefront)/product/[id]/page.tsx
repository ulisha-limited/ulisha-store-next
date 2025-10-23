/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import ProductUI from "@/components/ui/products/ProductUI";
import { isMobileRequest } from "@/lib/device";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseServerClient();

  const [productRes, imagesRes, variantsRes, isMobile] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("product_images").select("image_url").eq("product_id", id),
    supabase.from("product_variants").select("*").eq("product_id", id),
    isMobileRequest(),
  ]);

  if (!productRes.data) {
    notFound();
  }

  const product = productRes.data;
  const images = imagesRes.data ?? [];
  const variants = variantsRes.data ?? [];

  const similarProductRes = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .order("rating", { ascending: false })
    .limit(10);

  const similarProducts = similarProductRes.data ?? [];

  const availableColors = [
    ...new Set(variants?.map((variant) => variant.color) || []),
  ];

  return (
    <ProductUI
      product={product}
      images={images}
      variants={variants}
      similarProducts={similarProducts}
      availableColors={availableColors}
      isMobile={isMobile}
    />
  );
}
