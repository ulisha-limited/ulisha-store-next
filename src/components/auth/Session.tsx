/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

"use client";

import { useEffect } from "react";
import { ExtendedUser, useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";

export default function Session() {
  const setUser = useAuthStore((state) => state.setUser);
  const setSession = useAuthStore((state) => state.setSession);
  const refreshSession = useAuthStore((state) => state.refreshSession);
  const setAuthLoaded = useAuthStore((state) => state.setAuthLoaded);

  useEffect(() => {
    refreshSession().catch(() => {
      window.location.href = "/login";
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "SIGNED_OUT" && session) {
        setSession(session);
        setUser(session.user as ExtendedUser);
        setAuthLoaded(true);
      } else {
        setSession(null);
        setUser(null);
        setAuthLoaded(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, refreshSession, setAuthLoaded]);

  return null;
}
