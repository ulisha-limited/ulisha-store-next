/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import * as Sentry from "@sentry/nextjs";
import config from "@/config/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, status, sign } = body;

    if (!config.mixPayAppId) {
      throw Error("MIXPAY_APP_ID is undefined");
    }

    const isValid = verifySignature(body, config.mixPayAppId);
    if (!isValid) {
      throw Error("Invalid Signature");
    }

    if (status === "PAID") {
      // TODO: Update your order status in DB
      console.log(`Order ${order_id} was paid.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

function verifySignature(data: any, appSecret: string) {
  const keys = Object.keys(data)
    .sort()
    .filter((k) => k !== "sign");
  const signStr = keys.map((k) => `${k}=${data[k]}`).join("&") + appSecret;
  const hash = crypto.createHash("md5").update(signStr).digest("hex");
  return hash === data.sign;
}
