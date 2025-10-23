/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/supabase-types";
import config from "@/config/index";

export function createSupabaseServerClient() {
  let cookieStorePromise: ReturnType<typeof cookies> | null = null;

  try {
    cookieStorePromise = cookies();
  } catch {
    cookieStorePromise = null;
  }

  return createServerClient<Database>(
    config.supabaseURL,
    config.supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          if (!cookieStorePromise) return [];
          const cookieStore = await cookieStorePromise;
          return cookieStore?.getAll?.() ?? [];
        },
        async setAll(cookiesToSet) {
          if (!cookieStorePromise) return;
          const cookieStore = await cookieStorePromise;
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // safely ignore in static/edge contexts
            }
          });
        },
      },
    },
  );
}
