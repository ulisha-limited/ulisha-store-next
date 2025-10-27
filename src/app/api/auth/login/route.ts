/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { recaptcha } from "@/lib/recaptcha";
import { cookies } from "next/headers";
import * as Sentry from "@sentry/nextjs";
import config from "@/config";

export async function POST(req: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await req.json();

    if (!email || !password || !recaptchaToken)
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );

    if (config.nodeEnv === "production") {
      const isHuman = await recaptcha(recaptchaToken, "login_form");
      if (!isHuman)
        return NextResponse.json(
          { error: "Failed reCAPTCHA verification" },
          { status: 400 },
        );
    }

    const supabase = createRouteHandlerClient({
      cookies: async () => await cookies(),
    });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    console.log("User", data.user);
    console.log("Session", data.session);

    return NextResponse.json(
      { user: data.user, session: data.session },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error("Login error:", err);
    Sentry.captureException(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
