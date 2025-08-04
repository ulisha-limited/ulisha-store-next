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
    <div className="flex items-center justify-center h-screen">
      <div className="w-48">
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-2 bg-blue-500 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
