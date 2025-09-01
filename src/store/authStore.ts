/**
 * Copyright 2025 Ulisha Limited
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

import { create } from "zustand";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  session: unknown;
  authLoaded: boolean;
  setAuthLoaded: (loaded: boolean) => void;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: unknown) => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  session: null,
  setSession: (session) => set({ session }),
  authLoaded: false,
  setAuthLoaded: (loaded: boolean) => set({ authLoaded: loaded }),

  signOut: async () => {
    try {
      const currentUser = get().user;
      if (currentUser) {
        try {
          const { data: session } = await supabase
            .from("shopping_sessions")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("status", "active")
            .single();

          if (session?.id) {
            await supabase
              .from("shopping_sessions")
              .update({ status: "closed" })
              .eq("id", session.id);
          }
        } catch (error) {
          console.error("Error cleaning up shopping session:", error);
        }
      }

      await supabase.auth.signOut();
      set({ user: null, session: null, authLoaded: true });
    } catch (error) {
      console.error("Error signing out:", error);
      set({ user: null, session: null, authLoaded: true });
      throw error;
    }
  },

  refreshSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (data.session) {
      set({ user: data.session.user, session: data.session });
    } else {
      set({ user: null, session: null });
    }
    set({ authLoaded: true });
  },
}));
