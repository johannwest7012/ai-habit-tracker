/**
 * Query Helpers Tests
 * Unit tests for query helper utilities and error handling patterns
 */

import {
  getQueryState,
  getMutationState,
  createStandardQueryResult,
  createStandardMutationResult,
  errorHelpers,
  loadingHelpers,
  retryHelpers,
  queryConfigPresets,
  mutationConfigPresets,
} from '../queryHelpers';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { ApiResponse } from '@shared/types/api';

// Mock query result for testing
const createMockQueryResult = (
  overrides = {}
): UseQueryResult<ApiResponse<any>, Error> =>
  ({
    data: { success: true, data: { id: 1, name: 'test' }, message: 'Success' },
    error: null,
    isError: false,
    isLoading: false,
    isFetching: false,
    isRefetching: false,
    isSuccess: true,
    isStale: false,
    refetch: jest.fn(),
    status: 'success',
    fetchStatus: 'idle',
    ...overrides,
  }) as any;

// Mock mutation result for testing
const createMockMutationResult = (
  overrides = {}
): UseMutationResult<any, Error, any> =>
  ({
    data: { success: true, data: { id: 1 }, message: 'Success' },
    error: null,
    isError: false,
    isPending: false,
    isSuccess: true,
    isIdle: false,
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    reset: jest.fn(),
    status: 'success',
    ...overrides,
  }) as any;

