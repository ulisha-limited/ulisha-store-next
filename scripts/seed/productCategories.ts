import { SupabaseClient } from "@supabase/supabase-js";

export default async function ProductCategoriesSeed(
  supabase: SupabaseClient<any, "public", any>,
): Promise<void> {
  const { error } = await supabase.from("product_categories").insert([
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
  ]);

  if (error) throw new Error(error.message || JSON.stringify(error));
  else console.log("✅ Product Categories!");
}
