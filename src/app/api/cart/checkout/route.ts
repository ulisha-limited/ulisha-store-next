/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { order_id } = await req.json();

  if (!order_id) {
    return NextResponse.json(
      { success: false, error: "order_id is required" },
      { status: 400 },
    );
  }

  return NextResponse.json({ success: true, order_id });
}
