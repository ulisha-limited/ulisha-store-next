import Category from "./category.client";
import { Metadata } from "next";

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
    url: "https://ulishastore.com/category",
    siteName: "Ulisha Store",
    images: [
      {
        url: "https://ulishastore.com/favicon.png",
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
    images: ["https://ulishastore.com/favicon.png"],
    creator: "@ulishastore",
  },
};

export default function CategoryPage() {
  return <Category />;
}