describe('Query Helpers', () => {
  describe('getQueryState', () => {
    it('should extract query state correctly', () => {
      const mockResult = createMockQueryResult({
        isLoading: true,
        isFetching: true,
        isError: false,
        error: null,
      });

      const state = getQueryState(mockResult);

      expect(state.isLoading).toBe(true);
      expect(state.isFetching).toBe(true);
      expect(state.isError).toBe(false);
      expect(state.error).toBeNull();
      expect(state.errorCode).toBeUndefined();
      expect(state.errorMessage).toBeUndefined();
    });

    it('should extract error information correctly', () => {
      const error = new Error('Test error');
      error.name = 'TEST_ERROR';

      const mockResult = createMockQueryResult({
        isError: true,
        error,
      });

      const state = getQueryState(mockResult);

      expect(state.isError).toBe(true);
      expect(state.error).toBe(error);
      expect(state.errorCode).toBe('TEST_ERROR');
      expect(state.errorMessage).toBe('Test error');
    });
  });

  describe('getMutationState', () => {
    it('should extract mutation state correctly', () => {
      const mockResult = createMockMutationResult({
        isPending: true,
        isSuccess: false,
        isError: false,
      });

      const state = getMutationState(mockResult);

      expect(state.isPending).toBe(true);
      expect(state.isSuccess).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should extract error information correctly', () => {
      const error = new Error('Mutation failed');
      error.name = 'MUTATION_ERROR';

      const mockResult = createMockMutationResult({
        isError: true,
        error,
        isPending: false,
      });

      const state = getMutationState(mockResult);

      expect(state.isError).toBe(true);
      expect(state.error).toBe(error);
      expect(state.errorCode).toBe('MUTATION_ERROR');
      expect(state.errorMessage).toBe('Mutation failed');
    });
  });

  describe('createStandardQueryResult', () => {
    it('should create standard query result with successful data', () => {
      const mockResult = createMockQueryResult({
        data: {
          success: true,
          data: { id: 1, name: 'test' },
          message: 'Success',
        },
      });

      const standardResult = createStandardQueryResult(mockResult);

      expect(standardResult.data).toEqual({ id: 1, name: 'test' });
      expect(standardResult.isSuccess).toBe(true);
      expect(typeof standardResult.refetch).toBe('function');
    });

    it('should handle failed API response', () => {
      const mockResult = createMockQueryResult({
        data: {
          success: false,
          error: { code: 'API_ERROR', message: 'Failed' },
          message: 'Failed',
        },
      });

      const standardResult = createStandardQueryResult(mockResult);

      expect(standardResult.data).toBeUndefined();
    });
  });

  describe('errorHelpers', () => {
    describe('formatErrorMessage', () => {
      it('should format Error objects correctly', () => {
        const error = new Error('Test error message');
        const message = errorHelpers.formatErrorMessage(error);

        expect(message).toBe('Test error message');
      });

      it('should handle objects with message property', () => {
        const error = { message: 'Custom error message' };
        const message = errorHelpers.formatErrorMessage(error);

        expect(message).toBe('Custom error message');
      });

      it('should handle null/undefined errors', () => {
        expect(errorHelpers.formatErrorMessage(null)).toBe(
          'Unknown error occurred'
        );
        expect(errorHelpers.formatErrorMessage(undefined)).toBe(
          'Unknown error occurred'
        );
      });

      it('should handle unknown error types', () => {
        const message = errorHelpers.formatErrorMessage('string error');
        expect(message).toBe('An unexpected error occurred');
      });
    });

    describe('getErrorCode', () => {
      it('should extract error code from Error name', () => {
        const error = new Error('Test');
        error.name = 'TEST_ERROR';

        expect(errorHelpers.getErrorCode(error)).toBe('TEST_ERROR');
      });

      it('should extract error code from object', () => {
        const error = { code: 'CUSTOM_ERROR' };
        expect(errorHelpers.getErrorCode(error)).toBe('CUSTOM_ERROR');
      });

      it('should return default for unknown errors', () => {
        expect(errorHelpers.getErrorCode(null)).toBe('UNKNOWN_ERROR');
        expect(errorHelpers.getErrorCode('string')).toBe('UNKNOWN_ERROR');
      });
    });

    describe('isNetworkError', () => {
      it('should detect network errors by message', () => {
        const error1 = new Error('Network request failed');
        const error2 = new Error('Fetch failed');
        const error3 = new Error('Connection error');

        expect(errorHelpers.isNetworkError(error1)).toBe(true);
        expect(errorHelpers.isNetworkError(error2)).toBe(true);
        expect(errorHelpers.isNetworkError(error3)).toBe(true);
      });

      it('should detect network errors by code', () => {
        const error = new Error('Request failed');
        error.name = 'NETWORK_ERROR';

        expect(errorHelpers.isNetworkError(error)).toBe(true);
      });

      it('should not detect non-network errors', () => {
        const error = new Error('Validation failed');
        expect(errorHelpers.isNetworkError(error)).toBe(false);
      });
    });

    describe('isAuthError', () => {
      it('should detect auth errors by message', () => {
        const error1 = new Error('Unauthorized access');
        const error2 = new Error('Authentication failed');
        const error3 = new Error('Forbidden resource');

        expect(errorHelpers.isAuthError(error1)).toBe(true);
        expect(errorHelpers.isAuthError(error2)).toBe(true);
        expect(errorHelpers.isAuthError(error3)).toBe(true);
      });

      it('should detect auth errors by status code', () => {
        const error1 = new Error('Request failed');
        error1.name = '401';
        const error2 = new Error('Request failed');
        error2.name = '403';

        expect(errorHelpers.isAuthError(error1)).toBe(true);
        expect(errorHelpers.isAuthError(error2)).toBe(true);
      });

      it('should not detect non-auth errors', () => {
        const error = new Error('Validation failed');
        expect(errorHelpers.isAuthError(error)).toBe(false);
      });
    });

    describe('isRetryableError', () => {
      it('should not retry auth errors', () => {
        const error = new Error('Unauthorized');
        expect(errorHelpers.isRetryableError(error)).toBe(false);
      });

      it('should retry network errors', () => {
        const error = new Error('Network failed');
        expect(errorHelpers.isRetryableError(error)).toBe(true);
      });

      it('should retry server errors', () => {
        const error1 = new Error('Server error');
        error1.name = '500';
        const error2 = new Error('Bad gateway');
        error2.name = '502';

        expect(errorHelpers.isRetryableError(error1)).toBe(true);
        expect(errorHelpers.isRetryableError(error2)).toBe(true);
      });

      it('should retry timeout errors', () => {
        const error = new Error('Request timeout');
        error.name = 'TIMEOUT_ERROR';

        expect(errorHelpers.isRetryableError(error)).toBe(true);
      });
    });
  });

  describe('loadingHelpers', () => {
    const loadingState1 = {
      isLoading: true,
      isFetching: false,
      isRefetching: false,
    };
    const loadingState2 = {
      isLoading: false,
      isFetching: true,
      isRefetching: false,
    };
    const idleState = {
      isLoading: false,
      isFetching: false,
      isRefetching: false,
    };

    describe('isAnyLoading', () => {
      it('should return true if any state is loading', () => {
        expect(loadingHelpers.isAnyLoading(loadingState1, idleState)).toBe(
          true
        );
        expect(loadingHelpers.isAnyLoading(idleState, idleState)).toBe(false);
      });
    });

    describe('isAnyFetching', () => {
      it('should return true if any state is fetching', () => {
        expect(loadingHelpers.isAnyFetching(loadingState2, idleState)).toBe(
          true
        );
        expect(loadingHelpers.isAnyFetching(idleState, idleState)).toBe(false);
      });
    });

    describe('areAllLoading', () => {
      it('should return true only if all states are loading', () => {
        expect(loadingHelpers.areAllLoading(loadingState1, loadingState1)).toBe(
          true
        );
        expect(loadingHelpers.areAllLoading(loadingState1, idleState)).toBe(
          false
        );
      });
    });

    describe('getCombinedLoadingState', () => {
      it('should combine loading states correctly', () => {
        const combined = loadingHelpers.getCombinedLoadingState(
          loadingState1,
          loadingState2
        );

        expect(combined.isLoading).toBe(true); // Any loading
        expect(combined.isFetching).toBe(true); // Any fetching
        expect(combined.isRefetching).toBe(false); // None refetching
      });
    });
  });

  describe('retryHelpers', () => {
    describe('defaultRetry', () => {
      it('should not retry after 3 failures', () => {
        expect(retryHelpers.defaultRetry(3, new Error('Test'))).toBe(false);
        expect(retryHelpers.defaultRetry(4, new Error('Test'))).toBe(false);
      });

      it('should not retry non-retryable errors', () => {
        const authError = new Error('Unauthorized');
        expect(retryHelpers.defaultRetry(1, authError)).toBe(false);
      });

      it('should retry retryable errors within limit', () => {
        const networkError = new Error('Network failed');
        expect(retryHelpers.defaultRetry(1, networkError)).toBe(true);
        expect(retryHelpers.defaultRetry(2, networkError)).toBe(true);
      });
    });

    describe('authRetry', () => {
      it('should never retry auth errors', () => {
        const authError = new Error('Unauthorized');
        expect(retryHelpers.authRetry(0, authError)).toBe(false);
        expect(retryHelpers.authRetry(1, authError)).toBe(false);
      });

      it('should retry other errors with lower limit', () => {
        const networkError = new Error('Network failed');
        expect(retryHelpers.authRetry(1, networkError)).toBe(true);
        expect(retryHelpers.authRetry(2, networkError)).toBe(false);
      });
    });

    describe('mutationRetry', () => {
      it('should not retry auth errors', () => {
        const authError = new Error('Unauthorized');
        expect(retryHelpers.mutationRetry(0, authError)).toBe(false);
      });

      it('should retry network errors once', () => {
        const networkError = new Error('Network failed');
        expect(retryHelpers.mutationRetry(0, networkError)).toBe(true);
        expect(retryHelpers.mutationRetry(1, networkError)).toBe(false);
      });

      it('should not retry non-network errors', () => {
        const validationError = new Error('Validation failed');
        expect(retryHelpers.mutationRetry(0, validationError)).toBe(false);
      });
    });
  });

  describe('Configuration Presets', () => {
    describe('queryConfigPresets', () => {
      it('should have userData configuration', () => {
        const config = queryConfigPresets.userData;

        expect(config.staleTime).toBe(5 * 60 * 1000);
        expect(config.refetchOnWindowFocus).toBe(true);
        expect(config.retry).toBe(retryHelpers.defaultRetry);
      });

      it('should have realtimeData configuration', () => {
        const config = queryConfigPresets.realtimeData;

        expect(config.staleTime).toBe(1 * 60 * 1000);
        expect(config.refetchInterval).toBe(5 * 60 * 1000);
      });

      it('should have authentication configuration', () => {
        const config = queryConfigPresets.authentication;

        expect(config.staleTime).toBe(10 * 60 * 1000);
        expect(config.refetchOnWindowFocus).toBe(false);
        expect(config.retry).toBe(retryHelpers.authRetry);
      });

      it('should have staticData configuration', () => {
        const config = queryConfigPresets.staticData;

        expect(config.staleTime).toBe(30 * 60 * 1000);
        expect(config.refetchOnWindowFocus).toBe(false);
        expect(config.refetchOnReconnect).toBe(false);
      });
    });

    describe('mutationConfigPresets', () => {
      it('should have critical configuration', () => {
        const config = mutationConfigPresets.critical;
        expect(config.retry).toBe(0);
      });

      it('should have withOfflineSupport configuration', () => {
        const config = mutationConfigPresets.withOfflineSupport;

        expect(config.retry).toBe(retryHelpers.mutationRetry);
        expect(config.networkMode).toBe('offlineFirst');
      });

      it('should have optimistic configuration', () => {
        const config = mutationConfigPresets.optimistic;

        expect(config.retry).toBe(retryHelpers.mutationRetry);
        expect(config.networkMode).toBe('offlineFirst');
      });
    });
  });
});
