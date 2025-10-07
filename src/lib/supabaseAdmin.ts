/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


 import { createClient } from "@supabase/supabase-js";
 import { Database } from "@/supabase-types";

 export const supabaseAdmin = createClient<Database>(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.SUPABASE_SERVICE_ROLE_KEY!
 );
