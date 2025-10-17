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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return new Response(
      JSON.stringify({ error: "Invalid Payment Reference Number" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!config.paystackSecretKey) {
    throw Error("PAYSTACK_SECRET_KEY is undefined");
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${config.paystackSecretKey}`,
        },
      },
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Verification failed" }), {
      status: 500,
    });
  }
}
