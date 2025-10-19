/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import config from "@/config/index";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount } = body;

    const callbackUrl =
      config.nodeEnv === "development"
        ? config.paystackCallbackURLDevelopment
        : config.paystackCallbackURLProduction;

    if (!config.paystackSecretKey) {
      throw Error("PAYSTACK_SECRET_KEY is undefined");
    }
    if (!callbackUrl) {
      throw Error("PAYSTACK_CALLBACK_URLS is undefined");
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount,
        currency: "NGN",
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Initialization error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
