import { create } from 'zustand';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { clearAllData } from './storage';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ 
        user: session?.user || null,
        loading: false 
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user || null });
        if (event === 'SIGNED_OUT') {
          clearAllData();
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
    clearAllData();
  }
}));