/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
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
