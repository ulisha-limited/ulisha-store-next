/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

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
    ".woff2",
    ".ttf",
    ".svg",
    ".webmanifest",
  ];

  const isBot = bots.some((bot) => userAgent.toLowerCase().includes(bot));
  const isPrerender = request.headers.get("x-prerender");
  const url = new URL(request.url);
  const pathname = url.pathname;

  const extension = pathname.includes(".")
    ? pathname.slice(pathname.lastIndexOf("."))
    : "";

  if (
    isPrerender ||
    !isBot ||
    (extension && IGNORE_EXTENSIONS.includes(extension))
  ) {
    return NextResponse.next();
  }

  try {
    // Build the prerender.io URL with pathname and search params only (avoid duplicating protocol/host)
    const prerenderURL = `https://service.prerender.io${pathname}${url.search}`;

    const prerenderHeaders = new Headers(request.headers);
    prerenderHeaders.set(
      "X-Prerender-Token",
      process.env.PRERENDER_TOKEN || ""
    );
    prerenderHeaders.set("X-Prerender-Int-Type", "NextJS");

    const prerenderResponse = await fetch(prerenderURL, {
      headers: prerenderHeaders,
      redirect: "manual",
    });

    // Clone headers from prerender response
    const responseHeaders = new Headers(prerenderResponse.headers);
    responseHeaders.set("X-Redirected-From", request.url);

    // Create NextResponse from prerender response body stream
    return new NextResponse(prerenderResponse.body, {
      status: prerenderResponse.status,
      statusText: prerenderResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Prerender fetch error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
  ],
}