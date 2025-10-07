/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const searchEngines = [
  "https://bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://www.naver.com/indexnow",
  "https://www.seznam.cz/indexnow",
];

const key = "a5c114601b0c45089b5d1c210d43a59b";
const keyLocation = `https://www.ulishastore.com/${key}.txt`;
const host = "www.ulishastore.com";

export async function GET(req: NextRequest) {
  const searchParams = await req.nextUrl.searchParams;
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing productId parameter" },
      { status: 400 }
    );
  }

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      productId
    ) === false
  ) {
    return NextResponse.json(
      { error: "Invalid productId format" },
      { status: 400 }
    );
  }

  const urlToNotify = `https://${host}/product/${productId}`;

  try {
    for (const engine of searchEngines) {
      const res = await axios.get(engine, {
        params: {
          url: urlToNotify,
          key,
          keyLocation,
        },
      });

      if (res.status !== 200) {
        console.error(`Failed to notify ${engine}:`, res.data);
      } else {
        console.log(`Successfully notified ${engine}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IndexNow notification error:", error);
    return NextResponse.json(
      { error: "Failed to notify IndexNow" },
      { status: 500 }
    );
  }
}
