/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import config from "@/config/index";

async function recaptcha(token: string, action: string) {
  if (!token) return false;

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${config.recaptchaSecretKey}&response=${token}`,
  });

  const data = await response.json();

  if (data.action !== action) return false;

  return data.success || data.score < 0.5;
}

export { recaptcha };
