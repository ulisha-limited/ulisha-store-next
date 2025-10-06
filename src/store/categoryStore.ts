/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { supabase } from "../lib/supabase";
import { create } from "zustand";

interface Category {
  name: string;
  count: number;
}

interface CategoryStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: (forceRefresh?: boolean) => Promise<void>;
}

let cachedCategories: Category[] | null = null;
let isFetching = false;

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (forceRefresh = false) => {
    if (cachedCategories && !forceRefresh) {
      set({ categories: cachedCategories, loading: false, error: null });
      return;
    }
    if (isFetching) return;
    isFetching = true;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("product_categories")
      .select("name");
    if (data) {
      const categories = data.map((cat) => ({
        name: cat.name,
        count: 0, // Placeholder for count, can be updated later
      }));
      cachedCategories = categories;
      set({ categories, loading: false, error: null });
    } else if (error) {
      set({ error: error.message, loading: false });
    }
    isFetching = false;
  },
}));
