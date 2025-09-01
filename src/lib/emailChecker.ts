/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import axios from "axios";

const BLOCKLIST_URL =
  "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/refs/heads/main/disposable_email_blocklist.conf";

let cachedDomains: Set<string> | null = null;
let lastFetched: number | null = null;
const CACHE_TTL = 24000 * 60 * 60;

export async function isDisposableEmail(email: string): Promise<boolean> {
  const domain = email.split("@").pop()?.toLowerCase();
  if (!domain) return true;

  const now = Date.now();

  if (!cachedDomains || !lastFetched || now - lastFetched > CACHE_TTL) {
    const res = await axios.get<string>(BLOCKLIST_URL);
    const domains = res.data
      .split("\n")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);

    cachedDomains = new Set(domains);
    lastFetched = now;
  }

  return cachedDomains.has(domain);
}
