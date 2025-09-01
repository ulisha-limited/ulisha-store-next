/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

 import { createClient } from "@supabase/supabase-js";
 import { Database } from "@/supabase-types";

 export const supabaseAdmin = createClient<Database>(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.SUPABASE_SERVICE_ROLE_KEY!
 );
