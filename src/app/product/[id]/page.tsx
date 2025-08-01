/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { supabase } from "@/lib/supabase";
import ProductDetails from "@/components/feed/ProductDetails";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
    
  const { data: imagesData } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("product_id", id);

  const allImages = [
    product.image,
    ...(imagesData?.map((img) => img.image_url) || []),
  ];

  const { data: variantsData } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", id);

  const availableColors = [
    ...new Set(variantsData?.map((variant) => variant.color) || []),
  ];

  const { data: similarProduct, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", product.category)
    .neq("id", product.id)
    .eq("shipping_location", product.shipping_location)
    .order("rating", { ascending: false })
    .limit(4);

  return (
    <ProductDetails
      initialProduct={product}
      initialImages={allImages}
      initialVariants={variantsData || []}
      initialAvailableColors={availableColors || []}
      initialSimilarProducts={similarProduct || []}
    />
  );
}
