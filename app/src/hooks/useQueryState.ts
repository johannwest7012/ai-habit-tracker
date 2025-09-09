/**
 * Query State Management Hook
 * Standardized error and loading state patterns for consistent UI handling
 * Following error and loading state patterns per story requirements
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import type { ApiResponse } from '@shared/types/api';
import {
  getQueryState,
  getMutationState,
  createStandardQueryResult,
  createStandardMutationResult,
  errorHelpers,
  loadingHelpers,
  type StandardQueryResult,
  type StandardMutationResult,
  type QueryState,
  type MutationState,
} from '../utils/queryHelpers';

/**
 * Enhanced query hook with standardized state management
 */
export function useStandardQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>, Error>, 'queryKey' | 'queryFn'>
): StandardQueryResult<T> {
  const queryResult = useQuery({
    queryKey,
    queryFn,
    ...options,
  });

  return createStandardQueryResult(queryResult);
}

/**
 * Enhanced mutation hook with standardized state management
 */
export function useStandardMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
): StandardMutationResult<TData, TVariables> {
  const mutationResult = useMutation({
    mutationFn,
    ...options,
  });

  return createStandardMutationResult(mutationResult);
}

/**
 * Hook for managing multiple query states
 */
export function useMultipleQueryStates(
  ...queryResults: UseQueryResult<any, Error>[]
): {
  combined: QueryState;
  individual: QueryState[];
  hasAnyError: boolean;
  hasAllErrors: boolean;
  isAnyLoading: boolean;
  areAllLoading: boolean;
  errorMessages: string[];
  firstError: Error | null;
} {
  const individual = queryResults.map(result => getQueryState(result));

  const combined: QueryState = {
    isLoading: loadingHelpers.isAnyLoading(...individual),
    isFetching: loadingHelpers.isAnyFetching(...individual),
    isRefetching: individual.some(state => state.isRefetching),
    isError: individual.some(state => state.isError),
    error: individual.find(state => state.error)?.error || null,
    errorCode: individual.find(state => state.errorCode)?.errorCode,
    errorMessage: individual.find(state => state.errorMessage)?.errorMessage,
    isSuccess: individual.every(state => state.isSuccess),
    isStale: individual.some(state => state.isStale),
  };

  const hasAnyError = individual.some(state => state.isError);
  const hasAllErrors = individual.every(state => state.isError);
  const isAnyLoading = loadingHelpers.isAnyLoading(...individual);
  const areAllLoading = loadingHelpers.areAllLoading(...individual);

  const errorMessages = individual
    .filter(state => state.error)
    .map(state => errorHelpers.formatErrorMessage(state.error));

  const firstError = individual.find(state => state.error)?.error || null;

  return {
    combined,
    individual,
    hasAnyError,
    hasAllErrors,
    isAnyLoading,
    areAllLoading,
    errorMessages,
    firstError,
  };
}

/**
 * Hook for managing multiple mutation states
 */
export function useMultipleMutationStates(
  ...mutationResults: UseMutationResult<any, Error, any>[]
): {
  combined: MutationState;
  individual: MutationState[];
  hasAnyError: boolean;
  hasAllErrors: boolean;
  isAnyPending: boolean;
  areAllPending: boolean;
  isAnySuccess: boolean;
  areAllSuccess: boolean;
  errorMessages: string[];
  firstError: Error | null;
} {
  const individual = mutationResults.map(result => getMutationState(result));

  const combined: MutationState = {
    isPending: individual.some(state => state.isPending),
    isError: individual.some(state => state.isError),
    error: individual.find(state => state.error)?.error || null,
    errorCode: individual.find(state => state.errorCode)?.errorCode,
    errorMessage: individual.find(state => state.errorMessage)?.errorMessage,
    isSuccess: individual.every(state => state.isSuccess),
    isIdle: individual.every(state => state.isIdle),
  };

  const hasAnyError = individual.some(state => state.isError);
  const hasAllErrors = individual.every(state => state.isError);
  const isAnyPending = individual.some(state => state.isPending);
  const areAllPending = individual.every(state => state.isPending);
  const isAnySuccess = individual.some(state => state.isSuccess);
  const areAllSuccess = individual.every(state => state.isSuccess);

  const errorMessages = individual
    .filter(state => state.error)
    .map(state => errorHelpers.formatErrorMessage(state.error));

  const firstError = individual.find(state => state.error)?.error || null;

  return {
    combined,
    individual,
    hasAnyError,
    hasAllErrors,
    isAnyPending,
    areAllPending,
    isAnySuccess,
    areAllSuccess,
    errorMessages,
    firstError,
  };
}

