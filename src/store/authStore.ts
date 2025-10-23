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

interface AuthState {
  user: User | null;
  session: unknown;
  authLoaded: boolean;
  setAuthLoaded: (loaded: boolean) => void;
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
               "Unable to connect to authentication service. Please check your internet connection and try again.",
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
