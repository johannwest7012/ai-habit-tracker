/**
 * Tests for Supabase Client Service
 * @jest-environment node
 */

/* eslint-env jest */

// Mock process.env directly (this is what the Proxy reads)
const originalEnv = process.env;
beforeAll(() => {
  process.env = {
    ...originalEnv,
    EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
    EXPO_PUBLIC_ENVIRONMENT: 'test',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Mock the Supabase module
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@supabase/supabase-js';
import {
  createSupabaseConfig,
  getSupabaseClient,
  resetSupabaseClient,
  checkSupabaseHealth,
  getSupabaseClientSafe,
} from '../api/supabaseClient';
import type { SupabaseConnectionError } from '@shared/types/api';

// Type the mocked createClient
const mockCreateClient = jest.mocked(createClient);

// Create a mock Supabase client with only the methods we need for testing
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
  },
};

describe('Supabase Client Service', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    resetSupabaseClient();

    // Reset global.setTimeout mock
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createSupabaseConfig', () => {
    it('should create proper Supabase configuration from environment', () => {
      const config = createSupabaseConfig();

      expect(config).toEqual({
        url: 'https://test-project.supabase.co',
        anonKey: 'test-anon-key',
        options: expect.objectContaining({
          auth: expect.objectContaining({
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          }),
          realtime: {
            params: {
              eventsPerSecond: 10,
            },
          },
        }),
      });
    });

    it('should use environment config values', () => {
      const config = createSupabaseConfig();

      expect(config.url).toBe('https://test-project.supabase.co');
      expect(config.anonKey).toBe('test-anon-key');
    });

    it('should have React Native optimized settings', () => {
      const config = createSupabaseConfig();

      expect(config.options?.auth?.detectSessionInUrl).toBe(false);
      expect(config.options?.auth?.persistSession).toBe(true);
    });
  });

  describe('getSupabaseClient', () => {
    it('should initialize and return Supabase client', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);

      const client = getSupabaseClient();

      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test-project.supabase.co',
        'test-anon-key',
        expect.objectContaining({
          auth: expect.objectContaining({
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
          }),
        })
      );
      expect(client).toBe(mockSupabaseClient);
    });

    it('should return same instance on subsequent calls (singleton)', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);

      const client1 = getSupabaseClient();
      const client2 = getSupabaseClient();

      expect(client1).toBe(client2);
      expect(mockCreateClient).toHaveBeenCalledTimes(1);
    });

    it('should throw SupabaseConnectionError on initialization failure', () => {
      const initError = new Error('Network error');
      mockCreateClient.mockImplementation(() => {
        throw initError;
      });

      expect(() => getSupabaseClient()).toThrow();

      try {
        getSupabaseClient();
      } catch (error) {
        const connectionError = error as SupabaseConnectionError;
        expect(connectionError.type).toBe('UNKNOWN_ERROR');
        expect(connectionError.message).toBe(
          'Failed to initialize Supabase client'
        );
        expect(connectionError.originalError).toBe(initError);
        expect(connectionError.timestamp).toBeDefined();
      }
    });
  });

  describe('resetSupabaseClient', () => {
    it('should reset client instance for fresh initialization', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);

      // Get client instance
      const client1 = getSupabaseClient();
      expect(mockCreateClient).toHaveBeenCalledTimes(1);

      // Reset and get new instance
      resetSupabaseClient();
      const client2 = getSupabaseClient();

      expect(mockCreateClient).toHaveBeenCalledTimes(2);
      expect(client1).toBe(client2); // Same mock object, but new instance
    });
  });

  describe('checkSupabaseHealth', () => {
    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
    });

    it('should return healthy status when connection succeeds', async () => {
      const healthPromise = checkSupabaseHealth(1000);

      // Fast-forward timers but don't trigger timeout
      jest.advanceTimersByTime(500);

      const result = await healthPromise;

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('healthy');
      expect(result.data?.responseTime).toBeDefined();
      expect(result.data?.timestamp).toBeDefined();
      expect(result.message).toBe('Supabase connection is healthy');
    });

    it('should return unhealthy status on timeout', async () => {
      // Make getSession hang
      mockSupabaseClient.auth.getSession.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const healthPromise = checkSupabaseHealth(1000);

      // Fast-forward past timeout
      jest.advanceTimersByTime(1500);

      const result = await healthPromise;

      expect(result.success).toBe(false);
      expect(result.data?.status).toBe('unhealthy');
      expect(result.data?.error).toContain('timed out');
      expect(result.error?.code).toBe('TIMEOUT_ERROR');
    });

    it('should handle network errors properly', async () => {
      const networkError = new Error('Network connection failed');
      mockSupabaseClient.auth.getSession.mockRejectedValue(networkError);

      const result = await checkSupabaseHealth(1000);

      expect(result.success).toBe(false);
      expect(result.data?.status).toBe('unhealthy');
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toBe('Network connection failed');
    });

    it('should handle auth errors properly', async () => {
      const authError = new Error('Unauthorized access');
      mockSupabaseClient.auth.getSession.mockRejectedValue(authError);

      const result = await checkSupabaseHealth(1000);

      expect(result.success).toBe(false);
      expect(result.data?.status).toBe('unhealthy');
      expect(result.error?.code).toBe('AUTH_ERROR');
      expect(result.error?.message).toBe('Unauthorized access');
    });

    it('should handle unknown errors properly', async () => {
      const unknownError = 'Some string error';
      mockSupabaseClient.auth.getSession.mockRejectedValue(unknownError);

      const result = await checkSupabaseHealth(1000);

      expect(result.success).toBe(false);
      expect(result.data?.status).toBe('unhealthy');
      expect(result.error?.code).toBe('UNKNOWN_ERROR');
      expect(result.error?.message).toBe(
        'Unknown error occurred during health check'
      );
    });

    it('should use custom timeout value', async () => {
      mockSupabaseClient.auth.getSession.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const customTimeout = 2000;
      const healthPromise = checkSupabaseHealth(customTimeout);

      // Fast-forward just under timeout
      jest.advanceTimersByTime(1900);

      // Promise should still be pending
      const isStillPending = await Promise.race([
        healthPromise.then(() => false),
        Promise.resolve(true),
      ]);
      expect(isStillPending).toBe(true);

      // Fast-forward past custom timeout
      jest.advanceTimersByTime(200);

      const result = await healthPromise;
      expect(result.data?.error).toContain(
        `timed out after ${customTimeout}ms`
      );
    });
  });

  describe('getSupabaseClientSafe', () => {
    it('should return success response with client when initialization succeeds', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);

      const result = await getSupabaseClientSafe();

      expect(result.success).toBe(true);
      expect(result.data).toBe(mockSupabaseClient);
      expect(result.message).toBe('Supabase client initialized successfully');
    });

    it('should return error response when initialization fails', async () => {
      const initError = new Error('Init failed');
      mockCreateClient.mockImplementation(() => {
        throw initError;
      });

      const result = await getSupabaseClientSafe();

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error?.code).toBe('UNKNOWN_ERROR');
      expect(result.error?.message).toBe(
        'Failed to initialize Supabase client'
      );
      expect(result.message).toBe('Failed to initialize Supabase client');
    });
  });

  describe('Error Handling', () => {
    it('should log initialization errors for debugging', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const initError = new Error('Init failed');
      mockCreateClient.mockImplementation(() => {
        throw initError;
      });

      try {
        getSupabaseClient();
      } catch {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        'Supabase client initialization failed:',
        expect.objectContaining({
          type: 'UNKNOWN_ERROR',
          message: 'Failed to initialize Supabase client',
          originalError: initError,
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log health check errors for debugging', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockCreateClient.mockReturnValue(mockSupabaseClient as any);

      const healthError = new Error('Health check failed');
      mockSupabaseClient.auth.getSession.mockRejectedValue(healthError);

      await checkSupabaseHealth(1000);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Supabase health check failed:',
        expect.objectContaining({
          type: 'UNKNOWN_ERROR',
          message: 'Health check failed',
          originalError: healthError,
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types for configuration', () => {
      const config = createSupabaseConfig();

      // These should compile without TypeScript errors
      expect(typeof config.url).toBe('string');
      expect(typeof config.anonKey).toBe('string');
      expect(typeof config.options?.auth?.autoRefreshToken).toBe('boolean');
    });

    it('should handle connection error types correctly', () => {
      const error: SupabaseConnectionError = {
        type: 'NETWORK_ERROR',
        message: 'Test error',
        timestamp: new Date().toISOString(),
      };

      // Should compile with proper types
      expect(error.type).toBe('NETWORK_ERROR');
      expect(typeof error.message).toBe('string');
      expect(typeof error.timestamp).toBe('string');
    });
  });
});
