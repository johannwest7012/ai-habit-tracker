/**
 * Query Client Service Tests
 * Unit tests for React Query client configuration and functionality
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createQueryClient,
  getQueryClient,
  resetQueryClient,
  setupQueryPersistence,
  clearQueryCache,
  invalidateQueries,
  getQueryClientSafe,
} from '../api/queryClient';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('Query Client Service', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Reset query client singleton
    resetQueryClient();
  });

  afterEach(() => {
    // Clean up after each test
    resetQueryClient();
  });

  describe('createQueryClient', () => {
    it('should create a new QueryClient instance', () => {
      const client = createQueryClient();

      expect(client).toBeDefined();
      expect(client.getQueryCache).toBeDefined();
      expect(client.getMutationCache).toBeDefined();
    });

    it('should return the same instance when called multiple times (singleton)', () => {
      const client1 = createQueryClient();
      const client2 = createQueryClient();

      expect(client1).toBe(client2);
    });

    it('should configure default query options correctly', () => {
      const client = createQueryClient();
      const defaultOptions = client.getDefaultOptions();

      expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5 minutes
      expect(defaultOptions.queries?.gcTime).toBe(30 * 60 * 1000); // 30 minutes
      expect(defaultOptions.queries?.retry).toBe(3);
      expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(true);
      expect(defaultOptions.queries?.refetchOnReconnect).toBe(true);
      expect(defaultOptions.queries?.networkMode).toBe('offlineFirst');
    });

    it('should configure default mutation options correctly', () => {
      const client = createQueryClient();
      const defaultOptions = client.getDefaultOptions();

      expect(defaultOptions.mutations?.retry).toBe(1);
      expect(defaultOptions.mutations?.networkMode).toBe('offlineFirst');
    });
  });

  describe('getQueryClient', () => {
    it('should create client if none exists', () => {
      const client = getQueryClient();

      expect(client).toBeDefined();
    });

    it('should return existing client if already created', () => {
      const client1 = createQueryClient();
      const client2 = getQueryClient();

      expect(client1).toBe(client2);
    });
  });

  describe('resetQueryClient', () => {
    it('should clear and reset the query client', () => {
      const client = createQueryClient();
      const clearSpy = jest.spyOn(client, 'clear');

      resetQueryClient();

      expect(clearSpy).toHaveBeenCalled();

      // Getting client after reset should create a new instance
      const newClient = getQueryClient();
      expect(newClient).not.toBe(client);
    });
  });

  describe('setupQueryPersistence', () => {
    it('should handle AsyncStorage errors gracefully', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      // Should not throw, but log error
      await expect(setupQueryPersistence()).resolves.not.toThrow();
    });
  });

  describe('clearQueryCache', () => {
    it('should clear query cache and AsyncStorage', async () => {
      mockAsyncStorage.removeItem.mockResolvedValue();
      const client = createQueryClient();
      const clearSpy = jest.spyOn(client, 'clear');

      await clearQueryCache();

      expect(clearSpy).toHaveBeenCalled();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@react-query-cache'
      );
    });

    it('should throw error when clearing fails', async () => {
      const error = new Error('Clear failed');
      mockAsyncStorage.removeItem.mockRejectedValue(error);

      await expect(clearQueryCache()).rejects.toThrow('Clear failed');
    });
  });

  describe('invalidateQueries', () => {
    it('should invalidate queries by pattern', async () => {
      const client = createQueryClient();
      const invalidateQueriesSpy = jest.spyOn(client, 'invalidateQueries');

      const queryPattern = ['habits', 'goals'];
      await invalidateQueries(queryPattern);

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: queryPattern,
      });
    });

    it('should throw error when invalidation fails', async () => {
      const client = createQueryClient();
      const error = new Error('Invalidation failed');
      jest.spyOn(client, 'invalidateQueries').mockRejectedValue(error);

      await expect(invalidateQueries(['test'])).rejects.toThrow(
        'Invalidation failed'
      );
    });
  });

  describe('getQueryClientSafe', () => {
    it('should return successful response with client', async () => {
      const response = await getQueryClientSafe();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.message).toBe('Query client initialized successfully');
    });
  });

  describe('Query Client Configuration', () => {
    beforeEach(() => {
      // Ensure we have a fresh client for configuration tests
      resetQueryClient();
      jest.clearAllMocks();
    });

    it('should have proper error handling for mutations', () => {
      const client = createQueryClient();

      // Test that mutation defaults are set
      const mutationCache = client.getMutationCache();
      expect(mutationCache).toBeDefined();
    });

    it('should handle network mode correctly', () => {
      const client = createQueryClient();
      const defaultOptions = client.getDefaultOptions();

      expect(defaultOptions.queries?.networkMode).toBe('offlineFirst');
      expect(defaultOptions.mutations?.networkMode).toBe('offlineFirst');
    });
  });
});
