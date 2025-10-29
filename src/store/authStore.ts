/**
 * Required Notice: Copyright (c) 2025 Ulisha Limited (https://www.ulishalimited.com)
 *
 * This file is licensed under the Polyform Noncommercial License 1.0.0.
 * You may obtain a copy of the License at:
 *
 *     https://polyformproject.org/licenses/noncommercial/1.0.0/
 */

import { create } from "zustand";
import { User, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export interface ExtendedUser extends User {
  user_role: string;
}

interface AuthState {
  user: ExtendedUser | null;
  session: unknown;
  authLoaded: boolean;
  setAuthLoaded: (loaded: boolean) => void;
  signOut: () => Promise<void>;
  setUser: (user: ExtendedUser | null) => void;
  setSession: (session: unknown) => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user: ExtendedUser | null) => set({ user }),
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
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      const userWithRole = {
        ...data.session.user,
        user_role: profileData?.role ?? "user",
      };

      set({ user: userWithRole, session: data.session });
    } else {
      set({ user: null, session: null });
    }
    set({ authLoaded: true });
  },
}));
