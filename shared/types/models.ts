export interface User {
  id: string;
  email: string;
  created_at: string;
  profile_data: ProfileData;
  subscription_tier: 'free' | 'premium';
  notification_preferences: NotificationPreferences;
}

export interface ProfileData {
  name?: string;
  avatar_url?: string;
  timezone: string;
  onboarding_completed: boolean;
}

export interface NotificationPreferences {
  daily_reminder: boolean;
  reminder_time: string;
  weekly_summary: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface SignUpData {
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PasswordResetData {
  email: string;
}