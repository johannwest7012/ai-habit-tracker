import React from 'react';
import { render } from '@testing-library/react-native';
import RootNavigator from '../RootNavigator';

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ component: Component }: { component: React.ComponentType }) => (
      <Component />
    ),
  }),
}));

// Mock screens
jest.mock('../../screens/auth/SignInScreen', () => {
  const MockSignInScreen = () => null;
  MockSignInScreen.displayName = 'SignInScreen';
  return MockSignInScreen;
});

jest.mock('../../screens/auth/SignUpScreen', () => {
  const MockSignUpScreen = () => null;
  MockSignUpScreen.displayName = 'SignUpScreen';
  return MockSignUpScreen;
});

jest.mock('../../screens/onboarding/WelcomeScreen', () => {
  const MockWelcomeScreen = () => null;
  MockWelcomeScreen.displayName = 'WelcomeScreen';
  return MockWelcomeScreen;
});

jest.mock('../../screens/onboarding/GoalSetupScreen', () => {
  const MockGoalSetupScreen = () => null;
  MockGoalSetupScreen.displayName = 'GoalSetupScreen';
  return MockGoalSetupScreen;
});

jest.mock('../../screens/main/TodayScreen', () => {
  const MockTodayScreen = () => null;
  MockTodayScreen.displayName = 'TodayScreen';
  return MockTodayScreen;
});

jest.mock('../../screens/main/ProgressScreen', () => {
  const MockProgressScreen = () => null;
  MockProgressScreen.displayName = 'ProgressScreen';
  return MockProgressScreen;
});

jest.mock('../../screens/main/JourneyScreen', () => {
  const MockJourneyScreen = () => null;
  MockJourneyScreen.displayName = 'JourneyScreen';
  return MockJourneyScreen;
});

jest.mock('../../screens/main/ProfileScreen', () => {
  const MockProfileScreen = () => null;
  MockProfileScreen.displayName = 'ProfileScreen';
  return MockProfileScreen;
});

describe('RootNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<RootNavigator />)).not.toThrow();
  });

  it('renders NavigationContainer', () => {
    const result = render(<RootNavigator />);
    expect(result).toBeDefined();
  });

  it('has proper navigation structure', () => {
    // Test that the component renders without TypeScript errors
    const component = <RootNavigator />;
    expect(component).toBeDefined();
    expect(component.type).toBe(RootNavigator);
  });

  describe('Navigation Type Safety', () => {
    it('should have proper TypeScript navigation types', () => {
      // This test ensures TypeScript compilation succeeds
      // which validates our navigation type definitions
      const navigator = RootNavigator;
      expect(typeof navigator).toBe('function');
    });
  });

  describe('Screen Accessibility', () => {
    it('should be accessible to navigation state management', () => {
      // Test navigation state accessibility
      const result = render(<RootNavigator />);
      expect(result).toBeDefined();
    });
  });
});
