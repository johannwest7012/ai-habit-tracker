/**
 * Authentication Hooks
 * React Query hooks for authentication state management
 * Following query and mutation hook patterns per story requirements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '../services/api/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';
import type { ApiResponse } from '@shared/types/api';

/**
 * Query key factory for authentication queries
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const,
  user: () => [...authQueryKeys.all, 'user'] as const,
} as const;

/**
 * Authentication service functions
 */
const authService = {
  /**
   * Get current session
   */
  async getSession(): Promise<ApiResponse<Session | null>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.getSession();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SESSION_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to get session',
        };
      }

      return {
        success: true,
        data: data.session,
        message: 'Session retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_SESSION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to get session',
      };
    }
  },

  /**
   * Get current user
   */
  async getUser(): Promise<ApiResponse<User | null>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.getUser();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_USER_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to get user',
        };
      }

      return {
        success: true,
        data: data.user,
        message: 'User retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_USER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to get user',
      };
    }
  },

  /**
   * Sign up with email and password
   * Creates user account and sends email verification
   */
  async signUp(
    email: string,
    password: string,
    options: { displayName?: string } = {}
  ): Promise<ApiResponse<{ user: User | null; session: Session | null }>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: options.displayName,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNUP_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign up',
        };
      }

      // Create profile after successful signup
      if (data.user && data.session) {
        try {
          await authService.createProfile(data.user.id, {
            displayName: options.displayName,
          });
        } catch (profileError) {
          console.warn('Profile creation failed during signup:', profileError);
        }
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
        message:
          'Account created successfully. Please check your email for verification.',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNUP_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign up',
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(
    email: string,
    password: string
  ): Promise<ApiResponse<Session | null>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNIN_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign in',
        };
      }

      return {
        success: true,
        data: data.session,
        message: 'Signed in successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNIN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign in',
      };
    }
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNOUT_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign out',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Signed out successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNOUT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign out',
      };
    }
  },

  /**
   * Reset password - send reset email
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_PASSWORD_RESET_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to send password reset email',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_PASSWORD_RESET_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to send password reset email',
      };
    }
  },

  /**
   * Create user profile
   * Called automatically after successful signup
   */
  async createProfile(
    userId: string,
    profileData: { displayName?: string }
  ): Promise<ApiResponse<void>> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.from('profiles').insert({
        user_id: userId,
        profile_data: {
          display_name: profileData.displayName,
          onboarding_completed: false,
        },
        subscription_tier: 'free',
        notification_preferences: {
          push_enabled: true,
          email_enabled: true,
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_PROFILE_CREATE_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to create user profile',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Profile created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'AUTH_PROFILE_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to create user profile',
      };
    }
  },
};

/**
 * Hook for getting current session
 * Includes automatic refetching and error handling
 */
export function useSession() {
  return useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: authService.getSession,
    select: response => (response.success ? response.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as ApiResponse<any>;
        if (apiError.error?.code?.includes('AUTH')) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook for getting current user
 * Includes automatic refetching and error handling
 */
export function useUser() {
  return useQuery({
    queryKey: authQueryKeys.user(),
    queryFn: authService.getUser,
    select: response => (response.success ? response.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === 'object' && 'error' in error) {
        const apiError = error as ApiResponse<any>;
        if (apiError.error?.code?.includes('AUTH')) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook for user sign up
 * Includes profile creation and error handling
 */
export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      password,
      displayName,
    }: {
      email: string;
      password: string;
      displayName?: string;
    }) => authService.signUp(email, password, { displayName }),
    onSuccess: response => {
      if (response.success && response.data?.session) {
        // Invalidate auth queries to refetch user data
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      }
    },
    onError: error => {
      console.error('Sign up failed:', error);
    },
  });
}

/**
 * Hook for user sign in
 * Includes optimistic updates and error handling
 */
export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: response => {
      if (response.success && response.data) {
        // Invalidate auth queries to refetch user data
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      }
    },
    onError: error => {
      console.error('Sign in failed:', error);
    },
  });
}

/**
 * Hook for user sign out
 * Includes cache clearing and error handling
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: response => {
      if (response.success) {
        // Clear all auth-related queries
        queryClient.removeQueries({ queryKey: authQueryKeys.all });
        // Clear all cached data on sign out
        queryClient.clear();
      }
    },
    onError: error => {
      console.error('Sign out failed:', error);
    },
  });
}

/**
 * Hook for password reset
 * Sends password reset email
 */
export function usePasswordReset() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      authService.resetPassword(email),
    onError: error => {
      console.error('Password reset failed:', error);
    },
  });
}

/**
 * Hook for checking if user is authenticated
 * Convenience hook that combines session and user data
 */
export function useAuth() {
  const sessionQuery = useSession();
  const userQuery = useUser();

  return {
    // Authentication state
    isAuthenticated: !!sessionQuery.data && !!userQuery.data,
    session: sessionQuery.data,
    user: userQuery.data,

    // Loading states
    isLoading: sessionQuery.isLoading || userQuery.isLoading,
    isFetching: sessionQuery.isFetching || userQuery.isFetching,

    // Error states
    error: sessionQuery.error || userQuery.error,
    isError: sessionQuery.isError || userQuery.isError,

    // Refetch functions
    refetch: () => {
      sessionQuery.refetch();
      userQuery.refetch();
    },
  };
}
