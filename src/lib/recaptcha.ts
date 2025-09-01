/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

const secret = process.env.RECAPTCHA_SECRET_KEY || "";

async function recaptcha(token: string, action: string) {
  if (!token) return false;

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await response.json();

  if (data.action !== action) return false;

  return data.success || data.score < 0.5;
}

export { recaptcha };
