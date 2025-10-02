/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount } = body;

    const callbackUrl =
      process.env.NODE_ENV === "development"
        ? process.env.PAYSTACK_CALLBACK_URL_DEVELOPMENT
        : process.env.PAYSTACK_CALLBACK_URL_PRODUCTION;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        currency: "NGN",
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Initialization error:", error);
    return new Response(
      JSON.stringify({ error: "Payment initialization failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
