import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function seed() {
  console.log("🌱 Seeding product categories...");
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
  if (error) console.error("❌ Error:", error);
  else console.log("✅ Done!");
}

seed();
