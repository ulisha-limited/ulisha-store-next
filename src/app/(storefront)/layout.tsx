/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { isMobileRequest } from "@/lib/device";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import NavComponent from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import BottomNav from "@/components/layouts/BottomNav";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const [productCategoriesRes, isMobile] = await Promise.all([
    supabase.from("product_categories").select("name"),
    isMobileRequest(),
  ]);

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <NavComponent
        productCategories={productCategoriesRes.data ?? []}
        isMobile={isMobile}
      />
      <div className="flex-1 pt-[90px]">{children}</div>
      {!isMobile && <Footer />}
      {isMobile && <BottomNav />}
    </main>
  );
}
