/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount } = body;

  try {
    const res = await axios.post("https://api.mixpay.me/v1/one_time_payment", {
      quoteAmount: amount,
      quoteAssetId: "usd",
      settlementAssetId: "c94ac88f-4671-3976-b60a-09064f1811e8",
      payeeId: process.env.MIXPAY_APP_ID,
      orderId: `order-${Date.now()}`,
      isTemp: "1",
      returnTo: "https://ulishastore.com/orders",
      callbackUrl: "https://ulishastore.com/api/mixpay/webhook",
    });

    return NextResponse.json({
      paymentUrl: `https://mixpay.me/code/${res.data.data.code}`,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
