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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return new Response(
      JSON.stringify({ error: "Missing payment reference" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return new Response(JSON.stringify({ error: "Verification failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
