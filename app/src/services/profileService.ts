import { supabase } from './supabase';
import type { User, ProfileData, NotificationPreferences } from '../../../shared/types/models';

export class ProfileService {
  static async getCurrentUserProfile(): Promise<{ success: boolean; profile?: User; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: { message: 'No authenticated user' } };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        profile: {
          id: data.id,
          email: data.email,
          created_at: data.created_at,
          profile_data: data.profile_data,
          subscription_tier: data.subscription_tier,
          notification_preferences: data.notification_preferences,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'profile_fetch_failed',
          message: error.message || 'Failed to fetch profile',
        },
      };
    }
  }

  static async updateProfile(updates: {
    profile_data?: Partial<ProfileData>;
    notification_preferences?: Partial<NotificationPreferences>;
  }): Promise<{ success: boolean; error?: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: { message: 'No authenticated user' } };
      }

      const updateData: any = {};
      
      if (updates.profile_data) {
        // Get current profile data and merge with updates
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('profile_data')
          .eq('id', user.id)
          .single();

        updateData.profile_data = {
          ...(currentProfile?.profile_data || {}),
          ...updates.profile_data,
        };
      }

      if (updates.notification_preferences) {
        // Get current notification preferences and merge with updates
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('notification_preferences')
          .eq('id', user.id)
          .single();

        updateData.notification_preferences = {
          ...(currentProfile?.notification_preferences || {}),
          ...updates.notification_preferences,
        };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'profile_update_failed',
          message: error.message || 'Failed to update profile',
        },
      };
    }
  }

  static async completeOnboarding(): Promise<{ success: boolean; error?: any }> {
    return this.updateProfile({
      profile_data: { onboarding_completed: true },
    });
  }
}