/**
 * Query Helper Utilities
 * Standardized error and loading state patterns for React Query
 * Following error and loading state patterns per story requirements
 */

import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { ApiResponse } from '@shared/types/api';

/**
 * Standard loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
  isPending?: boolean;
}

/**
 * Standard error state interface
 */
export interface ErrorState {
  isError: boolean;
  error: Error | null;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Combined query state interface
 */
export interface QueryState extends LoadingState, ErrorState {
  isSuccess: boolean;
  isStale: boolean;
}

/**
 * Mutation state interface
 */
export interface MutationState extends ErrorState {
  isPending: boolean;
  isSuccess: boolean;
  isIdle: boolean;
}

/**
 * Query result wrapper with standardized state
 */
export interface StandardQueryResult<T> extends QueryState {
  data: T | undefined;
  refetch: () => void;
}

/**
 * Mutation result wrapper with standardized state
 */
export interface StandardMutationResult<TData, TVariables>
  extends MutationState {
  data: TData | undefined;
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

/**
 * Extract standardized query state from React Query result
 */
export function getQueryState<T>(
  queryResult: UseQueryResult<ApiResponse<T>, Error>
): QueryState {
  return {
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isRefetching: queryResult.isRefetching,
    isError: queryResult.isError,
    error: queryResult.error,
    errorCode: queryResult.error?.name,
    errorMessage: queryResult.error?.message,
    isSuccess: queryResult.isSuccess,
    isStale: queryResult.isStale,
  };
}

/**
 * Extract standardized mutation state from React Query result
 */
export function getMutationState<TData, TVariables>(
  mutationResult: UseMutationResult<TData, Error, TVariables>
): MutationState {
  return {
    isPending: mutationResult.isPending,
    isError: mutationResult.isError,
    error: mutationResult.error,
    errorCode: mutationResult.error?.name,
    errorMessage: mutationResult.error?.message,
    isSuccess: mutationResult.isSuccess,
    isIdle: mutationResult.isIdle,
  };
}

/**
 * Create standardized query result wrapper
 */
export function createStandardQueryResult<T>(
  queryResult: UseQueryResult<ApiResponse<T>, Error>
): StandardQueryResult<T> {
  return {
    ...getQueryState(queryResult),
    data: queryResult.data?.success ? queryResult.data.data : undefined,
    refetch: queryResult.refetch,
  };
}

/**
 * Create standardized mutation result wrapper
 */
export function createStandardMutationResult<TData, TVariables>(
  mutationResult: UseMutationResult<TData, Error, TVariables>
): StandardMutationResult<TData, TVariables> {
  return {
    ...getMutationState(mutationResult),
    data: mutationResult.data,
    mutate: mutationResult.mutate,
    mutateAsync: mutationResult.mutateAsync,
    reset: mutationResult.reset,
  };
}

/**
 * Error formatting utilities
 */
export const errorHelpers = {
  /**
   * Format error message for display
   */
  formatErrorMessage(error: Error | unknown): string {
    if (!error) return 'Unknown error occurred';

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error && 'message' in error) {
      return String((error as any).message);
    }

    return 'An unexpected error occurred';
  },

  /**
   * Extract error code from various error formats
   */
  getErrorCode(error: Error | unknown): string {
    if (!error) return 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      return error.name || 'UNKNOWN_ERROR';
    }

    if (typeof error === 'object' && error && 'code' in error) {
      return String((error as any).code);
    }

    return 'UNKNOWN_ERROR';
  },

