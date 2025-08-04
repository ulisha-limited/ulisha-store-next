/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

"use client";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import cookies from "js-cookie";
import { useEffect } from "react";

export default function Logout() {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error logging out:", err);
    } finally {
      cookies.remove("partnero_session_uuid");
      cookies.remove("currency");
      redirect("/");
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
    </div>
  );
}
