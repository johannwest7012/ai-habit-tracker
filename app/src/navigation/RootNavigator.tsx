import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ErrorBoundary from '../components/common/ErrorBoundary';
import type {
  RootStackParamList,
  AuthStackParamList,
  OnboardingStackParamList,
  MainTabParamList,
} from '../../../shared/types/navigation';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

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
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerShown: true,
          }}
        >
          {/* Auth Stack */}
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
          {/* Onboarding Stack */}
          <RootStack.Screen
            name="Onboarding"
            component={OnboardingNavigator}
            options={{ headerShown: false }}
          />
          {/* Main Tabs */}
          <RootStack.Screen
            name="MainTabs"
            component={MainTabsNavigator}
            options={{ headerShown: false }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}

// Auth Stack Navigator
function AuthNavigator() {
  return (
    <ErrorBoundary>
      <AuthStack.Navigator screenOptions={{ headerShown: true }}>
        <AuthStack.Screen name="SignIn" component={SignInScreen} />
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      </AuthStack.Navigator>
    </ErrorBoundary>
  );
}

// Onboarding Stack Navigator
function OnboardingNavigator() {
  return (
    <ErrorBoundary>
      <OnboardingStack.Navigator screenOptions={{ headerShown: true }}>
        <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
        <OnboardingStack.Screen name="GoalSetup" component={GoalSetupScreen} />
      </OnboardingStack.Navigator>
    </ErrorBoundary>
  );
}

// Main Tabs Navigator - Now properly using tab navigation
function MainTabsNavigator() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
