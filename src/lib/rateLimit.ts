/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
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
