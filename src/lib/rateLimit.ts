/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
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
