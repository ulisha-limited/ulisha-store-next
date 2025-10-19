/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import config from "@/config/index";

Sentry.init({
  dsn: config.sentryDNS,
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: config.nodeEnv === "production" && config.enableSentry,
});
