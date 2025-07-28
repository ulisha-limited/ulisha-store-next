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
            .from("products")
            .select("category")
            .order("created_at", { ascending: false });
        if (data) {
            const categoryCountMap: Record<string, number> = {};
            data.forEach((product: { category?: string }) => {
                const cat = product.category?.trim();
                if (cat) {
                    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
                }
            });
            const uniqueCategories = Object.entries(categoryCountMap).map(
                ([name, count]) => ({
                    name,
                    count,
                })
            );
            cachedCategories = uniqueCategories;
            set({ categories: uniqueCategories, loading: false, error: null });
        } else if (error) {
            set({ error: error.message, loading: false });
        }
        isFetching = false;
    },
}));