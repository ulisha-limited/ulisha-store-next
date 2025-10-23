/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */


"use client";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
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
