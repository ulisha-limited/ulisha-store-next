/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { createSupabaseServerClient } from "./lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "./lib/rateLimit";
import _config from "@/config/index";

const PROTECTED_ROUTE_REGEX = [
  /^\/orders/,
  /^\/settings/,
  /^\/admin/,
  /^\/wishlist/,
  /^\/cart/,
  /^\/notifications/,
  /^\/my-account/,
  /^\/logout/,
];

export async function middleware(request: NextRequest) {
  /*
   * Rate Limit
   */
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || "unknown";

  if (/api\//.test(request.nextUrl.pathname)) {
    const maxRequest = /api\/auth\//.test(request.nextUrl.pathname) ? 5 : 10;
    const window = /api\/auth\//.test(request.nextUrl.pathname)
      ? 60 * 60 * 100
      : 5 * 60 * 100;
    const isAllowed = checkRateLimit(ip, maxRequest, window);
    if (!isAllowed)
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (/hello-world$/.test(request.nextUrl.pathname))
    return new NextResponse("Hello World", { status: 200 });
  if (!_config.maintenanceMode && /maintenance$/.test(request.nextUrl.pathname))
    return NextResponse.rewrite(new URL("/not-found", request.url));

  /*
   * controls the maintenance state
   */
  if (_config.maintenanceMode) {
    if (/images/.test(request.nextUrl.pathname)) return NextResponse.next();
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    return NextResponse.rewrite(maintenanceUrl);
  }

  /*
   * Create a Supabase client to check the session
   * and redirect to login if the user is not authenticated.
   */
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (
      !session &&
      PROTECTED_ROUTE_REGEX.some((r) => r.test(request.nextUrl.pathname))
    ) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error(error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|images|videos).*)",
  ],
};
