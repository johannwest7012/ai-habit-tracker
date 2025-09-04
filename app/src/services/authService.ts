import { supabase } from './supabase';
import type { SignUpData, SignInData, PasswordResetData } from '../../../shared/types/models';

export class AuthService {
  static async signUp({ email, password }: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Email confirmation will be handled in app
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data,
        needsVerification: !data.session, // If no session, email verification needed
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'signup_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'signin_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'signout_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static async resetPassword({ email }: PasswordResetData) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined, // Password reset will be handled in app
      });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'reset_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return {
        success: true,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'get_user_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return {
        success: true,
        session,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.message || 'get_session_failed',
          message: this.getErrorMessage(error),
        },
      };
    }
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  private static getErrorMessage(error: any): string {
    if (error.message) {
      // Map common Supabase error messages to user-friendly ones
      switch (error.message) {
        case 'Invalid login credentials':
          return 'Invalid email or password. Please check your credentials and try again.';
        case 'Email not confirmed':
          return 'Please check your email and click the confirmation link before signing in.';
        case 'User already registered':
          return 'An account with this email already exists. Please sign in instead.';
        case 'Password should be at least 6 characters':
          return 'Password must be at least 6 characters long.';
        case 'Unable to validate email address: invalid format':
          return 'Please enter a valid email address.';
        case 'Signup is disabled':
          return 'Account registration is currently disabled. Please contact support.';
        default:
          return error.message;
      }
    }
    return 'An unexpected error occurred. Please try again.';
  }
}