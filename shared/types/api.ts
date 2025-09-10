import { User, UserProfile, Habit, HabitLog, Goal } from './models';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserRequest {
  email: string;
  profile?: Partial<UserProfile>;
}

export interface UpdateUserProfileRequest {
  displayName?: string;
  timezone?: string;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: string;
}

export interface UpdateHabitRequest {
  name?: string;
  description?: string;
  frequency?: string;
  isActive?: boolean;
}

export interface CreateHabitLogRequest {
  habitId: string;
  value?: number;
  notes?: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetDate?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetDate?: string;
  isCompleted?: boolean;
}

// Supabase Client Configuration Types
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    realtime?: {
      params?: Record<string, any>;
    };
  };
}

export interface SupabaseHealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  responseTime?: number;
  error?: string;
}

export interface SupabaseConnectionError {
  type: 'NETWORK_ERROR' | 'AUTH_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  originalError?: any;
  timestamp: string;
}

export type UserResponse = ApiResponse<User>;
export type HabitsResponse = ApiResponse<Habit[]>;
export type HabitResponse = ApiResponse<Habit>;
export type HabitLogsResponse = ApiResponse<PaginatedResponse<HabitLog>>;
export type GoalsResponse = ApiResponse<Goal[]>;
export type GoalResponse = ApiResponse<Goal>;
export type HealthCheckResponse = ApiResponse<SupabaseHealthCheck>;