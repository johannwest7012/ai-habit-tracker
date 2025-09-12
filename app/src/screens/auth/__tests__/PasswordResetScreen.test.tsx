/**
 * PasswordResetScreen Component Tests
 * Testing email validation, password reset flow, error handling, and navigation
 * Following "Test the Money, Not the Framework" philosophy
 */

import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Alert } from 'react-native';
import PasswordResetScreen from '../PasswordResetScreen';
import * as useAuthModule from '../../../hooks/useAuth';

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as const;

// Mock password reset hook
const mockPasswordResetMutation = {
  mutateAsync: jest.fn(),
  isPending: false,
};

jest.mock('../../../hooks/useAuth', () => ({
  usePasswordReset: jest.fn(),
}));

describe('PasswordResetScreen', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Reset mocks
    jest.clearAllMocks();
    (useAuthModule.usePasswordReset as jest.Mock).mockReturnValue(
      mockPasswordResetMutation
    );
  });

  const renderPasswordResetScreen = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PasswordResetScreen navigation={mockNavigation} route={{} as const} />
      </QueryClientProvider>
    );
  };

  describe('Form Validation', () => {
    it('should display validation error for empty email', async () => {
      renderPasswordResetScreen();

      const resetButton = screen.getByTestId('reset-button');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
      });

      expect(mockPasswordResetMutation.mutateAsync).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeTruthy();
      });

      expect(mockPasswordResetMutation.mutateAsync).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user starts typing', async () => {
      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      // Trigger validation error
      fireEvent.press(resetButton);
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
      });

      // Start typing - error should clear
      fireEvent.changeText(emailInput, 'test@example.com');
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).toBeNull();
      });
    });
  });

  describe('Password Reset Flow', () => {
    it('should send reset email and navigate to confirmation for valid email', async () => {
      mockPasswordResetMutation.mutateAsync.mockResolvedValue({
        success: true,
      });

      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(mockPasswordResetMutation.mutateAsync).toHaveBeenCalledWith({
          email: 'test@example.com',
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('PasswordResetConfirmation', {
        email: 'test@example.com',
      });
    });

    it('should handle rate limiting error gracefully', async () => {
      mockPasswordResetMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'Rate limit exceeded' },
      });

      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Reset Failed',
          'Too many reset attempts. Please wait a few minutes and try again.'
        );
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle invalid email error securely', async () => {
      mockPasswordResetMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'User not found' },
      });

      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.changeText(emailInput, 'nonexistent@example.com');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Reset Failed',
          'If an account with this email exists, we will send password reset instructions.'
        );
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      mockPasswordResetMutation.mutateAsync.mockRejectedValue(
        new Error('Network error')
      );

      renderPasswordResetScreen();

      const emailInput = screen.getByTestId('email-input');
      const resetButton = screen.getByTestId('reset-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(resetButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Reset Failed',
          'An unexpected error occurred. Please try again.'
        );
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back to SignIn screen', () => {
      renderPasswordResetScreen();

      const backToSignInLink = screen.getByTestId('back-to-signin-link');
      fireEvent.press(backToSignInLink);

      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during password reset', () => {
      mockPasswordResetMutation.isPending = true;
      (useAuthModule.usePasswordReset as jest.Mock).mockReturnValue(
        mockPasswordResetMutation
      );

      renderPasswordResetScreen();

      const resetButton = screen.getByTestId('reset-button');
      expect(screen.getByText('Sending Reset Email...')).toBeTruthy();
      expect(resetButton.props.accessibilityState?.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper test IDs for all interactive elements', () => {
      renderPasswordResetScreen();

      expect(screen.getByTestId('email-input')).toBeTruthy();
      expect(screen.getByTestId('reset-button')).toBeTruthy();
      expect(screen.getByTestId('back-to-signin-link')).toBeTruthy();
    });
  });
});
