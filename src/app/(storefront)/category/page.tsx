/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShirt,
  faTag,
  faStopwatch,
  faMicrochip,
  faSprayCan,
  faMobileScreenButton,
  faBagShopping,
  faGem,
  faDumbbell,
  faPuzzlePiece,
  faBlender,
  faLaptop,
  faBicycle,
} from "@fortawesome/free-solid-svg-icons";

const getIconForCategory = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "clothes":
      return <FontAwesomeIcon icon={faShirt} />;
    case "accessories":
      return <FontAwesomeIcon icon={faTag} />;
    case "smart watches":
      return <FontAwesomeIcon icon={faStopwatch} />;
    case "electronics":
      return <FontAwesomeIcon icon={faMicrochip} />;
    case "perfumes & body spray":
      return <FontAwesomeIcon icon={faSprayCan} />;
    case "phones":
      return <FontAwesomeIcon icon={faMobileScreenButton} />;
    case "handbags":
      return <FontAwesomeIcon icon={faBagShopping} />;
    case "jewelries":
      return <FontAwesomeIcon icon={faGem} />;
    case "gym wear":
      return <FontAwesomeIcon icon={faDumbbell} />;
    case "kids toy":
      return <FontAwesomeIcon icon={faPuzzlePiece} />;
    case "home appliances":
      return <FontAwesomeIcon icon={faBlender} />;
    case "female clothings":
      return <FontAwesomeIcon icon={faBagShopping} />;
    case "computer and gaming":
      return <FontAwesomeIcon icon={faLaptop} />;
    case "e-bikes":
      return <FontAwesomeIcon icon={faBicycle} />;
    default:
      return <FontAwesomeIcon icon={faBagShopping} />;
  }
};

export const metadata: Metadata = {
  title: "Categories - Ulisha Store",
  description:
    "Browse product categories at Ulisha Store and discover a wide range of quality goods.",
  keywords: [
    "Ulisha Store",
    "Categories",
    "Shop by Category",
    "Online Shopping",
    "E-commerce",
    "Affordable Products",
    "Trendy Items",
    "Quality Goods",
    "Product Selection",
  ],
  openGraph: {
    title: "Categories - Ulisha Store",
    description:
      "Browse product categories at Ulisha Store and discover a wide range of quality goods.",
    url: "https://www.ulishastore.com/category",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://www.ulishastore.com/favicon.png",
        width: 1200,
        height: 630,
        alt: "Ulisha Store Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Categories - Ulisha Store",
    description:
      "Browse product categories at Ulisha Store and discover a wide range of quality goods.",
    images: ["https://www.ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default async function CategoryPage() {
  const supabase = createSupabaseServerClient();
  const productCategories = await supabase
    .from("product_categories")
    .select("name");
  const categories = productCategories.data ?? [];

  return (
    <div className="py-16 bg-gradient-to-br from-orange-50 to-indigo-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-20 tracking-wide drop-shadow-md">
        Explore Our Products Catalog
      </h1>
      <div className="container mx-auto px-6">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {[...categories]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category, index) => {
              const bgGradients = [
                "from-pink-100 to-pink-50",
                "from-yellow-100 to-yellow-50",
                "from-green-100 to-green-50",
                "from-blue-100 to-blue-50",
                "from-purple-100 to-purple-50",
              ];
              const bg = bgGradients[index % bgGradients.length];
              return (
                <li key={category.name}>
                  <Link
                    href={`/category/${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, "-"))}`}
                    prefetch={false}
                    className={`group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br ${bg} rounded-3xl shadow-lg transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105 hover:rotate-1 hover:shadow-2xl`}
                  >
                    <div className="text-5xl text-gray-700 mb-4 transition-transform duration-500 group-hover:scale-125 group-hover:text-orange-500 animate-bounce-slow">
                      {getIconForCategory(category.name)}
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 text-center tracking-wide transition-colors duration-300 group-hover:text-orange-600">
                      {category.name}
                    </h2>

                    <span className="absolute bottom-2 opacity-0 group-hover:opacity-100 text-xs text-gray-600 transition-opacity duration-300">
                      Discover more in {category.name}
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
