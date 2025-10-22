/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/supabase-types";
import { supabase } from "@/lib/supabase/client";

type Product = Database["public"]["Tables"]["products"]["Row"];
type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
type UserAddress = Database["public"]["Tables"]["user_addresses"]["Row"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id } = body;

  return NextResponse.json({ success: true });
}
