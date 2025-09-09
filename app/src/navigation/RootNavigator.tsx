import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../shared/types/navigation';

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

export default function RootNavigator() {
  return (
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
  );
}

// Auth Stack Navigator
function AuthNavigator() {
  const AuthStack = createNativeStackNavigator();

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Onboarding Stack Navigator
function OnboardingNavigator() {
  const OnboardingStack = createNativeStackNavigator();

  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: true }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="GoalSetup" component={GoalSetupScreen} />
    </OnboardingStack.Navigator>
  );
}

// Main Tabs Navigator (simplified for now - will be enhanced in future stories)
function MainTabsNavigator() {
  const MainStack = createNativeStackNavigator();

  return (
    <MainStack.Navigator screenOptions={{ headerShown: true }}>
      <MainStack.Screen name="Today" component={TodayScreen} />
      <MainStack.Screen name="Progress" component={ProgressScreen} />
      <MainStack.Screen name="Journey" component={JourneyScreen} />
      <MainStack.Screen name="Profile" component={ProfileScreen} />
    </MainStack.Navigator>
  );
}
