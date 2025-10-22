/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import * as Sentry from "@sentry/nextjs";
import { createSupabaseServerClient } from "@/lib/supabase/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;

  if (!query) {
    return new Response(
      JSON.stringify({ error: "query cannot be undefined" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const supabase = createSupabaseServerClient();

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,shipping_location.ilike.%${query}%,category.ilike.%${query}%`,
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      Sentry.captureException(error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch products" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 1,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Search error:", error);
    Sentry.captureException(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
