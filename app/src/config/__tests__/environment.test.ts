/**
 * Tests for environment configuration module
 * @jest-environment node
 */

/* eslint-env jest */

import { getEnvironmentConfig, resetEnvironmentConfig } from '../environment';

describe('Environment Configuration', () => {
  // Store original environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset the cached config for fresh test
    resetEnvironmentConfig();
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = { ...originalEnv };
    // Reset the cached config for next test
    resetEnvironmentConfig();
  });

  describe('getEnvironmentConfig', () => {
    it('should load configuration with valid environment variables', () => {
      // Pass test environment variables directly
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        EXPO_PUBLIC_ENVIRONMENT: 'development',
      };

      const config = getEnvironmentConfig(testEnv);

      expect(config.supabaseUrl).toBe('https://test-project.supabase.co');
      expect(config.supabaseAnonKey).toBe('test-anon-key');
      expect(config.environment).toBe('development');
      expect(config.isDevelopment).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.isTest).toBe(false);
    });

    it('should default to development environment when not specified', () => {
      // Pass test environment variables without environment
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      };

      const config = getEnvironmentConfig(testEnv);

      expect(config.environment).toBe('development');
      expect(config.isDevelopment).toBe(true);
    });

    it('should set correct flags for production environment', () => {
      // Pass production environment variables
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://prod-project.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'prod-anon-key',
        EXPO_PUBLIC_ENVIRONMENT: 'production',
      };

      const config = getEnvironmentConfig(testEnv);

      expect(config.environment).toBe('production');
      expect(config.isDevelopment).toBe(false);
      expect(config.isProduction).toBe(true);
      expect(config.isTest).toBe(false);
    });

    it('should set correct flags for test environment', () => {
      // Pass test environment variables
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        EXPO_PUBLIC_ENVIRONMENT: 'test',
      };

      const config = getEnvironmentConfig(testEnv);

      expect(config.environment).toBe('test');
      expect(config.isDevelopment).toBe(false);
      expect(config.isProduction).toBe(false);
      expect(config.isTest).toBe(true);
    });

    it('should throw error when EXPO_PUBLIC_SUPABASE_URL is missing', () => {
      // Only set ANON_KEY, leaving URL missing
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      };

      expect(() => getEnvironmentConfig(testEnv)).toThrow(
        'EXPO_PUBLIC_SUPABASE_URL environment variable is required'
      );
    });

    it('should throw error when EXPO_PUBLIC_SUPABASE_ANON_KEY is missing', () => {
      // Only set URL, leaving ANON_KEY missing
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
      };

      expect(() => getEnvironmentConfig(testEnv)).toThrow(
        'EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable is required'
      );
    });

    it('should throw error when both required variables are missing', () => {
      // Pass empty environment
      const testEnv = {};

      expect(() => getEnvironmentConfig(testEnv)).toThrow(
        'EXPO_PUBLIC_SUPABASE_URL environment variable is required'
      );
    });
  });

  describe('EnvironmentConfig interface', () => {
    it('should have correct TypeScript interface structure', () => {
      // Pass valid environment
      const testEnv = {
        EXPO_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
        EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
        EXPO_PUBLIC_ENVIRONMENT: 'development',
      };

      const config = getEnvironmentConfig(testEnv);

      // Test interface properties exist and have correct types
      expect(typeof config.supabaseUrl).toBe('string');
      expect(typeof config.supabaseAnonKey).toBe('string');
      expect(typeof config.environment).toBe('string');
      expect(typeof config.isDevelopment).toBe('boolean');
      expect(typeof config.isProduction).toBe('boolean');
      expect(typeof config.isTest).toBe('boolean');

      // Test environment is one of allowed values
      expect(['development', 'production', 'test']).toContain(
        config.environment
      );
    });
  });
});
