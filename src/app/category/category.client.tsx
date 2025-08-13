/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";
import { useCategoryStore } from "@/store/categoryStore";
import Link from "next/link";
import { useEffect } from "react";
import {
  Shirt,
  Tag,
  Watch,
  CircuitBoard,
  SprayCan,
  Smartphone,
  Handbag,
  Gem,
  Dumbbell,
  ToyBrick,
  WashingMachine,
  ShoppingBag,
  Laptop,
  Bike,
} from "lucide-react";

// Helper function to map category names to Lucide icons
const getIconForCategory = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "clothes":
      return <Shirt />;
    case "accessories":
      return <Tag />;

    case "smart watches":
      return <Watch />;
    case "electronics":
      return <CircuitBoard />;
    case "perfumes & body spray":
      return <SprayCan />;
    case "phones":
      return <Smartphone />;
    case "handbags":
      return <Handbag />;
    case "jewelries":
      return <Gem />;
    case "gym wear":
      return <Dumbbell />;
    case "kids toy":
      return <ToyBrick />;
    case "home appliances":
      return <WashingMachine />;
    case "female clothings":
      return <ShoppingBag />;
    case "computer & gaming":
      return <Laptop />;
    case "e-bikes":
      return <Bike />;
    default:
      return <ShoppingBag />; // Default icon for unmapped categories
  }
};

export default function Category() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Update categories with the new list
  const updatedCategories = [
    { name: "Clothes" },
    { name: "Accessories" },
    { name: "Shoes" },
    { name: "Smart Watches" },
    { name: "Electronics" },
    { name: "Perfumes & Body Spray" },
    { name: "Phones" },
    { name: "Handbags" },
    { name: "Jewelries" },
    { name: "Gym Wear" },
    { name: "Kids toy" },
    { name: "Home Appliances" },
    { name: "Female clothings" },
    { name: "Computer & gaming" },
    { name: "E-bikes" },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-16 tracking-wide">
        Shop by Category
      </h1>
      <div className="container mx-auto px-6">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {updatedCategories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/category/${category.name}`}
                prefetch={false}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-5xl text-gray-600 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-orange-500">
                  {getIconForCategory(category.name)}
                </div>
                <h2 className="text-lg font-semibold text-gray-800 text-center transition-colors duration-300 group-hover:text-orange-600">
                  {category.name}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
