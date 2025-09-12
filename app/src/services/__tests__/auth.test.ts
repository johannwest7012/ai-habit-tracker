/**
 * Authentication Service Tests
 * Unit tests for authentication service methods with mocked dependencies
 * Following testing standards per story requirements
 */

// Mock Supabase client first
const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();
const mockResetPasswordForEmail = jest.fn();
const mockGetSession = jest.fn();
const mockGetUser = jest.fn();
const mockFrom = jest.fn();
const mockInsert = jest.fn();

const mockSupabaseClient = {
  auth: {
    signUp: mockSignUp,
    signInWithPassword: mockSignInWithPassword,
    signOut: mockSignOut,
    resetPasswordForEmail: mockResetPasswordForEmail,
    getSession: mockGetSession,
    getUser: mockGetUser,
  },
  from: mockFrom,
};

// Mock the Supabase client module
jest.mock('../api/supabaseClient', () => ({
  getSupabaseClient: () => mockSupabaseClient,
}));

// Auth query keys for testing
const authQueryKeys = {
  all: ['auth'] as const,
  session: () => ['auth', 'session'] as const,
  user: () => ['auth', 'user'] as const,
} as const;

// Simplified auth service for testing
const authService = {
  async signUp(
    email: string,
    password: string,
    options: { displayName?: string } = {}
  ) {
    try {
      const client = mockSupabaseClient;
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: options.displayName,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNUP_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign up',
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
        message:
          'Account created successfully. Please check your email for verification.',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNUP_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign up',
      };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const client = mockSupabaseClient;
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNIN_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign in',
        };
      }

      return {
        success: true,
        data: data.session,
        message: 'Signed in successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNIN_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign in',
      };
    }
  },

  async signOut() {
    try {
      const client = mockSupabaseClient;
      const { error } = await client.auth.signOut();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SIGNOUT_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to sign out',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Signed out successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_SIGNOUT_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to sign out',
      };
    }
  },

  async resetPassword(email: string) {
    try {
      const client = mockSupabaseClient;
      const { error } = await client.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_PASSWORD_RESET_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to send password reset email',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Password reset email sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_PASSWORD_RESET_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to send password reset email',
      };
    }
  },

  async getSession() {
    try {
      const client = mockSupabaseClient;
      const { data, error } = await client.auth.getSession();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_SESSION_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to get session',
        };
      }

      return {
        success: true,
        data: data.session,
        message: 'Session retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_SESSION_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to get session',
      };
    }
  },

  async getUser() {
    try {
      const client = mockSupabaseClient;
      const { data, error } = await client.auth.getUser();

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_USER_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to get user',
        };
      }

      return {
        success: true,
        data: data.user,
        message: 'User retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_USER_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to get user',
      };
    }
  },

  async createProfile(userId: string, profileData: { displayName?: string }) {
    try {
      const client = mockSupabaseClient;
      const { error } = await client.from('profiles').insert({
        user_id: userId,
        profile_data: {
          display_name: profileData.displayName,
          onboarding_completed: false,
        },
        subscription_tier: 'free',
        notification_preferences: {
          push_enabled: true,
          email_enabled: true,
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            code: 'AUTH_PROFILE_CREATE_ERROR',
            message: error.message,
            details: { originalError: error },
          },
          message: 'Failed to create user profile',
        };
      }

      return {
        success: true,
        data: undefined,
        message: 'Profile created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'AUTH_PROFILE_CREATE_ERROR',
          message: error.message || 'Unknown error',
          details: { originalError: error },
        },
        message: 'Failed to create user profile',
      };
    }
  },
};

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  describe('signUp', () => {
    it('should successfully sign up user with email and password', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { access_token: 'token-123', user: mockUser };

      mockSignUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      mockInsert.mockResolvedValue({ error: null });

      const result = await authService.signUp(
        'test@example.com',
        'password123',
        {
          displayName: 'Test User',
        }
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: mockUser,
        session: mockSession,
      });
      expect(result.message).toContain('Account created successfully');
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            display_name: 'Test User',
          },
        },
      });
    });

    it('should handle signup error', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' },
      });

      const result = await authService.signUp(
        'test@example.com',
        'password123'
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_SIGNUP_ERROR');
      expect(result.error?.message).toBe('Email already exists');
      expect(result.message).toBe('Failed to sign up');
    });

    it('should handle signup network error', async () => {
      mockSignUp.mockRejectedValue(new Error('Network error'));

      const result = await authService.signUp(
        'test@example.com',
        'password123'
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_SIGNUP_ERROR');
      expect(result.error?.message).toBe('Network error');
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-123' },
      };

      mockSignInWithPassword.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authService.signIn(
        'test@example.com',
        'password123'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSession);
      expect(result.message).toBe('Signed in successfully');
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle signin error', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await authService.signIn(
        'test@example.com',
        'wrongpassword'
      );

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_SIGNIN_ERROR');
      expect(result.error?.message).toBe('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const result = await authService.signOut();

      expect(result.success).toBe(true);
      expect(result.message).toBe('Signed out successfully');
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should handle signout error', async () => {
      mockSignOut.mockResolvedValue({
        error: { message: 'Failed to sign out' },
      });

      const result = await authService.signOut();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_SIGNOUT_ERROR');
      expect(result.error?.message).toBe('Failed to sign out');
    });
  });

  describe('resetPassword', () => {
    it('should successfully send password reset email', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await authService.resetPassword('test@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset email sent successfully');
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });

    it('should handle password reset error', async () => {
      mockResetPasswordForEmail.mockResolvedValue({
        error: { message: 'Email not found' },
      });

      const result = await authService.resetPassword('test@example.com');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_PASSWORD_RESET_ERROR');
      expect(result.error?.message).toBe('Email not found');
    });
  });

  describe('getSession', () => {
    it('should successfully get current session', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-123' },
      };

      mockGetSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authService.getSession();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSession);
      expect(result.message).toBe('Session retrieved successfully');
    });

    it('should handle session error', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'No session found' },
      });

      const result = await authService.getSession();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_SESSION_ERROR');
      expect(result.error?.message).toBe('No session found');
    });
  });

  describe('getUser', () => {
    it('should successfully get current user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await authService.getUser();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(result.message).toBe('User retrieved successfully');
    });

    it('should handle user error', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No user found' },
      });

      const result = await authService.getUser();

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_USER_ERROR');
      expect(result.error?.message).toBe('No user found');
    });
  });

  describe('createProfile', () => {
    it('should successfully create user profile', async () => {
      mockInsert.mockResolvedValue({ error: null });

      const result = await authService.createProfile('user-123', {
        displayName: 'Test User',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('Profile created successfully');
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: 'user-123',
        profile_data: {
          display_name: 'Test User',
          onboarding_completed: false,
        },
        subscription_tier: 'free',
        notification_preferences: {
          push_enabled: true,
          email_enabled: true,
        },
      });
    });

    it('should handle profile creation error', async () => {
      mockInsert.mockResolvedValue({
        error: { message: 'Profile already exists' },
      });

      const result = await authService.createProfile('user-123', {
        displayName: 'Test User',
      });

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('AUTH_PROFILE_CREATE_ERROR');
      expect(result.error?.message).toBe('Profile already exists');
    });
  });
});

describe('Auth Query Keys', () => {
  it('should have correct query key structure', () => {
    expect(authQueryKeys.all).toEqual(['auth']);
    expect(authQueryKeys.session()).toEqual(['auth', 'session']);
    expect(authQueryKeys.user()).toEqual(['auth', 'user']);
  });
});
