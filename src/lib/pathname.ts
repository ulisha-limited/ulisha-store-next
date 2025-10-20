/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { headers } from "next/headers";

export async function getServerPathname(): Promise<string> {
  const headersList = await headers();
  const referer = headersList.get("referer");
  if (referer) {
    const url = new URL(referer);
    return url.pathname;
  }

  return "/";
}
