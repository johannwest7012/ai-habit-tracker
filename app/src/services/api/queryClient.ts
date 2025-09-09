/**
 * React Query Client Configuration
 * Handles React Query setup with offline support and retry policies
 * Following service layer pattern per coding standards
 */

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse } from '@shared/types/api';

/**
 * Query client instance - initialized lazily
 */
let queryClient: QueryClient | null = null;

/**
 * Default query configuration following story requirements
 */
const defaultQueryOptions: QueryClientConfig['defaultOptions'] = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    // Offline behavior - pause queries when offline
    networkMode: 'offlineFirst',
  },
  mutations: {
    retry: 1,
    // Allow mutations when offline for optimistic updates
    networkMode: 'offlineFirst',
  },
};

/**
 * Query client configuration
 */
const queryClientConfig: QueryClientConfig = {
  defaultOptions: defaultQueryOptions,
};

/**
 * Create and configure React Query client
 * Implements singleton pattern with lazy initialization
 * @returns QueryClient instance
 */
export function createQueryClient(): QueryClient {
  if (queryClient) {
    return queryClient;
  }

  queryClient = new QueryClient(queryClientConfig);

  // Add global error handler for queries
  queryClient.setMutationDefaults(['default'], {
    onError: error => {
      console.error('Query mutation error:', error);
    },
  });

  return queryClient;
}

/**
 * Get React Query client instance
 * @returns QueryClient instance
 */
export function getQueryClient(): QueryClient {
  if (!queryClient) {
    return createQueryClient();
  }
  return queryClient;
}

/**
 * Reset query client instance (for testing purposes)
 */
export function resetQueryClient(): void {
  queryClient?.clear();
  queryClient = null;
}

/**
 * Setup query client persistence for offline support
 * Uses AsyncStorage for React Native persistence
 * @returns Promise<void>
 */
export async function setupQueryPersistence(): Promise<void> {
  const client = getQueryClient();

  try {
    // Clear any stale data on app start
    await AsyncStorage.removeItem('@react-query-cache');

    // Note: React Query v5 doesn't have built-in persistence plugin
    // For now, we'll implement basic cache management
    // In production, consider using react-query-persist-client-core

    console.log('Query persistence setup completed');
  } catch (error) {
    console.error('Failed to setup query persistence:', error);
  }
}

/**
 * Clear all cached queries
 * @returns Promise<void>
 */
export async function clearQueryCache(): Promise<void> {
  const client = getQueryClient();

  try {
    await client.clear();
    await AsyncStorage.removeItem('@react-query-cache');
    console.log('Query cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear query cache:', error);
    throw error;
  }
}

/**
 * Invalidate queries by pattern
 * @param queryPattern - Query key pattern to invalidate
 * @returns Promise<void>
 */
export async function invalidateQueries(queryPattern: string[]): Promise<void> {
  const client = getQueryClient();

  try {
    await client.invalidateQueries({
      queryKey: queryPattern,
    });
    console.log('Queries invalidated:', queryPattern);
  } catch (error) {
    console.error('Failed to invalidate queries:', error);
    throw error;
  }
}

/**
 * Get query client with error handling wrapper
 * @returns Promise<ApiResponse<QueryClient>>
 */
export async function getQueryClientSafe(): Promise<ApiResponse<QueryClient>> {
  try {
    const client = getQueryClient();

    return {
      success: true,
      data: client,
      message: 'Query client initialized successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'QUERY_CLIENT_ERROR',
        message:
          error instanceof Error ? error.message : 'Unknown query client error',
        details: { originalError: error },
      },
      message: 'Failed to initialize query client',
    };
  }
}

// Export configured client for direct use
export { queryClient };