  /**
   * Check if error is a network error
   */
  isNetworkError(error: Error | unknown): boolean {
    if (!error) return false;

    const errorMessage = this.formatErrorMessage(error).toLowerCase();
    const errorCode = this.getErrorCode(error).toLowerCase();

    return (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('connection') ||
      errorCode.includes('network') ||
      errorCode.includes('fetch')
    );
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError(error: Error | unknown): boolean {
    if (!error) return false;

    const errorMessage = this.formatErrorMessage(error).toLowerCase();
    const errorCode = this.getErrorCode(error).toLowerCase();

    return (
      errorMessage.includes('auth') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('forbidden') ||
      errorCode.includes('auth') ||
      errorCode === '401' ||
      errorCode === '403'
    );
  },

  /**
   * Check if error is retryable
   */
  isRetryableError(error: Error | unknown): boolean {
    if (!error) return true;

    // Don't retry auth errors
    if (this.isAuthError(error)) return false;

    // Retry network errors
    if (this.isNetworkError(error)) return true;

    // Check for specific error codes
    const errorCode = this.getErrorCode(error);
    const retryableStatusCodes = ['500', '502', '503', '504', 'TIMEOUT_ERROR'];

    return retryableStatusCodes.includes(errorCode);
  },
};

/**
 * Loading state utilities
 */
export const loadingHelpers = {
  /**
   * Check if any query is loading
   */
  isAnyLoading(...states: LoadingState[]): boolean {
    return states.some(state => state.isLoading);
  },

  /**
   * Check if any query is fetching
   */
  isAnyFetching(...states: LoadingState[]): boolean {
    return states.some(state => state.isFetching);
  },

  /**
   * Check if all queries are loading
   */
  areAllLoading(...states: LoadingState[]): boolean {
    return states.every(state => state.isLoading);
  },

  /**
   * Get combined loading state from multiple queries
   */
  getCombinedLoadingState(...states: LoadingState[]): LoadingState {
    return {
      isLoading: this.isAnyLoading(...states),
      isFetching: this.isAnyFetching(...states),
      isRefetching: states.some(state => state.isRefetching),
      isPending: states.some(state => state.isPending),
    };
  },
};

/**
 * Query retry configuration helpers
 */
export const retryHelpers = {
  /**
   * Default retry function that considers error type
   */
  defaultRetry: (failureCount: number, error: unknown) => {
    // Don't retry more than 3 times
    if (failureCount >= 3) return false;

    // Use error helpers to determine if error is retryable
    return errorHelpers.isRetryableError(error);
  },

  /**
   * Retry function for authentication queries
   */
  authRetry: (failureCount: number, error: unknown) => {
    // Don't retry auth errors at all
    if (errorHelpers.isAuthError(error)) return false;

    // Limited retries for other errors
    return failureCount < 2;
  },

  /**
   * Retry function for mutation operations
   */
  mutationRetry: (failureCount: number, error: unknown) => {
    // Don't retry auth errors
    if (errorHelpers.isAuthError(error)) return false;

    // Only retry network errors once
    if (errorHelpers.isNetworkError(error)) {
      return failureCount < 1;
    }

    return false;
  },
};

/**
 * React Query configuration presets
 */
export const queryConfigPresets = {
  /**
   * Configuration for user data queries
   */
  userData: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: retryHelpers.defaultRetry,
  },

  /**
   * Configuration for real-time data queries (like today's habit logs)
   */
  realtimeData: {
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: retryHelpers.defaultRetry,
  },

  /**
   * Configuration for authentication queries
   */
  authentication: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: retryHelpers.authRetry,
  },

  /**
   * Configuration for static data queries
   */
  staticData: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: retryHelpers.defaultRetry,
  },
};

/**
 * Mutation configuration presets
 */
export const mutationConfigPresets = {
  /**
   * Configuration for critical mutations (auth, etc.)
   */
  critical: {
    retry: 0, // No retry for critical operations
  },

  /**
   * Configuration for data mutations with offline support
   */
  withOfflineSupport: {
    retry: retryHelpers.mutationRetry,
    networkMode: 'offlineFirst' as const,
  },

  /**
   * Configuration for optimistic mutations
   */
  optimistic: {
    retry: retryHelpers.mutationRetry,
    networkMode: 'offlineFirst' as const,
  },
};
