/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
 */


import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isDisposableEmail, validateEmail } from "@/lib/emailChecker";
import { recaptcha } from "@/lib/recaptcha";

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, name, recaptchaToken } =
      await req.json();

    if (!email || !password || !confirmPassword || !name || !recaptchaToken)
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );

    if (password !== confirmPassword)
      return NextResponse.json(
        { error: "Password did not match. Please try again." },
        { status: 400 },
      );

    if (password === email || password === name)
      return NextResponse.json(
        { error: "Password must not include your email or name!" },
        { status: 400 },
      );

    if (!validateEmail(email))
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 },
      );

    if (await isDisposableEmail(email))
      return NextResponse.json(
        { error: "Disposable emails are not allowed" },
        { status: 400 },
      );

    const isHuman = await recaptcha(recaptchaToken, "register_form");
    if (!isHuman)
      return NextResponse.json(
        { error: "Failed reCAPTCHA verification" },
        { status: 400 },
      );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
