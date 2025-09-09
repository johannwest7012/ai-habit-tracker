import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { createQueryClient, setupQueryPersistence } from './src/services/api/queryClient';
import { setupGlobalErrorHandlers } from './src/utils/errorHandling';
import { logger } from './src/services/logging/loggerService';

// Initialize query client
const queryClient = createQueryClient();

export default function App() {
  useEffect(() => {
    // Setup global error handlers
    setupGlobalErrorHandlers();

    // Setup query persistence on app start
    setupQueryPersistence().catch((error) => {
      logger.error('Failed to setup query persistence', error);
    });

    // Log app startup
    logger.info('Application started');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
