/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { recaptcha } from "@/lib/recaptcha";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await req.json();

    if (!email || !password || !recaptchaToken)
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );

    const isHuman = await recaptcha(recaptchaToken, "login_form");
    if (!isHuman)
      return NextResponse.json(
        { error: "Failed reCAPTCHA verification" },
        { status: 400 },
      );

    const supabase = createRouteHandlerClient({ cookies: async () => await cookies() });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

      console.log("User", data.user)
      console.log("Session", data.session)

    return NextResponse.json(
      { user: data.user, session: data.session },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
