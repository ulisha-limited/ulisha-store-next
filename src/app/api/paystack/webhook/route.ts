/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import crypto from "crypto";
import * as Sentry from "@sentry/nextjs";
import _config from "@/config/index";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const chunks: Uint8Array[] = [];
    const reader = req.body?.getReader();

    if (!reader) {
      return new Response(JSON.stringify({ error: "No request body" }), {
        status: 400,
      });
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const rawBody = Buffer.concat(chunks).toString("utf-8");
    const signature = req.headers.get("x-paystack-signature");

    if (!_config.paystackSecretKey) {
      throw Error("PAYSTACK_SECRET_KEY is undefined");
    }

    const hash = crypto
      .createHmac("sha512", _config.paystackSecretKey)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      throw Error("Invalid Signature");
    }

    const event = JSON.parse(rawBody);

    console.log("Paystack Webhook Event:", event);

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
