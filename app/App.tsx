import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from './src/providers/QueryProvider';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { testConnection } from './src/services/supabase';
import { logger } from './src/utils/logger';

export default function App() {
  useEffect(() => {
    logger.info('App initializing');
    
    testConnection().then((connected) => {
      if (connected) {
        logger.info('Supabase connection test successful');
      } else {
        logger.warn('Supabase connection test failed');
      }
    });
  }, []);

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
