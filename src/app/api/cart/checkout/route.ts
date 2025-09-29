/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/supabase-types";
import { supabase } from "@/lib/supabase";

type Product = Database["public"]["Tables"]["products"]["Row"];
type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];
type UserAddress = Database["public"]["Tables"]["user_addresses"]["Row"];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id } = body;

  return NextResponse.json({ success: true });
}
