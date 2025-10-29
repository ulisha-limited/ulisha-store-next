/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import _config from "@/config/index";

const bots = [
  "googlebot",
  "adsbot-google",
  "adsbot-google-mobile",
  "google-display-ads-bot",
  "mediapartners-google",
  "yahoo! slurp",
  "bingbot",
  "yandex",
  "baiduspider",
  "facebookexternalhit",
  "facebookbot",
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
];

const botRegex =
  /(HeadlessChrome|puppeteer|playwright|phantomjs|selenium|curl|wget|node-fetch|python-requests)/i;
const AIRegex =
  /(chatgpt|gptbot|perplexity|claudebot|amazonbot|anthropic-ai|perplexitybot|meta-externalagent|chatgpt-user|google-extended|ccbot|cohere-ai|aibot|facebookai|yandexgpt|youbot|gemini)/i;

export async function middleware(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0] || "unknown";
  const ua = request.headers.get("user-agent") || "";
  const isAllowedBots = bots.some((bot) => ua.toLowerCase().includes(bot));

  /*
   * Simple bot detection patterns
   */
  if (botRegex.test(ua) || AIRegex.test(ua)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // will check for missing headers typical in automation
  if (!isAllowedBots && !request.headers.get("accept-language")) {
    return new NextResponse("Suspicious client", { status: 403 });
  }

  /*
   * Rate Limit
   */
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.png|robots.txt|images|videos).*)",
  ],
};
