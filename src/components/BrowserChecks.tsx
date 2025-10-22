/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useEffect } from "react";

export default function BrowserCheckPage() {
  useEffect(() => {
    async function detectHeadless() {
      try {
        const isWebdriver = navigator.webdriver;
        const hardwareConcurrency = navigator.hardwareConcurrency || 0;

        if (isWebdriver || hardwareConcurrency < 2) {
          document.title = "Access Denied";
          document.body.innerHTML =
            "<h1 style='text-align:center;margin-top:20vh;font-family:sans-serif;'>Access Denied</h1>";
          window.stop();
        }
      } catch (err) {
        console.error("Browser check error:", err);
      }
    }

    detectHeadless();
  }, []);

  return null;
}
