/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

"use client";
import { useCategoryStore } from "@/store/categoryStore";
import Link from "next/link";
import { useEffect } from "react";

export default function Category() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="p-4">
      <h1 className="text-black text-2xl font-bold mb-4">Categories</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={`/category/${category.name}`}
              className="block p-4 bg-white rounded shadow hover:bg-orange-50 hover:text-orange-500 text-blue-600"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
