/**
 * Habit Tracking Hooks
 * React Query hooks for habit tracking data management
 * Following query and mutation hook patterns per story requirements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '../services/api/supabaseClient';
import type { ApiResponse } from '@shared/types/api';
import type {
  WeeklyStage,
  HabitLog,
  Goal,
  WeeklyStageData,
  HabitLogData,
  dataMappers,
} from '@shared/types/data';

/**
 * Query key factory for habit tracking queries
 */
export const habitQueryKeys = {
  all: ['habits'] as const,
  goals: () => [...habitQueryKeys.all, 'goals'] as const,
  goal: (goalId: string) => [...habitQueryKeys.goals(), goalId] as const,
  weeklyStages: () => [...habitQueryKeys.all, 'weekly-stages'] as const,
  weeklyStage: (stageId: string) =>
    [...habitQueryKeys.weeklyStages(), stageId] as const,
  habitLogs: () => [...habitQueryKeys.all, 'habit-logs'] as const,
  habitLog: (logId: string) => [...habitQueryKeys.habitLogs(), logId] as const,
  habitLogsByDate: (date: string) =>
    [...habitQueryKeys.habitLogs(), 'by-date', date] as const,
} as const;

/**
 * Habit tracking service functions
 */
const habitService = {
  /**
   * Get user goals
   */
  async getGoals(): Promise<ApiResponse<Goal[]>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: {
            code: 'GOALS_FETCH_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to fetch goals',
        };
      }

      return {
        success: true,
        data: data as Goal[],
        message: 'Goals fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GOALS_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to fetch goals',
      };
    }
  },

  /**
   * Get weekly stages for a goal
   */
  async getWeeklyStages(
    goalId: string
  ): Promise<ApiResponse<WeeklyStageData[]>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('weekly_stages')
        .select('*')
        .eq('goal_id', goalId)
        .order('week_number', { ascending: true });

      if (error) {
        return {
          success: false,
          error: {
            code: 'WEEKLY_STAGES_FETCH_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to fetch weekly stages',
        };
      }

      // Convert database format to TypeScript format
      const mappedData = (data as WeeklyStage[]).map(
        dataMappers.weeklyStageFromDb
      );

      return {
        success: true,
        data: mappedData,
        message: 'Weekly stages fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'WEEKLY_STAGES_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to fetch weekly stages',
      };
    }
  },

  /**
   * Get habit logs for a specific date
   */
  async getHabitLogsByDate(date: string): Promise<ApiResponse<HabitLogData[]>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('habit_logs')
        .select('*')
        .gte('logged_at', `${date}T00:00:00.000Z`)
        .lt('logged_at', `${date}T23:59:59.999Z`)
        .order('logged_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: {
            code: 'HABIT_LOGS_FETCH_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to fetch habit logs',
        };
      }

      // Convert database format to TypeScript format
      const mappedData = (data as HabitLog[]).map(dataMappers.habitLogFromDb);

      return {
        success: true,
        data: mappedData,
        message: 'Habit logs fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HABIT_LOGS_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to fetch habit logs',
      };
    }
  },

  /**
   * Log a habit completion
   */
  async logHabit(
    habitData: Omit<HabitLogData, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<HabitLogData>> {
    try {
      const client = getSupabaseClient();

      // Convert TypeScript format to database format
      const dbData = dataMappers.habitLogToDb({
        ...habitData,
        id: '', // Will be ignored
        createdAt: new Date(), // Will be set by database
        updatedAt: new Date(), // Will be set by database
      });

      const { data, error } = await client
        .from('habit_logs')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            code: 'HABIT_LOG_CREATE_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to log habit',
        };
      }

      // Convert database response back to TypeScript format
      const mappedData = dataMappers.habitLogFromDb(data as HabitLog);

      return {
        success: true,
        data: mappedData,
        message: 'Habit logged successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HABIT_LOG_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to log habit',
      };
    }
  },

  /**
   * Update habit log
   */
  async updateHabitLog(
    logId: string,
    updateData: Partial<HabitLog>
  ): Promise<ApiResponse<HabitLog>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('habit_logs')
        .update(updateData)
        .eq('id', logId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            code: 'HABIT_LOG_UPDATE_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to update habit log',
        };
      }

      return {
        success: true,
        data: data as HabitLog,
        message: 'Habit log updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HABIT_LOG_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to update habit log',
      };
    }
  },
};

