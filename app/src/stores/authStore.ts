import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { AuthService } from '../services/authService';
import type { SignUpData, SignInData, PasswordResetData, AuthError } from '../../../shared/types/models';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: AuthError | null;
  
  // Actions
  signUp: (data: SignUpData) => Promise<{ success: boolean; needsVerification?: boolean; error?: AuthError }>;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: AuthError }>;
  signOut: () => Promise<{ success: boolean; error?: AuthError }>;
  resetPassword: (data: PasswordResetData) => Promise<{ success: boolean; error?: AuthError }>;
  initialize: () => Promise<void>;
  
  // State setters
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  signUp: async (data: SignUpData) => {
    set({ isLoading: true, error: null });
    
    const result = await AuthService.signUp(data);
    
    if (result.success) {
      if (result.data?.session) {
        set({ 
          session: result.data.session, 
          user: result.data.session.user,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } else {
      set({ error: result.error, isLoading: false });
    }
    
    return result;
  },

  signIn: async (data: SignInData) => {
    set({ isLoading: true, error: null });
    
    const result = await AuthService.signIn(data);
    
    if (result.success && result.data?.session) {
      set({ 
        session: result.data.session, 
        user: result.data.session.user,
        isLoading: false 
      });
    } else {
      set({ error: result.error, isLoading: false });
    }
    
    return result;
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    
    const result = await AuthService.signOut();
    
    if (result.success) {
      set({ session: null, user: null, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
    }
    
    return result;
  },

  resetPassword: async (data: PasswordResetData) => {
    set({ isLoading: true, error: null });
    
    const result = await AuthService.resetPassword(data);
    
    set({ isLoading: false });
    
    if (!result.success) {
      set({ error: result.error });
    }
    
    return result;
  },

  initialize: async () => {
    set({ isLoading: true });

    // Get current session
    const sessionResult = await AuthService.getCurrentSession();
    
    if (sessionResult.success && sessionResult.session) {
      set({ 
        session: sessionResult.session, 
        user: sessionResult.session.user,
        isInitialized: true,
        isLoading: false 
      });
    } else {
      set({ 
        session: null, 
        user: null, 
        isInitialized: true,
        isLoading: false 
      });
    }

    // Set up auth state listener
    AuthService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        set({ session, user: session.user });
      } else if (event === 'SIGNED_OUT') {
        set({ session: null, user: null });
      } else if (event === 'TOKEN_REFRESHED' && session) {
        set({ session, user: session.user });
      }
    });
  },

  setSession: (session) => set({ session, user: session?.user ?? null }),
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ 
    session: null, 
    user: null, 
    isLoading: false, 
    error: null,
    isInitialized: false 
  }),
}));