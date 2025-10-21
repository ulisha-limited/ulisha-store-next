/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import Footer from "@/components/layouts/Footer";
import { SecondaryNav } from "@/components/layouts/SecondaryNav";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <SecondaryNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