/**
 * Hook for fetching user goals
 */
export function useGoals() {
  return useQuery({
    queryKey: habitQueryKeys.goals(),
    queryFn: habitService.getGoals,
    select: response => (response.success ? response.data : []),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for fetching weekly stages for a goal
 */
export function useWeeklyStages(goalId: string) {
  return useQuery({
    queryKey: habitQueryKeys.weeklyStage(goalId),
    queryFn: () => habitService.getWeeklyStages(goalId),
    select: response => (response.success ? response.data : []),
    enabled: !!goalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching habit logs by date
 */
export function useHabitLogsByDate(date: string) {
  return useQuery({
    queryKey: habitQueryKeys.habitLogsByDate(date),
    queryFn: () => habitService.getHabitLogsByDate(date),
    select: response => (response.success ? response.data : []),
    enabled: !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for current day)
  });
}

/**
 * Hook for logging habit completion with optimistic updates
 */
export function useLogHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: habitService.logHabit,
    onMutate: async newHabitLog => {
      // Optimistic update for current date
      const today = new Date().toISOString().split('T')[0];
      const queryKey = habitQueryKeys.habitLogsByDate(today);

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousLogs = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      if (previousLogs) {
        const tempLog: HabitLogData = {
          id: `temp-${Date.now()}`,
          ...newHabitLog,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        queryClient.setQueryData(
          queryKey,
          (old: ApiResponse<HabitLogData[]> | undefined) => {
            if (!old) return old;
            return {
              ...old,
              data: [tempLog, ...(old.data || [])],
            };
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousLogs, queryKey };
    },
    onError: (err, newHabitLog, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousLogs);
      }
      console.error('Failed to log habit:', err);
    },
    onSuccess: (response, variables, context) => {
      if (response.success && context) {
        // Invalidate relevant queries to refetch from server
        const today = new Date().toISOString().split('T')[0];
        queryClient.invalidateQueries({
          queryKey: habitQueryKeys.habitLogsByDate(today),
        });
      }
    },
  });
}

/**
 * Hook for updating habit log
 */
export function useUpdateHabitLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      logId,
      updateData,
    }: {
      logId: string;
      updateData: Partial<HabitLog>;
    }) => habitService.updateHabitLog(logId, updateData),
    onSuccess: response => {
      if (response.success) {
        // Invalidate habit logs to refetch updated data
        queryClient.invalidateQueries({ queryKey: habitQueryKeys.habitLogs() });
      }
    },
    onError: error => {
      console.error('Failed to update habit log:', error);
    },
  });
}

/**
 * Hook for comprehensive habit tracking state
 * Combines goals, current stage, and today's logs
 */
export function useHabitTracking() {
  const today = new Date().toISOString().split('T')[0];
  const goalsQuery = useGoals();
  const todayLogsQuery = useHabitLogsByDate(today);

  // Get current active goal (assuming first goal is active)
  const currentGoal = goalsQuery.data?.[0];
  const weeklyStagesQuery = useWeeklyStages(currentGoal?.id || '');

  return {
    // Data
    goals: goalsQuery.data || [],
    currentGoal,
    weeklyStages: weeklyStagesQuery.data || [],
    todayLogs: todayLogsQuery.data || [],

    // Loading states
    isLoading:
      goalsQuery.isLoading ||
      todayLogsQuery.isLoading ||
      weeklyStagesQuery.isLoading,
    isFetching:
      goalsQuery.isFetching ||
      todayLogsQuery.isFetching ||
      weeklyStagesQuery.isFetching,

    // Error states
    error: goalsQuery.error || todayLogsQuery.error || weeklyStagesQuery.error,
    isError:
      goalsQuery.isError || todayLogsQuery.isError || weeklyStagesQuery.isError,

    // Refetch functions
    refetch: () => {
      goalsQuery.refetch();
      todayLogsQuery.refetch();
      if (currentGoal) {
        weeklyStagesQuery.refetch();
      }
    },
  };
}
