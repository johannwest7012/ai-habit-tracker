/**
 * Root Navigator Security Tests
 * Tests for authentication-based navigation flow and route protection
 * Following testing standards from story requirements
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, Text } from 'react-native';
import type { User, Session } from '@supabase/supabase-js';
import RootNavigator from '../RootNavigator';
import { useAuth } from '../../hooks/useAuth';
import { useAuthContext } from '../../contexts/AuthContext';

// Mock the hooks
jest.mock('../../hooks/useAuth');
jest.mock('../../contexts/AuthContext');
jest.mock('../../screens/auth/LoginScreen', () => {
  return function MockLoginScreen() {
    return (
      <View testID="login-screen">
        <Text>Login Screen</Text>
      </View>
    );
  };
});
jest.mock('../../screens/auth/SignUpScreen', () => {
  return function MockSignUpScreen() {
    return (
      <View testID="signup-screen">
        <Text>Sign Up Screen</Text>
      </View>
    );
  };
});
jest.mock('../../screens/main/TodayScreen', () => {
  return function MockTodayScreen() {
    return (
      <View testID="today-screen">
        <Text>Today Screen</Text>
      </View>
    );
  };
});
jest.mock('../../screens/onboarding/WelcomeScreen', () => {
  return function MockWelcomeScreen() {
    return (
      <View testID="welcome-screen">
        <Text>Welcome Screen</Text>
      </View>
    );
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseAuthContext = useAuthContext as jest.MockedFunction<
  typeof useAuthContext
>;

// Test wrapper with QueryClient
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock user and session data
const mockUser: Partial<User> = {
  id: 'user-123',
  email: 'test@example.com',
};

const mockSession: Partial<Session> = {
  access_token: 'token-123',
  user: mockUser as User,
};

describe('RootNavigator Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication State Loading', () => {
    it('should show loading screen when auth context is not initialized', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isError: false,
        session: null,
        user: null,
        error: null,
        refetch: jest.fn(),
        isInitialized: false, // Not initialized
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeTruthy();
      expect(screen.queryByTestId('login-screen')).toBeNull();
      expect(screen.queryByTestId('today-screen')).toBeNull();
    });

    it('should show loading screen when auth is loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true, // Loading
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        isError: false,
        session: null,
        user: null,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });

  describe('Unauthenticated Navigation Flow', () => {
    it('should show auth stack when user is not authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isError: false,
        session: null,
        user: null,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      // Should show auth stack screens
      expect(screen.queryByTestId('login-screen')).toBeTruthy();
      // Should not show protected screens
      expect(screen.queryByTestId('today-screen')).toBeNull();
      expect(screen.queryByTestId('welcome-screen')).toBeNull();
    });

    it('should not show protected routes when partially authenticated', () => {
      // User exists but not fully authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: mockUser as User,
        session: null, // No session
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isError: false,
        session: null,
        user: mockUser as User,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.queryByTestId('login-screen')).toBeTruthy();
      expect(screen.queryByTestId('today-screen')).toBeNull();
    });
  });

  describe('Authenticated Navigation Flow', () => {
    it('should show protected routes when user is fully authenticated', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser as User,
        session: mockSession as Session,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        session: mockSession as Session,
        user: mockUser as User,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      // Should show protected screens
      expect(screen.queryByTestId('today-screen')).toBeTruthy();
      // Should not show auth screens
      expect(screen.queryByTestId('login-screen')).toBeNull();
    });

    it('should not show auth stack when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser as User,
        session: mockSession as Session,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        session: mockSession as Session,
        user: mockUser as User,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.queryByTestId('login-screen')).toBeNull();
      expect(screen.queryByTestId('signup-screen')).toBeNull();
    });
  });

  describe('Navigation Security Edge Cases', () => {
    it('should handle auth state changes correctly', () => {
      // Start unauthenticated
      const { rerender } = render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      // Initially show auth stack
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isError: false,
        session: null,
        user: null,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      rerender(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.queryByTestId('login-screen')).toBeTruthy();

      // Then authenticate
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser as User,
        session: mockSession as Session,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        isError: false,
        session: mockSession as Session,
        user: mockUser as User,
        error: null,
        refetch: jest.fn(),
        isInitialized: true,
      });

      rerender(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      expect(screen.queryByTestId('today-screen')).toBeTruthy();
      expect(screen.queryByTestId('login-screen')).toBeNull();
    });

    it('should handle auth errors securely', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: null,
        error: new Error('Auth error'),
        isError: true,
        isFetching: false,
        refetch: jest.fn(),
      });

      mockUseAuthContext.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        isError: true,
        session: null,
        user: null,
        error: new Error('Auth error'),
        refetch: jest.fn(),
        isInitialized: true,
      });

      render(
        <TestWrapper>
          <RootNavigator />
        </TestWrapper>
      );

      // Should fall back to auth stack on error
      expect(screen.queryByTestId('login-screen')).toBeTruthy();
      expect(screen.queryByTestId('today-screen')).toBeNull();
    });
  });
});
