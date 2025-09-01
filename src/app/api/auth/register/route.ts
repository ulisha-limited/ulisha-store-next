/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isDisposableEmail } from "@/lib/emailChecker";

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, name } = await req.json();

    if (!email || !password || !confirmPassword || !name)
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );

    if (password !== confirmPassword)
      return NextResponse.json(
        { error: "Password did not match. Please try again." },
        { status: 400 },
      );

    if (await isDisposableEmail(email))
      return NextResponse.json(
        { error: "Disposable emails are not allowed" },
        { status: 400 },
      );

    if (password === email || password === name)
      return NextResponse.json(
        { error: "Password must not include your email or name!" },
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
