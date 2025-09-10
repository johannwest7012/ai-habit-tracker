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
