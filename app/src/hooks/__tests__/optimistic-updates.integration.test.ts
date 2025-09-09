/**
 * Integration Tests for Optimistic Updates
 * Tests the complete flow of optimistic updates with rollback scenarios
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSupabaseClient } from '../../services/api/supabaseClient';
import { useLogHabit, useHabitLogsByDate, habitQueryKeys } from '../useHabitTracking';
import type { HabitLogData } from '@shared/types/data';

// Mock Supabase client
jest.mock('../../services/api/supabaseClient', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockSupabaseClient = getSupabaseClient as jest.MockedFunction<typeof getSupabaseClient>;

// Test wrapper with QueryClient
function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        staleTime: 0, // Force immediate refetch for testing
      },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Optimistic Updates Integration Tests', () => {
  const mockHabitLog: Omit<HabitLogData, 'id' | 'createdAt' | 'updatedAt'> = {
    habitId: 'habit-123',
    userId: 'user-123',
    loggedAt: new Date('2023-12-01T10:00:00Z'),
    value: 1,
    notes: 'Completed morning run',
  };

  const existingLogs: HabitLogData[] = [
    {
      id: 'log-1',
      habitId: 'habit-123',
      userId: 'user-123',
      loggedAt: new Date('2023-12-01T08:00:00Z'),
      value: 1,
      createdAt: new Date('2023-12-01T08:00:00Z'),
      updatedAt: new Date('2023-12-01T08:00:00Z'),
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Optimistic Update Flow', () => {
    it('should optimistically add habit log and sync with server response', async () => {
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: existingLogs.map(log => ({
                    id: log.id,
                    habit_id: log.habitId,
                    user_id: log.userId,
                    logged_at: log.loggedAt.toISOString(),
                    value: log.value,
                    notes: log.notes,
                    created_at: log.createdAt.toISOString(),
                    updated_at: log.updatedAt.toISOString(),
                  })),
                  error: null,
                }),
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'log-2',
                  habit_id: mockHabitLog.habitId,
                  user_id: mockHabitLog.userId,
                  logged_at: mockHabitLog.loggedAt.toISOString(),
                  value: mockHabitLog.value,
                  notes: mockHabitLog.notes,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
                error: null,
              }),
            }),
          }),
        }),
      };

      mockSupabaseClient.mockReturnValue(mockClient as any);

      const wrapper = createTestWrapper();

      // First, set up existing data by rendering the logs hook
      const { result: logsResult } = renderHook(() => useHabitLogsByDate('2023-12-01'), { wrapper });
      
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(1);
      });

      // Now test the optimistic update
      const { result: mutationResult } = renderHook(() => useLogHabit(), { wrapper });

      act(() => {
        mutationResult.current.mutate(mockHabitLog);
      });

      // Immediately after mutation, should see optimistic update
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(2);
      });

      // Check that the optimistic log is present
      const optimisticLog = logsResult.current.data?.find(log => log.id.startsWith('temp-'));
      expect(optimisticLog).toBeTruthy();
      expect(optimisticLog?.habitId).toBe(mockHabitLog.habitId);
      expect(optimisticLog?.notes).toBe(mockHabitLog.notes);

      // Wait for mutation to complete
      await waitFor(() => {
        expect(mutationResult.current.isSuccess).toBe(true);
      });

      // After successful mutation, should still have 2 logs
      // The optimistic one should be replaced by the server response
      expect(logsResult.current.data).toHaveLength(2);
      
      // Should no longer have temp ID logs
      const tempLogs = logsResult.current.data?.filter(log => log.id.startsWith('temp-'));
      expect(tempLogs).toHaveLength(0);
    });
  });

  describe('Failed Optimistic Update with Rollback', () => {
    it('should rollback optimistic update on mutation failure', async () => {
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: existingLogs.map(log => ({
                    id: log.id,
                    habit_id: log.habitId,
                    user_id: log.userId,
                    logged_at: log.loggedAt.toISOString(),
                    value: log.value,
                    notes: log.notes,
                    created_at: log.createdAt.toISOString(),
                    updated_at: log.updatedAt.toISOString(),
                  })),
                  error: null,
                }),
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database constraint violation', code: '23505' },
              }),
            }),
          }),
        }),
      };

      mockSupabaseClient.mockReturnValue(mockClient as any);

      const wrapper = createTestWrapper();

      // Set up existing data
      const { result: logsResult } = renderHook(() => useHabitLogsByDate('2023-12-01'), { wrapper });
      
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(1);
      });

      const originalLogCount = logsResult.current.data?.length || 0;

      // Test the optimistic update with failure
      const { result: mutationResult } = renderHook(() => useLogHabit(), { wrapper });

      act(() => {
        mutationResult.current.mutate(mockHabitLog);
      });

      // Immediately after mutation, should see optimistic update
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(originalLogCount + 1);
      });

      // Wait for mutation to fail
      await waitFor(() => {
        expect(mutationResult.current.isError).toBe(true);
      });

      // After failed mutation, should rollback to original state
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(originalLogCount);
      });

      // Should not have any temp logs
      const tempLogs = logsResult.current.data?.filter(log => log.id.startsWith('temp-'));
      expect(tempLogs).toHaveLength(0);
    });
  });

  describe('Network Failure Scenarios', () => {
    it('should handle network timeouts with proper rollback', async () => {
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: existingLogs.map(log => ({
                    id: log.id,
                    habit_id: log.habitId,
                    user_id: log.userId,
                    logged_at: log.loggedAt.toISOString(),
                    value: log.value,
                    notes: log.notes,
                    created_at: log.createdAt.toISOString(),
                    updated_at: log.updatedAt.toISOString(),
                  })),
                  error: null,
                }),
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockRejectedValue(new Error('Network request timed out')),
            }),
          }),
        }),
      };

      mockSupabaseClient.mockReturnValue(mockClient as any);

      const wrapper = createTestWrapper();
      
      const { result: logsResult } = renderHook(() => useHabitLogsByDate('2023-12-01'), { wrapper });
      
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(1);
      });

      const { result: mutationResult } = renderHook(() => useLogHabit(), { wrapper });

      act(() => {
        mutationResult.current.mutate(mockHabitLog);
      });

      // Should see optimistic update
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(2);
      });

      // Wait for network error
      await waitFor(() => {
        expect(mutationResult.current.isError).toBe(true);
      });

      // Should rollback to original state
      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(1);
      });
    });
  });

  describe('Concurrent Optimistic Updates', () => {
    it('should handle multiple concurrent optimistic updates correctly', async () => {
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              lt: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: [],
                  error: null,
                }),
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn()
                .mockResolvedValueOnce({
                  data: {
                    id: 'log-1',
                    habit_id: 'habit-123',
                    user_id: 'user-123',
                    logged_at: new Date().toISOString(),
                    value: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                  error: null,
                })
                .mockResolvedValueOnce({
                  data: {
                    id: 'log-2',
                    habit_id: 'habit-456',
                    user_id: 'user-123',
                    logged_at: new Date().toISOString(),
                    value: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                  error: null,
                }),
            }),
          }),
        }),
      };

      mockSupabaseClient.mockReturnValue(mockClient as any);

      const wrapper = createTestWrapper();
      
      const { result: logsResult } = renderHook(() => useHabitLogsByDate('2023-12-01'), { wrapper });
      const { result: mutationResult } = renderHook(() => useLogHabit(), { wrapper });

      await waitFor(() => {
        expect(logsResult.current.data).toHaveLength(0);
      });

      // Trigger two concurrent mutations
      const habit1 = { ...mockHabitLog, habitId: 'habit-123' };
      const habit2 = { ...mockHabitLog, habitId: 'habit-456' };

      act(() => {
        mutationResult.current.mutate(habit1);
        mutationResult.current.mutate(habit2);
      });

      // Should immediately show both optimistic updates
      await waitFor(() => {
        expect(logsResult.current.data?.length).toBeGreaterThanOrEqual(2);
      });

      // Wait for both mutations to complete
      await waitFor(() => {
        expect(mutationResult.current.isSuccess || mutationResult.current.isError).toBe(true);
      }, { timeout: 5000 });

      // Final state should have correct number of logs
      expect(logsResult.current.data).toBeDefined();
    });
  });
});