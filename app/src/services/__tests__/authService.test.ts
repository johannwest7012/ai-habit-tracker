import { AuthService } from '../authService';

import { supabase } from '../supabase';

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));
const mockSupabase = supabase;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const mockData = {
        user: { id: 'test-id', email: 'test@example.com' },
        session: { access_token: 'token' },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.needsVerification).toBe(false);
    });

    it('should handle sign up requiring email verification', async () => {
      const mockData = {
        user: { id: 'test-id', email: 'test@example.com' },
        session: null, // No session means verification needed
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.needsVerification).toBe(true);
    });

    it('should handle sign up error', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      });

      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        code: 'User already registered',
        message: 'An account with this email already exists. Please sign in instead.',
      });
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const mockData = {
        user: { id: 'test-id', email: 'test@example.com' },
        session: { access_token: 'token' },
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
    });

    it('should handle sign in error', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      });

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      expect(result.success).toBe(false);
      expect(result.error).toEqual({
        code: 'Invalid login credentials',
        message: 'Invalid email or password. Please check your credentials and try again.',
      });
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null });

      const result = await AuthService.signOut();

      expect(result.success).toBe(true);
    });

    it('should handle sign out error', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      });

      const result = await AuthService.signOut();

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Sign out failed');
    });
  });

  describe('resetPassword', () => {
    it('should successfully request password reset', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await AuthService.resetPassword({
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
    });

    it('should handle password reset error', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Unable to validate email address: invalid format' },
      });

      const result = await AuthService.resetPassword({
        email: 'invalid-email',
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Please enter a valid email address.');
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const mockUser = { id: 'test-id', email: 'test@example.com' };
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await AuthService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
    });

    it('should handle get user error', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await AuthService.getCurrentUser();

      expect(result.success).toBe(false);
    });
  });

  describe('getCurrentSession', () => {
    it('should successfully get current session', async () => {
      const mockSession = { access_token: 'token', user: { id: 'test-id' } };
      
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await AuthService.getCurrentSession();

      expect(result.success).toBe(true);
      expect(result.session).toEqual(mockSession);
    });
  });
});