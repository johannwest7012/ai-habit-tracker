import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { createQueryClient, setupQueryPersistence } from './src/services/api/queryClient';

// Initialize query client
const queryClient = createQueryClient();

export default function App() {
  useEffect(() => {
    // Setup query persistence on app start
    setupQueryPersistence().catch((error) => {
      console.error('Failed to setup query persistence:', error);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
