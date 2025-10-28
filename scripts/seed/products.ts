import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { categories } from "./productCategories";
import fs from "fs";
import path from "path";

export interface Products {
  name: string;
  category: string;
  description: string;
  price: string;
  discount_active: boolean;
  original_price: string;
  discount_price: string;
  shipping_location: string;
  image: string;
}

export default async function ProductsSeed(
  supabase: SupabaseClient<any, "public", any>,
): Promise<void> {
  const imagePath = path.resolve("public/images/dummy-product.png");
  const fileBuffer = fs.readFileSync(imagePath);

  const imageName = `${uuidv4()}-dummy-product.png`;
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(imageName, fileBuffer, {
      contentType: "image/png",
      cacheControl: "2592000", // 30 days in seconds
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl: imageUrl },
  } = supabase.storage.from("product-images").getPublicUrl(imageName);

  const products: Products[] = [];
  for (let i = 1; i <= 120; i++) {
    const originalPrice = Math.floor(Math.random() * 90000) + 10000;
    products.push({
      name: `Product ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)].name,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      price: originalPrice.toString(),
      original_price: originalPrice.toString(),
      discount_price: (originalPrice - 500).toString(),
      discount_active: Math.random() < 0.3, // 30% chance of discount
      shipping_location: "Nigeria",
      image: imageUrl,
    });
  }

  const { error } = await supabase.from("products").insert(products);

  if (error) throw new Error(error.message || JSON.stringify(error));
  else console.log(`✅ Products!`);
}
