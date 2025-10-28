import "dotenv/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import productCategories from "./seed/productCategories";
import authUsers from "./seed/authUsers";
import products from "./seed/products";

const supabase: SupabaseClient<any, "public", any> = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function seed(): Promise<void> {
  try {
    console.log("🌱 Seeding started...");
    await authUsers(supabase);
    await productCategories(supabase);
    await products(supabase);
    console.log("🌱 Seeding finished...");
  } catch (error) {
    console.error("🌱", error);
  }
}

seed();
