/**
 * Protected Route Component
 * Wrapper component that checks auth state before rendering children
 * Provides loading states and automatic redirect logic for unauthenticated users
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

/**
 * Protected Route Props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

/**
 * Loading Screen Component
 * Displays during auth state validation
 */
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

/**
 * Protected Route Component
 * Checks authentication state before rendering children
 *
 * Behavior:
 * - Shows loading screen during auth state check
 * - Returns null if not authenticated (handled by parent navigation)
 * - Renders children if authenticated
 *
 * @param children - Components to render when authenticated
 * @param fallback - Custom fallback component when not authenticated
 * @param showLoading - Whether to show loading indicator (default: true)
 */
export default function ProtectedRoute({
  children,
  fallback = null,
  showLoading = true,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, session } = useAuth();

  // Show loading screen during auth state validation
  if (isLoading && showLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, return fallback or null
  // Navigation logic handled by parent RootNavigator
  if (!isAuthenticated || !user || !session) {
    return fallback as React.ReactElement;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}

/**
 * Higher-order component for protected routes
 * Wraps a component with authentication protection
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook to check if current route should be protected
 * Useful for conditional rendering in navigation components
 */
export function useRouteProtection() {
  const { isAuthenticated, isLoading, user, session } = useAuth();

  return {
    isAuthenticated: isAuthenticated && !!user && !!session,
    isLoading,
    shouldRedirectToAuth: !isLoading && !isAuthenticated,
    shouldShowLoading: isLoading,
  };
}

/**
 * Styles for loading screen
 */
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
