import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import type {
  RootStackParamList,
  AuthStackParamList,
  OnboardingStackParamList,
  MainTabParamList,
} from '../../../shared/types/navigation';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import PasswordResetConfirmationScreen from '../screens/auth/PasswordResetConfirmationScreen';

// Onboarding Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import GoalSetupScreen from '../screens/onboarding/GoalSetupScreen';

// Main Screens
import TodayScreen from '../screens/main/TodayScreen';
import ProgressScreen from '../screens/main/ProgressScreen';
import JourneyScreen from '../screens/main/JourneyScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isInitialized } = useAuthContext();

  // Show loading screen during auth state initialization
  if (!isInitialized || isLoading) {
    return <ProtectedRoute showLoading={true}>{null}</ProtectedRoute>;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        {!isAuthenticated ? (
          // Unauthenticated flow - Show auth stack
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          // Authenticated flow - Show protected routes
          <>
            {/* Protected Onboarding Stack */}
            <RootStack.Screen
              name="Onboarding"
              component={ProtectedOnboardingNavigator}
              options={{ headerShown: false }}
            />
            {/* Protected Main Tabs */}
            <RootStack.Screen
              name="MainTabs"
              component={ProtectedMainTabsNavigator}
              options={{ headerShown: false }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

// Auth Stack Navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen name="SignIn" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{ title: 'Reset Password' }}
      />
      <AuthStack.Screen
        name="PasswordResetConfirmation"
        component={PasswordResetConfirmationScreen}
        options={{ title: 'Check Your Email' }}
      />
    </AuthStack.Navigator>
  );
}

// Onboarding Stack Navigator
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: true }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="GoalSetup" component={GoalSetupScreen} />
    </OnboardingStack.Navigator>
  );
}

// Main Tabs Navigator - Now properly using tab navigation
function MainTabsNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <MainTab.Screen name="Today" component={TodayScreen} />
      <MainTab.Screen name="Progress" component={ProgressScreen} />
      <MainTab.Screen name="Journey" component={JourneyScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

// Protected Onboarding Navigator
function ProtectedOnboardingNavigator() {
  return (
    <ProtectedRoute>
      <OnboardingNavigator />
    </ProtectedRoute>
  );
}

// Protected Main Tabs Navigator
function ProtectedMainTabsNavigator() {
  return (
    <ProtectedRoute>
      <MainTabsNavigator />
    </ProtectedRoute>
  );
}
