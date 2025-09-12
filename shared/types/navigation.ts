import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Root Stack Navigator - Main app navigation structure
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack - Authentication flow screens
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
  PasswordResetConfirmation: { email: string };
};

// Onboarding Stack - First-time user setup screens
export type OnboardingStackParamList = {
  Welcome: undefined;
  GoalSetup: undefined;
};

// Main Tab Navigator - Core app functionality (simplified structure)
export type MainTabParamList = {
  Today: undefined;
  Progress: undefined;
  Journey: undefined;
  Profile: undefined;
};

// Typed navigation props for screens
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type OnboardingStackScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

// Navigation hook types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}