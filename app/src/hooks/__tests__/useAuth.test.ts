import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../useAuth';

// Mock the auth store
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    session: null,
    user: null,
    isLoading: false,
    isInitialized: true,
    error: null,
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
    initialize: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('useAuth', () => {
  it('should return auth state and methods', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isInitialized');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('signUp');
    expect(result.current).toHaveProperty('signIn');
    expect(result.current).toHaveProperty('signOut');
    expect(result.current).toHaveProperty('resetPassword');
    expect(result.current).toHaveProperty('clearError');
  });

  it('should calculate isAuthenticated correctly', () => {
    const { result } = renderHook(() => useAuth());

    // Should be false when no session/user
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should provide clearError method', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.clearError).toBe('function');
    
    act(() => {
      result.current.clearError();
    });

    // Should call setError with null
    // In a real test, we would verify the mock was called
  });
});