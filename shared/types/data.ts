/**
 * Data types for database entities with proper field mappings
 * These interfaces map to actual database schema with snake_case fields
 */

// Re-export shared models with camelCase for TypeScript usage
export type { User, UserProfile, Habit, Goal, HabitFrequency } from './models';

// Database-mapped interfaces (snake_case to match Supabase)
export interface WeeklyStage {
  id: string;
  goal_id: string;
  week_number: number;
  title: string;
  description?: string;
  habits: string[];
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  logged_at: string;
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// TypeScript-friendly interfaces (camelCase for app usage)
export interface WeeklyStageData {
  id: string;
  goalId: string;
  weekNumber: number;
  title: string;
  description?: string;
  habits: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLogData {
  id: string;
  habitId: string;
  userId: string;
  loggedAt: Date;
  value?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Utility functions for converting between database and TypeScript formats
 */
export const dataMappers = {
  /**
   * Convert database WeeklyStage to TypeScript format
   */
  weeklyStageFromDb(dbStage: WeeklyStage): WeeklyStageData {
    return {
      id: dbStage.id,
      goalId: dbStage.goal_id,
      weekNumber: dbStage.week_number,
      title: dbStage.title,
      description: dbStage.description,
      habits: dbStage.habits,
      isCompleted: dbStage.is_completed,
      createdAt: new Date(dbStage.created_at),
      updatedAt: new Date(dbStage.updated_at),
    };
  },

  /**
   * Convert TypeScript WeeklyStage to database format
   */
  weeklyStageToDb(stage: WeeklyStageData): Omit<WeeklyStage, 'id' | 'created_at' | 'updated_at'> {
    return {
      goal_id: stage.goalId,
      week_number: stage.weekNumber,
      title: stage.title,
      description: stage.description,
      habits: stage.habits,
      is_completed: stage.isCompleted,
    };
  },

  /**
   * Convert database HabitLog to TypeScript format
   */
  habitLogFromDb(dbLog: HabitLog): HabitLogData {
    return {
      id: dbLog.id,
      habitId: dbLog.habit_id,
      userId: dbLog.user_id,
      loggedAt: new Date(dbLog.logged_at),
      value: dbLog.value,
      notes: dbLog.notes,
      createdAt: new Date(dbLog.created_at),
      updatedAt: new Date(dbLog.updated_at),
    };
  },

  /**
   * Convert TypeScript HabitLog to database format
   */
  habitLogToDb(log: HabitLogData): Omit<HabitLog, 'id' | 'created_at' | 'updated_at'> {
    return {
      habit_id: log.habitId,
      user_id: log.userId,
      logged_at: log.loggedAt.toISOString(),
      value: log.value,
      notes: log.notes,
    };
  },
};