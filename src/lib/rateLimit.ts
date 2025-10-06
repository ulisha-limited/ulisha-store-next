/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


 const ipRequests: Record<string, { count: number; firstRequest: number }> = {};

export function checkRateLimit(ip: string, maxRequests: number, rateLimitWindow: number): boolean {
  const now = Date.now();

  if (!ipRequests[ip]) {
    ipRequests[ip] = { count: 1, firstRequest: now };
    return true;
  }

  const data = ipRequests[ip];
  if (now - data.firstRequest < rateLimitWindow) {
    if (data.count >= maxRequests) {
      return false; // ❌ over the limit
    }
    data.count++;
    return true;
  }

  // reset window
  ipRequests[ip] = { count: 1, firstRequest: now };
  return true;
}
