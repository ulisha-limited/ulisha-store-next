/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/supabase-types";
import config from "@/config/index";

let browserSupabaseClient: ReturnType<
  typeof createBrowserClient<Database>
> | null = null;

function getBrowserSupabaseClient() {
  if (browserSupabaseClient) {
    return browserSupabaseClient;
  }

  if (!config.supabaseURL || !config.supabaseAnonKey) {
    throw new Error(
      "Supabase browser configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  browserSupabaseClient = createBrowserClient<Database>(
    config.supabaseURL,
    config.supabaseAnonKey,
  );

  return browserSupabaseClient;
}

export const supabase = new Proxy(
  {} as ReturnType<typeof createBrowserClient<Database>>,
  {
    get(_target, prop, receiver) {
      const client = getBrowserSupabaseClient();
      const value = Reflect.get(client as object, prop, receiver);
      return typeof value === "function" ? value.bind(client) : value;
    },
  },
);
