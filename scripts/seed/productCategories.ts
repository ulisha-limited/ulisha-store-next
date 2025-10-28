import { SupabaseClient } from "@supabase/supabase-js";

export interface Categories {
  name: string;
  description: string;
  created_at: string;
}

export const categories: Categories[] = [
  {
    name: "Electronics",
    description: "Devices and gadgets",
    created_at: new Date().toISOString(),
  },
  {
    name: "Clothing",
    description: "Apparel and accessories",
    created_at: new Date().toISOString(),
  },
];

export default async function ProductCategoriesSeed(
  supabase: SupabaseClient<any, "public", any>,
): Promise<void> {
  const { error } = await supabase
    .from("product_categories")
    .insert(categories);

  if (error) throw new Error(error.message || JSON.stringify(error));
  else console.log("✅ Product Categories!");
}
