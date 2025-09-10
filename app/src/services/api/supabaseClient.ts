/**
 * Supabase Client Service
 * Handles Supabase client initialization and configuration
 * Following service layer pattern per coding standards
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config/environment';
import type {
  SupabaseConfig,
  SupabaseConnectionError,
  SupabaseHealthCheck,
  ApiResponse,
  HealthCheckResponse,
} from '@shared/types/api';

/**
 * Supabase client instance - initialized lazily
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Create Supabase client configuration from environment
 * @returns SupabaseConfig object with proper typing
 */
export function createSupabaseConfig(): SupabaseConfig {
  return {
    url: config.supabaseUrl,
    anonKey: config.supabaseAnonKey,
    options: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Disable for React Native
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    },
  };
}

/**
 * Initialize and return Supabase client
 * Implements singleton pattern with lazy initialization
 * @returns SupabaseClient instance
 * @throws SupabaseConnectionError on initialization failure
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  try {
    const supabaseConfig = createSupabaseConfig();

    supabaseClient = createClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      supabaseConfig.options
    );

    return supabaseClient;
  } catch (error) {
    const connectionError: SupabaseConnectionError = {
      type: 'UNKNOWN_ERROR',
      message: 'Failed to initialize Supabase client',
      originalError: error,
      timestamp: new Date().toISOString(),
    };

    // Log error for debugging
    console.error('Supabase client initialization failed:', connectionError);

    throw connectionError;
  }
}

/**
 * Reset Supabase client instance (for testing purposes)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}

/**
 * Test Supabase connection with health check
 * @param timeoutMs - Connection timeout in milliseconds (default: 5000)
 * @returns Promise<HealthCheckResponse> with connection status
 */
export async function checkSupabaseHealth(
  timeoutMs: number = 5000
): Promise<HealthCheckResponse> {
  const startTime = Date.now();

  try {
    const client = getSupabaseClient();

    // Create timeout promise using Promise constructor
    const timeoutPromise = new Promise<never>((_, reject) => {
      global.setTimeout(() => {
        const error: SupabaseConnectionError = {
          type: 'TIMEOUT_ERROR',
          message: `Health check timed out after ${timeoutMs}ms`,
          timestamp: new Date().toISOString(),
        };
        reject(error);
      }, timeoutMs);
    });

    // Perform simple connection test - try to get session info
    const healthCheckPromise = client.auth.getSession();

    // Race between health check and timeout
    await Promise.race([healthCheckPromise, timeoutPromise]);

    const responseTime = Date.now() - startTime;

    const healthCheck: SupabaseHealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime,
    };

    return {
      success: true,
      data: healthCheck,
      message: 'Supabase connection is healthy',
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Handle different error types
    let connectionError: SupabaseConnectionError;

    if (error && typeof error === 'object' && 'type' in error) {
      // Already a SupabaseConnectionError
      connectionError = error as SupabaseConnectionError;
    } else if (error instanceof Error) {
      // Determine error type based on message
      const errorMessage = error.message.toLowerCase();

      let errorType: SupabaseConnectionError['type'] = 'UNKNOWN_ERROR';
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorType = 'NETWORK_ERROR';
      } else if (
        errorMessage.includes('auth') ||
        errorMessage.includes('unauthorized')
      ) {
        errorType = 'AUTH_ERROR';
      } else if (errorMessage.includes('timeout')) {
        errorType = 'TIMEOUT_ERROR';
      }

      connectionError = {
        type: errorType,
        message: error.message,
        originalError: error,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Unknown error type
      connectionError = {
        type: 'UNKNOWN_ERROR',
        message: 'Unknown error occurred during health check',
        originalError: error,
        timestamp: new Date().toISOString(),
      };
    }

    const healthCheck: SupabaseHealthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime,
      error: connectionError.message,
    };

    // Log error for debugging
    console.error('Supabase health check failed:', connectionError);

    return {
      success: false,
      data: healthCheck,
      error: {
        code: connectionError.type,
        message: connectionError.message,
        details: {
          originalError: connectionError.originalError,
          responseTime,
        },
      },
      message: 'Supabase connection is unhealthy',
    };
  }
}

/**
 * Get Supabase client with error handling
 * Wrapper function that returns ApiResponse format
 * @returns Promise<ApiResponse<SupabaseClient>>
 */
export async function getSupabaseClientSafe(): Promise<
  ApiResponse<SupabaseClient>
> {
  try {
    const client = getSupabaseClient();

    return {
      success: true,
      data: client,
      message: 'Supabase client initialized successfully',
    };
  } catch (error) {
    const connectionError = error as SupabaseConnectionError;

    return {
      success: false,
      error: {
        code: connectionError.type,
        message: connectionError.message,
        details: {
          originalError: connectionError.originalError,
        },
      },
      message: 'Failed to initialize Supabase client',
    };
  }
}

// Export configured client for direct use (when error handling is done elsewhere)
export { supabaseClient };
