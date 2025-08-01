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
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error instanceof AuthError) {
          if (error.status === 0) {
            throw new Error(
              "Unable to connect to authentication service. Please check your internet connection and try again."
            );
          }
          throw new Error(error.message);
        }
        throw error;
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error instanceof AuthError) {
          if (error.status === 0) {
            throw new Error(
              "Unable to connect to authentication service. Please check your internet connection and try again."
            );
          }
          throw new Error(error.message);
        }
        throw error;
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

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
