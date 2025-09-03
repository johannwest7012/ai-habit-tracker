import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/providers/QueryProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { useAuthStore } from './src/stores/authStore';
import { supabase, testConnection } from './src/services/supabase';
import { logger } from './src/utils/logger';

export default function App() {
  const { setSession, setIsLoading } = useAuthStore();

  useEffect(() => {
    logger.info('App initializing');
    
    testConnection().then((connected) => {
      if (connected) {
        logger.info('Supabase connection test successful');
      } else {
        logger.warn('Supabase connection test failed');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      logger.info('Initial session loaded', { hasSession: !!session });
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      logger.info('Auth state changed', { event: _event, hasSession: !!session });
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, setIsLoading]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
