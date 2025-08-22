/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */ 

import { createClient } from "redis";

const redis = await createClient({
  url: process.env.REDIS_URL || "",
}).connect();

export { redis };
