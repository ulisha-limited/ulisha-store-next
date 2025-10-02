/**
 * Copyright (c) 2025 Ulisha Limited
 *
 * This file is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License.
 * You may obtain a copy of the License at:
 *
 *     https://creativecommons.org/licenses/by-nc/4.0/
 *
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
