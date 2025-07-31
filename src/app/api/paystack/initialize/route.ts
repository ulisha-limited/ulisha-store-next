/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
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
