import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    session,
    user,
    isLoading,
    isInitialized,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    initialize,
    setError,
  } = useAuthStore();

  const isAuthenticated = !!session && !!user;

  // Auto-initialize auth state on first use
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    session,
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    error,
    
    // Actions  
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };
};