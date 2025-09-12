/**
 * Authentication Context
 * Provides app-wide authentication state management
 * Following React Context patterns and authentication standards
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '../services/api/supabaseClient';
import { useAuth as useAuthQuery } from '../hooks/useAuth';

/**
 * Authentication context value interface
 */
export interface AuthContextValue {
  // Authentication state
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  session: Session | null;
  user: User | null;
  error: Error | null;

  // Authentication actions (handled by hooks)
  refetch: () => void;

  // Auth state listeners
  isInitialized: boolean;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Hook to consume authentication context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}

/**
 * Authentication provider props
 */
export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages app-wide authentication state with Supabase Auth
 * Includes auth state change listeners and React Query integration
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [authChangeEvent, setAuthChangeEvent] =
    React.useState<AuthChangeEvent | null>(null);

  // Use the React Query auth hooks for state management
  const authQuery = useAuthQuery();

  /**
   * Handle auth state changes from Supabase
   */
  const handleAuthStateChange = useCallback(
    (event: AuthChangeEvent, session: Session | null) => {
      setAuthChangeEvent(event);

      // Refetch auth queries when auth state changes
      authQuery.refetch();

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.email);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed for user:', session?.user?.email);
          break;
        case 'USER_UPDATED':
          console.log('User updated:', session?.user?.email);
          break;
        case 'PASSWORD_RECOVERY':
          console.log('Password recovery initiated');
          break;
        default:
          break;
      }
    },
    [authQuery]
  );

  /**
   * Initialize auth state listener
   */
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const client = getSupabaseClient();

        // Set up auth state change listener
        const {
          data: { subscription },
        } = client.auth.onAuthStateChange(handleAuthStateChange);

        // Initial auth state check
        const {
          data: { session },
        } = await client.auth.getSession();

        if (isMounted) {
          if (session) {
            handleAuthStateChange('SIGNED_IN', session);
          }
          setIsInitialized(true);
        }

        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [handleAuthStateChange]);

  /**
   * Context value
   */
  const contextValue: AuthContextValue = {
    // Authentication state from React Query
    isAuthenticated: authQuery.isAuthenticated,
    isLoading: authQuery.isLoading,
    isError: authQuery.isError,
    session: authQuery.session || null,
    user: authQuery.user || null,
    error: authQuery.error as Error | null,

    // Authentication actions
    refetch: authQuery.refetch,

    // Initialization state
    isInitialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * Higher-order component to provide authentication context
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
}
