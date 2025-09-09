/**
 * Offline Sync Hooks
 * React Query hooks for offline support and synchronization
 * Following query and mutation hook patterns per story requirements
 */

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { getSupabaseClient } from '../services/api/supabaseClient';
import type { ApiResponse } from '@shared/types/api';
import type { HabitLog } from '@shared/types/data';

/**
 * Offline sync storage keys
 */
const OFFLINE_STORAGE_KEYS = {
  PENDING_HABIT_LOGS: '@offline_pending_habit_logs',
  SYNC_QUEUE: '@offline_sync_queue',
  LAST_SYNC: '@offline_last_sync',
} as const;

/**
 * Query key factory for offline sync queries
 */
export const offlineSyncQueryKeys = {
  all: ['offline-sync'] as const,
  networkStatus: () => [...offlineSyncQueryKeys.all, 'network-status'] as const,
  pendingItems: () => [...offlineSyncQueryKeys.all, 'pending-items'] as const,
  syncStatus: () => [...offlineSyncQueryKeys.all, 'sync-status'] as const,
} as const;

/**
 * Offline sync service functions
 */
const offlineSyncService = {
  /**
   * Get pending habit logs from offline storage
   */
  async getPendingHabitLogs(): Promise<ApiResponse<HabitLog[]>> {
    try {
      const storedData = await AsyncStorage.getItem(
        OFFLINE_STORAGE_KEYS.PENDING_HABIT_LOGS
      );
      const pendingLogs = storedData ? JSON.parse(storedData) : [];

      return {
        success: true,
        data: pendingLogs,
        message: 'Pending habit logs retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'OFFLINE_STORAGE_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to get pending logs',
          details: { originalError: error },
        },
        message: 'Failed to get pending habit logs',
      };
    }
  },

  /**
   * Store habit log for offline sync
   */
  async storePendingHabitLog(
    habitLog: Omit<HabitLog, 'id' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<void>> {
    try {
      const pendingLogsResponse =
        await offlineSyncService.getPendingHabitLogs();
      if (!pendingLogsResponse.success) {
        return {
          success: false,
          error: pendingLogsResponse.error,
          message: 'Failed to retrieve existing pending logs',
        };
      }

      const pendingLogs = pendingLogsResponse.data;
      const newPendingLog = {
        ...habitLog,
        id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _offline: true,
      };

      const updatedLogs = [...pendingLogs, newPendingLog];
      await AsyncStorage.setItem(
        OFFLINE_STORAGE_KEYS.PENDING_HABIT_LOGS,
        JSON.stringify(updatedLogs)
      );

      return {
        success: true,
        data: undefined,
        message: 'Habit log stored for offline sync',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'OFFLINE_STORAGE_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to store pending log',
          details: { originalError: error },
        },
        message: 'Failed to store habit log for offline sync',
      };
    }
  },

  /**
   * Sync pending habit logs to server
   */
  async syncPendingHabitLogs(): Promise<
    ApiResponse<{ synced: number; failed: number }>
  > {
    try {
      const pendingLogsResponse =
        await offlineSyncService.getPendingHabitLogs();
      if (!pendingLogsResponse.success || !pendingLogsResponse.data.length) {
        return {
          success: true,
          data: { synced: 0, failed: 0 },
          message: 'No pending logs to sync',
        };
      }

      const client = getSupabaseClient();
      const pendingLogs = pendingLogsResponse.data;
      let syncedCount = 0;
      let failedCount = 0;
      const remainingLogs: HabitLog[] = [];

      for (const log of pendingLogs) {
        try {
          // Remove offline-specific fields before syncing
          const { _offline, ...logData } = log as any;
          const cleanLogData = {
            ...logData,
            id: undefined, // Let database generate new ID
            created_at: undefined, // Let database set timestamp
            updated_at: undefined, // Let database set timestamp
          };

          const { error } = await client
            .from('habit_logs')
            .insert(cleanLogData);

          if (error) {
            console.error('Failed to sync habit log:', error);
            remainingLogs.push(log);
            failedCount++;
          } else {
            syncedCount++;
          }
        } catch (syncError) {
          console.error('Error syncing individual log:', syncError);
          remainingLogs.push(log);
          failedCount++;
        }
      }

      // Update stored pending logs with remaining items
      await AsyncStorage.setItem(
        OFFLINE_STORAGE_KEYS.PENDING_HABIT_LOGS,
        JSON.stringify(remainingLogs)
      );

      // Update last sync timestamp
      await AsyncStorage.setItem(
        OFFLINE_STORAGE_KEYS.LAST_SYNC,
        new Date().toISOString()
      );

      return {
        success: true,
        data: { synced: syncedCount, failed: failedCount },
        message: `Synced ${syncedCount} logs, ${failedCount} failed`,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to sync pending logs',
          details: { originalError: error },
        },
        message: 'Failed to sync pending habit logs',
      };
    }
  },

  /**
   * Clear all offline data
   */
  async clearOfflineData(): Promise<ApiResponse<void>> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(OFFLINE_STORAGE_KEYS.PENDING_HABIT_LOGS),
        AsyncStorage.removeItem(OFFLINE_STORAGE_KEYS.SYNC_QUEUE),
        AsyncStorage.removeItem(OFFLINE_STORAGE_KEYS.LAST_SYNC),
      ]);

      return {
        success: true,
        data: undefined,
        message: 'Offline data cleared successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'OFFLINE_CLEAR_ERROR',
          message:
            error instanceof Error
              ? error.message
              : 'Failed to clear offline data',
          details: { originalError: error },
        },
        message: 'Failed to clear offline data',
      };
    }
  },
};

