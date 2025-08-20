/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const MAINTENANCE = process.env.MAINTENANCE_MODE === "true";
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
  if (/hello-world$/.test(request.nextUrl.pathname))
    return new NextResponse("Hello World", { status: 200 });
  if (!MAINTENANCE && /maintenance$/.test(request.nextUrl.pathname))
    return NextResponse.rewrite(new URL("/not-found", request.url));
  /*
   * controls the maintenance state
   */
  if (MAINTENANCE) {
    if (/images/.test(request.nextUrl.pathname)) return NextResponse.next();
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = "/maintenance";
    return NextResponse.rewrite(maintenanceUrl);
  }

  /*
   * Create a Supabase client to check the session
   * and redirect to login if the user is not authenticated.
   */
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

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

  /*
   * Check if the request is from a bot and handle prerendering
   * This is useful for SEO and performance optimization.
   */
  const userAgent = request.headers.get("user-agent");

  const bots = [
    "googlebot",
    "yahoo! slurp",
    "bingbot",
    "yandex",
    "baiduspider",
    "facebookexternalhit",
    "twitterbot",
    "rogerbot",
    "linkedinbot",
    "embedly",
    "quora link preview",
    "showyoubot",
    "outbrain",
    "pinterest/0.",
    "developers.google.com/+/web/snippet",
    "slackbot",
    "vkshare",
    "w3c_validator",
    "redditbot",
    "applebot",
    "whatsapp",
    "flipboard",
    "tumblr",
    "bitlybot",
    "skypeuripreview",
    "nuzzel",
    "discordbot",
    "google page speed",
    "qwantify",
    "pinterestbot",
    "bitrix link preview",
    "xing-contenttabreceiver",
    "chrome-lighthouse",
    "telegrambot",
    "oai-searchbot",
    "chatgpt",
    "gptbot",
    "perplexity",
    "claudeBot",
    "amazonbot",
    "integration-test", // Integration testing
  ];

  const IGNORE_EXTENSIONS = [
    ".js",
    ".css",
    ".xml",
    ".less",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".pdf",
    ".doc",
    ".txt",
    ".ico",
    ".rss",
    ".zip",
    ".mp3",
    ".rar",
    ".exe",
    ".wmv",
    ".doc",
    ".avi",
    ".ppt",
    ".mpg",
    ".mpeg",
    ".tif",
    ".wav",
    ".mov",
    ".psd",
    ".ai",
    ".xls",
    ".mp4",
    ".m4a",
    ".swf",
    ".dat",
    ".dmg",
    ".iso",
    ".flv",
    ".m4v",
    ".torrent",
    ".woff",
    ".ttf",
    ".svg",
    ".webmanifest",
  ];
  const isBot =
    userAgent && bots.some((bot) => userAgent.toLowerCase().includes(bot));
  const isPrerender = request.headers.get("X-Prerender");
  const pathname = new URL(request.url).pathname;
  const extension = pathname.slice(((pathname.lastIndexOf(".") - 1) >>> 0) + 1);

  if (
    isPrerender ||
    !isBot ||
    (extension.length && IGNORE_EXTENSIONS.includes(extension))
  ) {
    return NextResponse.next();
  } else {
    // Check if request is coming from a bot
    if (isBot) {
      const newURL = `http://service.prerender.io/${request.url}`;
      const newHeaders = new Headers(request.headers);
      newHeaders.set("X-Prerender-Token", process.env.PRERENDER_TOKEN || "");
      newHeaders.set("X-Prerender-Int-Type", "NextJS");

      try {
        const res = await fetch(
          new Request(newURL, {
            headers: newHeaders,
            redirect: "manual",
          })
        );

        const responseHeaders = new Headers(res.headers);
        responseHeaders.set("X-Redirected-From", request.url);

        // Create a ReadableStream from the response body
        const { readable, writable } = new TransformStream();
        if (res.body) {
          res.body.pipeTo(writable);
        } else {
          writable.close();
        }

        const response = new NextResponse(readable, {
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
        });

        return response;
      } catch (error) {
        return NextResponse.next();
      }
    } else {
      console.log("Not a bot, proceeding normally");
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)"],
};
