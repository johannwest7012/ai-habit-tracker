import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
};

// Onboarding Stack - First-time user setup screens
export type OnboardingStackParamList = {
  Welcome: undefined;
  GoalSetup: undefined;
};

// Main Tab Navigator - Core app functionality
export type MainTabParamList = {
  TodayStack: NavigatorScreenParams<TodayStackParamList>;
  ProgressStack: NavigatorScreenParams<ProgressStackParamList>;
  JourneyStack: NavigatorScreenParams<JourneyStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Individual tab stack parameters
export type TodayStackParamList = {
  Today: undefined;
};

export type ProgressStackParamList = {
  Progress: undefined;
};

export type JourneyStackParamList = {
  Journey: undefined;
};

export type ProfileStackParamList = {
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
  NativeStackScreenProps<MainTabParamList, T>;

export type TodayStackScreenProps<T extends keyof TodayStackParamList> = 
  NativeStackScreenProps<TodayStackParamList, T>;

export type ProgressStackScreenProps<T extends keyof ProgressStackParamList> = 
  NativeStackScreenProps<ProgressStackParamList, T>;

export type JourneyStackScreenProps<T extends keyof JourneyStackParamList> = 
  NativeStackScreenProps<JourneyStackParamList, T>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = 
  NativeStackScreenProps<ProfileStackParamList, T>;

// Navigation hook types
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}