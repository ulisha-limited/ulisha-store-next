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
  const cookieStorePromise = cookies();

  return createServerClient<Database>(
    config.supabaseURL,
    config.supabaseAnonKey,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookieStorePromise;
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookieStorePromise;
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}
