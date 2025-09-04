import { ProfileService } from '../profileService';

import { supabase } from '../supabase';

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}));
const mockSupabase = supabase;

describe('ProfileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUserProfile', () => {
    it('should successfully get user profile', async () => {
      const mockUser = { id: 'test-id' };
      const mockProfile = {
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2023-01-01',
        profile_data: { timezone: 'UTC', onboarding_completed: false },
        subscription_tier: 'free',
        notification_preferences: { daily_reminder: true },
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelect),
      });

      const result = await ProfileService.getCurrentUserProfile();

      expect(result.success).toBe(true);
      expect(result.profile).toEqual({
        id: 'test-id',
        email: 'test@example.com',
        created_at: '2023-01-01',
        profile_data: { timezone: 'UTC', onboarding_completed: false },
        subscription_tier: 'free',
        notification_preferences: { daily_reminder: true },
      });
    });

    it('should handle no authenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const result = await ProfileService.getCurrentUserProfile();

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('No authenticated user');
    });

    it('should handle profile fetch error', async () => {
      const mockUser = { id: 'test-id' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const mockSelect = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Profile not found' },
          }),
        })),
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelect),
      });

      const result = await ProfileService.getCurrentUserProfile();

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Profile not found');
    });
  });

  describe('updateProfile', () => {
    it('should successfully update profile data', async () => {
      const mockUser = { id: 'test-id' };
      const currentProfileData = { timezone: 'UTC', onboarding_completed: false };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      // Mock getting current profile data
      const mockSelectForCurrent = {
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { profile_data: currentProfileData },
            error: null,
          }),
        })),
      };

      // Mock update operation
      const mockUpdate = {
        eq: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => mockSelectForCurrent),
        })
        .mockReturnValueOnce({
          update: jest.fn(() => mockUpdate),
        });

      const result = await ProfileService.updateProfile({
        profile_data: { name: 'John Doe' },
      });

      expect(result.success).toBe(true);
    });

    it('should handle update error', async () => {
      const mockUser = { id: 'test-id' };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const mockUpdate = {
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Update failed' },
        }),
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => mockUpdate),
      });

      const result = await ProfileService.updateProfile({
        profile_data: { name: 'John Doe' },
      });

      expect(result.success).toBe(false);
      expect(result.error.message).toBe('Update failed');
    });
  });

  describe('completeOnboarding', () => {
    it('should call updateProfile with onboarding_completed: true', async () => {
      const spy = jest.spyOn(ProfileService, 'updateProfile');
      spy.mockResolvedValue({ success: true });

      await ProfileService.completeOnboarding();

      expect(spy).toHaveBeenCalledWith({
        profile_data: { onboarding_completed: true },
      });

      spy.mockRestore();
    });
  });
});