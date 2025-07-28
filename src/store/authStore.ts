import { create } from 'zustand';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: unknown;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: unknown) => void;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error instanceof AuthError) {
          if (error.status === 0) {
            throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
          }
          if (error.message.includes('User already registered')) {
            throw new Error('An account with this email already exists. Please sign in instead.');
          }
          throw new Error(error.message);
        }
        throw error;
      }
      
      if (data.user) {
        set({ user: data.user, session: data.session });
      }
    } catch (error) {
      console.error('Error signing up:', error);
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
            throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
          }
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw new Error(error.message);
        }
        throw error;
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      // First clear any existing cart/shopping session
      const currentUser = get().user;
      if (currentUser) {
        try {
          const { data: session } = await supabase
            .from('shopping_sessions')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('status', 'active')
            .single();

          if (session?.id) {
            await supabase
              .from('shopping_sessions')
              .update({ status: 'closed' })
              .eq('id', session.id);
          }
        } catch (error) {
          console.error('Error cleaning up shopping session:', error);
        }
      }

      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ user: null, session: null });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (error instanceof AuthError) {
          if (error.status === 0) {
            console.error('Unable to connect to authentication service');
            set({ user: null, session: null });
            return;
          }
          if (error.status === 400 || error.message.includes('refresh_token')) {
            set({ user: null, session: null });
            return;
          }
        }
        throw error;
      }

      if (session) {
        set({ user: session.user, session });
      } else {
        set({ user: null, session: null });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      set({ user: null, session: null });
    }
  },
}));