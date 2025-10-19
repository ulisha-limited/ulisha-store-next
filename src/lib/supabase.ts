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

export const supabase = createBrowserClient<Database>(
  config.supabaseURL,
  config.supabaseAnonKey,
);
