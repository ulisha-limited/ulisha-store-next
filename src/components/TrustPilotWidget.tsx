/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


"use client";

import Script from "next/script";

export default function TrustPilotWidget() {
  return (
    <>
      <div
        className="trustpilot-widget mt-5"
        data-locale="en-US"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="68a85002e9dab32fe8f239d0"
        data-style-height="52px"
        data-style-width="100%"
        data-token="279b86b2-9917-4690-9d15-57ef510124f1"
      >
        <a
          href="https://www.trustpilot.com/review/ulishastore.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>

      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
