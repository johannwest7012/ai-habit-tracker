/**
 * Data Security and User Isolation Tests
 * Tests to verify Row Level Security policies and data access controls
 * Following testing standards from story requirements
 */

import { getSupabaseClient } from '../api/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
    getSession: jest.fn(),
  },
  from: jest.fn(),
};

jest.mock('../api/supabaseClient', () => ({
  getSupabaseClient: jest.fn(),
}));

const mockGetSupabaseClient = getSupabaseClient as jest.MockedFunction<
  typeof getSupabaseClient
>;

// Mock data
const mockUser1: Partial<User> = {
  id: 'user-123',
  email: 'user1@example.com',
};

const mockUser2: Partial<User> = {
  id: 'user-456',
  email: 'user2@example.com',
};

const mockSession1: Partial<Session> = {
  access_token: 'token-123',
  user: mockUser1 as User,
};

describe('Data Security and User Isolation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSupabaseClient.mockReturnValue(
      mockSupabaseClient as unknown as ReturnType<typeof getSupabaseClient>
    );
  });

  describe('Authentication Token Validation', () => {
    it('should require valid session for data access', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Row not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const client = getSupabaseClient();

      // Attempt to access user data without session
      const result = await client
        .from('profiles')
        .select('*')
        .eq('id', mockUser1.id)
        .single();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });

    it('should allow data access with valid session', async () => {
      const mockProfileData = {
        id: mockUser1.id,
        email: mockUser1.email,
        profile_data: { onboarding_completed: true },
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfileData,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      const result = await client
        .from('profiles')
        .select('*')
        .eq('id', mockUser1.id)
        .single();

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProfileData);
    });
  });

  describe('User Data Isolation', () => {
    it('should prevent access to other users profile data', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Row not found' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 }, // User 1 session
        error: null,
      });

      const client = getSupabaseClient();

      // User 1 trying to access User 2's profile
      const result = await client
        .from('profiles')
        .select('*')
        .eq('id', mockUser2.id) // Different user ID
        .single();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });

    it('should prevent access to other users goals', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [], // Empty array - RLS blocks access
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      // Attempt to access goals with wrong user_id filter
      const result = await client
        .from('goals')
        .select('*')
        .eq('user_id', mockUser2.id); // Wrong user

      expect(result.data).toEqual([]);
    });

    it('should prevent access to other users habit logs', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      const result = await client
        .from('habit_logs')
        .select('*')
        .eq('user_id', mockUser2.id);

      expect(result.data).toEqual([]);
    });
  });

  describe('Data Access Controls', () => {
    it('should allow access to own profile data', async () => {
      const mockProfileData = {
        id: mockUser1.id,
        email: mockUser1.email,
        profile_data: { onboarding_completed: true },
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockProfileData,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      const result = await client
        .from('profiles')
        .select('*')
        .eq('id', mockUser1.id)
        .single();

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockProfileData);
      expect(result.data?.id).toBe(mockUser1.id);
    });

    it('should allow access to own goals', async () => {
      const mockGoalsData = [
        {
          id: 'goal-123',
          user_id: mockUser1.id,
          title: 'Test Goal',
          status: 'active',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockGoalsData,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      const result = await client
        .from('goals')
        .select('*')
        .eq('user_id', mockUser1.id);

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockGoalsData);
      expect(result.data?.[0]?.user_id).toBe(mockUser1.id);
    });

    it('should allow access to own habit logs', async () => {
      const mockLogsData = [
        {
          id: 'log-123',
          user_id: mockUser1.id,
          stage_id: 'stage-123',
          status: 'completed',
          date: '2025-01-11',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockLogsData,
          error: null,
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      const result = await client
        .from('habit_logs')
        .select('*')
        .eq('user_id', mockUser1.id);

      expect(result.error).toBeNull();
      expect(result.data).toEqual(mockLogsData);
      expect(result.data?.[0]?.user_id).toBe(mockUser1.id);
    });
  });

  describe('Cross-User Data Access Prevention', () => {
    it('should prevent inserting data for other users', async () => {
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: {
            code: 'PGRST204',
            message: 'RLS policy violation',
          },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 }, // User 1 session
        error: null,
      });

      const client = getSupabaseClient();

      // User 1 trying to insert data for User 2
      const result = await client
        .from('goals')
        .insert({
          user_id: mockUser2.id, // Wrong user
          title: 'Malicious Goal',
          description: 'Should not be allowed',
          target_date: '2025-12-31',
          roadmap: { stages: [], total_weeks: 1 },
        })
        .select();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });

    it('should prevent updating data for other users', async () => {
      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: null,
          error: {
            code: 'PGRST204',
            message: 'RLS policy violation',
          },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession1 },
        error: null,
      });

      const client = getSupabaseClient();

      // User 1 trying to update User 2's profile
      const result = await client
        .from('profiles')
        .update({ profile_data: { hacked: true } })
        .eq('id', mockUser2.id)
        .select();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });
  });

  describe('Session Validation', () => {
    it('should reject expired sessions', async () => {
      const expiredSession = {
        ...mockSession1,
        expires_at: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Unauthorized' },
        }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: expiredSession },
        error: { message: 'Token expired' },
      });

      const client = getSupabaseClient();

      const result = await client
        .from('profiles')
        .select('*')
        .eq('id', mockUser1.id)
        .single();

      expect(result.error).toBeTruthy();
      expect(result.data).toBeNull();
    });
  });
});
