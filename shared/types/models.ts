export interface User {
  id: string;
  email: string;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  timezone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  loggedAt: Date;
  value?: number;
  notes?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface WeeklyStage {
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