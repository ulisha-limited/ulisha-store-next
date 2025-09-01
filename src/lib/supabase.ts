/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

 import { createBrowserClient } from "@supabase/ssr";
 import { Database } from "../supabase-types";

 export const supabase = createBrowserClient<Database>(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 );