/**
 * Hook for error handling patterns
 */
export function useErrorHandler() {
  return {
    /**
     * Format error for user display
     */
    formatError: (error: Error | unknown): string => {
      return errorHelpers.formatErrorMessage(error);
    },

    /**
     * Get user-friendly error message
     */
    getUserFriendlyError: (error: Error | unknown): string => {
      const message = errorHelpers.formatErrorMessage(error);
      const code = errorHelpers.getErrorCode(error);

      // Map common error codes to user-friendly messages
      if (errorHelpers.isNetworkError(error)) {
        return 'Please check your internet connection and try again.';
      }

      if (errorHelpers.isAuthError(error)) {
        return 'Please sign in again to continue.';
      }

      switch (code) {
        case 'TIMEOUT_ERROR':
          return 'The request took too long. Please try again.';
        case 'RATE_LIMIT_ERROR':
          return 'Too many requests. Please wait a moment and try again.';
        default:
          return message || 'Something went wrong. Please try again.';
      }
    },

    /**
     * Check if error should trigger re-authentication
     */
    shouldReauth: (error: Error | unknown): boolean => {
      return errorHelpers.isAuthError(error);
    },

    /**
     * Check if error is retryable
     */
    isRetryable: (error: Error | unknown): boolean => {
      return errorHelpers.isRetryableError(error);
    },
  };
}

/**
 * Hook for loading state management
 */
export function useLoadingStates() {
  return {
    /**
     * Get loading overlay state
     */
    getOverlayState: (isLoading: boolean, message?: string) => ({
      visible: isLoading,
      message: message || 'Loading...',
    }),

    /**
     * Get button loading state
     */
    getButtonState: (
      isPending: boolean,
      defaultText: string,
      loadingText?: string
    ) => ({
      loading: isPending,
      disabled: isPending,
      text: isPending ? loadingText || 'Loading...' : defaultText,
    }),

    /**
     * Get form loading state
     */
    getFormState: (isPending: boolean) => ({
      disabled: isPending,
      showSpinner: isPending,
    }),

    /**
     * Get refresh state
     */
    getRefreshState: (isRefetching: boolean) => ({
      refreshing: isRefetching,
    }),
  };
}

/**
 * Hook for consistent loading and error patterns across components
 */
export function useAsyncState<T>(
  queryResult?: UseQueryResult<ApiResponse<T>, Error>,
  mutationResult?: UseMutationResult<any, Error, any>
) {
  const errorHandler = useErrorHandler();
  const loadingStates = useLoadingStates();

  // Combine query and mutation states
  const isLoading = queryResult?.isLoading || false;
  const isFetching = queryResult?.isFetching || false;
  const isPending = mutationResult?.isPending || false;
  const isError = queryResult?.isError || mutationResult?.isError || false;
  const error = queryResult?.error || mutationResult?.error || null;

  return {
    // State flags
    isLoading,
    isFetching,
    isPending,
    isError,
    isSuccess:
      (queryResult?.isSuccess || false) && mutationResult?.isSuccess !== false,

    // Data
    data: queryResult?.data?.success ? queryResult.data.data : undefined,
    error,

    // Error handling
    errorMessage: error ? errorHandler.formatError(error) : null,
    userFriendlyError: error ? errorHandler.getUserFriendlyError(error) : null,
    shouldReauth: error ? errorHandler.shouldReauth(error) : false,
    isRetryableError: error ? errorHandler.isRetryable(error) : false,

    // Loading states for UI components
    overlayState: loadingStates.getOverlayState(isLoading || isPending),
    refreshState: loadingStates.getRefreshState(isFetching),

    // Actions
    refetch: queryResult?.refetch || (() => {}),
    reset: mutationResult?.reset || (() => {}),
  };
}
