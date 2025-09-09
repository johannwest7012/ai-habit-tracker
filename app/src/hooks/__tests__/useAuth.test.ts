/**
 * Authentication Hooks Tests
 * Unit tests for authentication React Query hooks
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSupabaseClient } from '../../services/api/supabaseClient';
import {
  useSession,
  useUser,
  useSignIn,
  useSignOut,
  useAuth,
  authQueryKeys,
} from '../useAuth';

// Mock Supabase client
jest.mock('../../services/api/supabaseClient', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockSupabaseClient = getSupabaseClient as jest.MockedFunction<typeof getSupabaseClient>;

// Test wrapper with QueryClient
function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('Authentication Hooks', () => {
  const mockSession = {
    access_token: 'mock-token',
    user: {
      id: 'user-123',
      email: 'test@example.com',
    },
  };

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    created_at: '2023-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authQueryKeys', () => {
    it('should generate correct query keys', () => {
      expect(authQueryKeys.all).toEqual(['auth']);
      expect(authQueryKeys.session()).toEqual(['auth', 'session']);
      expect(authQueryKeys.user()).toEqual(['auth', 'user']);
    });
  });

  describe('useSession', () => {
    it('should fetch session successfully', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSession);
      expect(mockAuthClient.getSession).toHaveBeenCalled();
    });

    it('should handle session fetch error', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Session expired' },
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });

    it('should not retry on auth errors', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Unauthorized' },
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      renderHook(() => useSession(), { wrapper });

      await waitFor(() => {
        expect(mockAuthClient.getSession).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useUser', () => {
    it('should fetch user successfully', async () => {
      const mockAuthClient = {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockUser);
      expect(mockAuthClient.getUser).toHaveBeenCalled();
    });

    it('should handle user fetch error', async () => {
      const mockAuthClient = {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'User not found' },
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useUser(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe('useSignIn', () => {
    it('should sign in successfully', async () => {
      const mockAuthClient = {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSignIn(), { wrapper });

      const signInData = { email: 'test@example.com', password: 'password123' };
      result.current.mutate(signInData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockAuthClient.signInWithPassword).toHaveBeenCalledWith(signInData);
      expect(result.current.data?.success).toBe(true);
    });

    it('should handle sign in error', async () => {
      const mockAuthClient = {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { session: null },
          error: { message: 'Invalid credentials' },
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSignIn(), { wrapper });

      const signInData = { email: 'test@example.com', password: 'wrong-password' };
      result.current.mutate(signInData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useSignOut', () => {
    it('should sign out successfully', async () => {
      const mockAuthClient = {
        signOut: jest.fn().mockResolvedValue({
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSignOut(), { wrapper });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockAuthClient.signOut).toHaveBeenCalled();
      expect(result.current.data?.success).toBe(true);
    });

    it('should handle sign out error', async () => {
      const mockAuthClient = {
        signOut: jest.fn().mockResolvedValue({
          error: { message: 'Sign out failed' },
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useSignOut(), { wrapper });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useAuth', () => {
    it('should return combined authentication state', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    it('should show not authenticated when session or user missing', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.user).toBeNull();
    });

    it('should handle loading states correctly', () => {
      const mockAuthClient = {
        getSession: jest.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should provide refetch function', async () => {
      const mockAuthClient = {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession },
          error: null,
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      };
      mockSupabaseClient.mockReturnValue({ auth: mockAuthClient } as any);

      const wrapper = createTestWrapper();
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(typeof result.current.refetch).toBe('function');
      
      // Test refetch functionality
      result.current.refetch();
      
      // Should call both getSession and getUser again
      await waitFor(() => {
        expect(mockAuthClient.getSession).toHaveBeenCalledTimes(2);
        expect(mockAuthClient.getUser).toHaveBeenCalledTimes(2);
      });
    });
  });
});