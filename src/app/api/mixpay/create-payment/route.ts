/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import config from "@/config/index";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount } = body;

  if (!config.mixPayAppId) {
    throw Error("MIXPAY_APP_ID is undefined");
  }
  if (!config.mixPayReturnTo) {
    throw Error("MIXPAY_RETURN_TO is undefined");
  }
  if (!config.mixPayCallbackUrl) {
    throw Error("MIXPAY_CALLBACK_URL is undefined");
  }

  try {
    const res = await axios.post("https://api.mixpay.me/v1/one_time_payment", {
      quoteAmount: amount,
      quoteAssetId: "usd",
      settlementAssetId: "c94ac88f-4671-3976-b60a-09064f1811e8",
      payeeId: config.mixPayAppId,
      orderId: `order-${Date.now()}`,
      isTemp: "1",
      returnTo: config.mixPayReturnTo,
      callbackUrl: config.mixPayCallbackUrl,
    });

    return NextResponse.json({
      paymentUrl: `https://mixpay.me/code/${res.data.data.code}`,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
