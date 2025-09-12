/**
 * Protected Route Component Tests
 * Security-focused tests for route protection and authentication guards
 * Following testing standards from story requirements
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Text, View } from 'react-native';
import type { User, Session } from '@supabase/supabase-js';
import ProtectedRoute, {
  withProtectedRoute,
  useRouteProtection,
} from '../ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Test components
const TestComponent = () => (
  <View testID="protected-content">
    <Text>Protected Content</Text>
  </View>
);

const TestFallback = () => (
  <View testID="fallback-content">
    <Text>Access Denied</Text>
  </View>
);

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

describe('ProtectedRoute Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication State Protection', () => {
    it('should show loading screen during auth check', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeTruthy();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should hide loading when showLoading is false', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <ProtectedRoute showLoading={false}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should render null when not authenticated (no fallback)', () => {
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

      const result = render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(result.toJSON()).toBeNull();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should render fallback when not authenticated with custom fallback', () => {
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

      render(
        <TestWrapper>
          <ProtectedRoute fallback={<TestFallback />}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('fallback-content')).toBeTruthy();
      expect(screen.getByText('Access Denied')).toBeTruthy();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should block access when user exists but no session', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: mockUser as User,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <ProtectedRoute fallback={<TestFallback />}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('fallback-content')).toBeTruthy();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should block access when session exists but no user', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        session: mockSession as Session,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <ProtectedRoute fallback={<TestFallback />}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('fallback-content')).toBeTruthy();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should render protected content when fully authenticated', () => {
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

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeTruthy();
      expect(screen.getByText('Protected Content')).toBeTruthy();
      expect(screen.queryByText('Loading...')).toBeNull();
    });
  });

  describe('Higher-Order Component Security', () => {
    it('should protect wrapped component from unauthorized access', () => {
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

      const ProtectedTestComponent = withProtectedRoute(TestComponent);

      const result = render(
        <TestWrapper>
          <ProtectedTestComponent />
        </TestWrapper>
      );

      expect(result.toJSON()).toBeNull();
      expect(screen.queryByTestId('protected-content')).toBeNull();
    });

    it('should render wrapped component when authenticated', () => {
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

      const ProtectedTestComponent = withProtectedRoute(TestComponent);

      render(
        <TestWrapper>
          <ProtectedTestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeTruthy();
    });
  });

  describe('Route Protection Hook', () => {
    it('should return correct protection state for unauthenticated user', () => {
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

      const TestHookComponent = () => {
        const protection = useRouteProtection();
        return (
          <View>
            <Text testID="is-authenticated">
              {String(protection.isAuthenticated)}
            </Text>
            <Text testID="should-redirect">
              {String(protection.shouldRedirectToAuth)}
            </Text>
            <Text testID="should-show-loading">
              {String(protection.shouldShowLoading)}
            </Text>
          </View>
        );
      };

      render(
        <TestWrapper>
          <TestHookComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('is-authenticated').props.children).toBe(
        'false'
      );
      expect(screen.getByTestId('should-redirect').props.children).toBe('true');
      expect(screen.getByTestId('should-show-loading').props.children).toBe(
        'false'
      );
    });

    it('should return correct protection state for authenticated user', () => {
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

      const TestHookComponent = () => {
        const protection = useRouteProtection();
        return (
          <View>
            <Text testID="is-authenticated">
              {String(protection.isAuthenticated)}
            </Text>
            <Text testID="should-redirect">
              {String(protection.shouldRedirectToAuth)}
            </Text>
            <Text testID="should-show-loading">
              {String(protection.shouldShowLoading)}
            </Text>
          </View>
        );
      };

      render(
        <TestWrapper>
          <TestHookComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('is-authenticated').props.children).toBe(
        'true'
      );
      expect(screen.getByTestId('should-redirect').props.children).toBe(
        'false'
      );
      expect(screen.getByTestId('should-show-loading').props.children).toBe(
        'false'
      );
    });

    it('should show loading state during auth check', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        session: null,
        error: null,
        isError: false,
        isFetching: false,
        refetch: jest.fn(),
      });

      const TestHookComponent = () => {
        const protection = useRouteProtection();
        return (
          <View>
            <Text testID="should-show-loading">
              {String(protection.shouldShowLoading)}
            </Text>
            <Text testID="should-redirect">
              {String(protection.shouldRedirectToAuth)}
            </Text>
          </View>
        );
      };

      render(
        <TestWrapper>
          <TestHookComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('should-show-loading').props.children).toBe(
        'true'
      );
      expect(screen.getByTestId('should-redirect').props.children).toBe(
        'false'
      );
    });
  });
});