/**
 * Hook for network status monitoring
 * Uses React Native NetInfo for network connectivity
 */
export function useNetworkStatus() {
  const netInfo = useNetInfo();

  return useQuery({
    queryKey: offlineSyncQueryKeys.networkStatus(),
    queryFn: () => ({
      success: true,
      data: {
        isConnected: netInfo.isConnected ?? false,
        type: netInfo.type,
        isInternetReachable: netInfo.isInternetReachable ?? false,
      },
      message: 'Network status retrieved',
    }),
    staleTime: 1000, // 1 second
    refetchInterval: 5000, // Check every 5 seconds
  });
}

/**
 * Hook for getting pending offline items
 */
export function usePendingItems() {
  return useQuery({
    queryKey: offlineSyncQueryKeys.pendingItems(),
    queryFn: offlineSyncService.getPendingHabitLogs,
    select: response => (response.success ? response.data : []),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook for storing items offline when network is unavailable
 */
export function useOfflineStorage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: offlineSyncService.storePendingHabitLog,
    onSuccess: () => {
      // Invalidate pending items to show new offline item
      queryClient.invalidateQueries({
        queryKey: offlineSyncQueryKeys.pendingItems(),
      });
    },
    onError: error => {
      console.error('Failed to store item offline:', error);
    },
  });
}

/**
 * Hook for syncing offline data to server
 */
export function useSyncOfflineData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: offlineSyncService.syncPendingHabitLogs,
    onSuccess: response => {
      if (response.success && response.data.synced > 0) {
        // Invalidate all habit-related queries to refetch from server
        queryClient.invalidateQueries({ queryKey: ['habits'] });
        queryClient.invalidateQueries({
          queryKey: offlineSyncQueryKeys.pendingItems(),
        });
      }
    },
    onError: error => {
      console.error('Failed to sync offline data:', error);
    },
  });
}

/**
 * Hook for clearing offline data
 */
export function useClearOfflineData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: offlineSyncService.clearOfflineData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineSyncQueryKeys.all });
    },
    onError: error => {
      console.error('Failed to clear offline data:', error);
    },
  });
}

/**
 * Comprehensive offline sync hook
 * Combines network status, pending items, and sync functionality
 */
export function useOfflineSync() {
  const networkStatus = useNetworkStatus();
  const pendingItems = usePendingItems();
  const syncMutation = useSyncOfflineData();
  const offlineStorageMutation = useOfflineStorage();

  // Auto-sync when network becomes available
  const isOnline =
    networkStatus.data?.data?.isConnected &&
    networkStatus.data?.data?.isInternetReachable;
  const hasPendingItems = (pendingItems.data?.length || 0) > 0;

  // Trigger sync when conditions are met
  React.useEffect(() => {
    if (isOnline && hasPendingItems && !syncMutation.isPending) {
      syncMutation.mutate();
    }
  }, [isOnline, hasPendingItems, syncMutation]);

  return {
    // Network state
    isOnline,
    networkStatus: networkStatus.data?.data,

    // Offline data
    pendingItems: pendingItems.data || [],
    hasPendingItems,

    // Sync state
    isSyncing: syncMutation.isPending,
    syncError: syncMutation.error,
    lastSyncResult: syncMutation.data,

    // Actions
    storeOffline: offlineStorageMutation.mutate,
    syncNow: syncMutation.mutate,

    // Loading states
    isLoading: networkStatus.isLoading || pendingItems.isLoading,

    // Error states
    error: networkStatus.error || pendingItems.error,
    isError: networkStatus.isError || pendingItems.isError,
  };
}
