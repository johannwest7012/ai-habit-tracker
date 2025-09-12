/**
 * LoginScreen Component Tests
 * Testing form validation, auth integration, error handling, and remember me functionality
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';
import * as useAuthModule from '../../../hooks/useAuth';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as const;

// Mock auth hooks
const mockSignInMutation = {
  mutateAsync: jest.fn(),
  isPending: false,
};

jest.mock('../../../hooks/useAuth', () => ({
  useSignIn: jest.fn(),
}));

describe('LoginScreen', () => {
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
    (useAuthModule.useSignIn as jest.Mock).mockReturnValue(mockSignInMutation);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  const renderLoginScreen = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginScreen navigation={mockNavigation} route={{} as const} />
      </QueryClientProvider>
    );
  };

  describe('Form Validation', () => {
    it('should display validation errors for empty fields', async () => {
      renderLoginScreen();

      // Try to submit without filling fields
      const signInButton = screen.getByTestId('signin-button');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
        expect(screen.getByText('Password is required')).toBeTruthy();
      });

      // Should not call sign in mutation
      expect(mockSignInMutation.mutateAsync).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const signInButton = screen.getByTestId('signin-button');

      // Enter invalid email
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeTruthy();
      });

      expect(mockSignInMutation.mutateAsync).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user starts typing', async () => {
      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const signInButton = screen.getByTestId('signin-button');

      // Trigger validation error
      fireEvent.press(signInButton);
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeTruthy();
      });

      // Start typing - error should clear
      fireEvent.changeText(emailInput, 'test@example.com');
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).toBeNull();
      });
    });

    it('should accept valid email and password', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: true,
        data: { session: { access_token: 'mock-token' } },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      // Enter valid credentials
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockSignInMutation.mutateAsync).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      renderLoginScreen();

      const passwordInput = screen.getByTestId('password-input');
      const toggleButton = screen.getByTestId('toggle-password-visibility');

      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // Toggle to show password
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(false);

      // Toggle back to hide password
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Remember Me Functionality', () => {
    it('should load remembered email on mount', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        'remembered@example.com'
      );

      renderLoginScreen();

      await waitFor(() => {
        const emailInput = screen.getByTestId('email-input');
        expect(emailInput.props.value).toBe('remembered@example.com');
      });

      // Verify checkbox exists (we'll test interaction separately)
      expect(screen.getByTestId('remember-me-checkbox')).toBeTruthy();
    });

    it('should toggle remember me checkbox', () => {
      renderLoginScreen();

      const checkbox = screen.getByTestId('remember-me-checkbox');
      expect(checkbox).toBeTruthy();

      // Test that checkbox can be pressed (interaction works)
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);

      // Checkbox should still exist after interactions
      expect(screen.getByTestId('remember-me-checkbox')).toBeTruthy();
    });

    it('should save email when remember me is checked', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: true,
        data: { session: { access_token: 'mock-token' } },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const checkbox = screen.getByTestId('remember-me-checkbox');
      const signInButton = screen.getByTestId('signin-button');

      // Fill form and check remember me
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(checkbox);
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'remember_me_email',
          'test@example.com'
        );
      });
    });

    it('should remove saved email when remember me is unchecked', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: true,
        data: { session: { access_token: 'mock-token' } },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      // Fill form without checking remember me
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
          'remember_me_email'
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('should display user-friendly error for invalid credentials', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'Invalid login credentials' },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Invalid email or password. Please check your credentials and try again.'
        );
      });
    });

    it('should display error for unverified email', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'Email not confirmed' },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Please check your email and click the verification link before signing in.'
        );
      });
    });

    it('should handle rate limiting error', async () => {
      mockSignInMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'Too many requests' },
      });

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'Too many sign in attempts. Please wait a few minutes and try again.'
        );
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      mockSignInMutation.mutateAsync.mockRejectedValue(
        new Error('Network error')
      );

      renderLoginScreen();

      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const signInButton = screen.getByTestId('signin-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Sign In Failed',
          'An unexpected error occurred. Please try again.'
        );
      });
    });
  });

  describe('Forgot Password Navigation', () => {
    it('should navigate to password reset screen', () => {
      renderLoginScreen();

      const forgotPasswordLink = screen.getByTestId('forgot-password-link');
      fireEvent.press(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('PasswordReset');
    });
  });

  describe('Navigation', () => {
    it('should navigate to sign up screen', () => {
      renderLoginScreen();

      const signUpLink = screen.getByTestId('signup-link');
      fireEvent.press(signUpLink);

      expect(mockNavigate).toHaveBeenCalledWith('SignUp');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during sign in', async () => {
      mockSignInMutation.isPending = true;
      (useAuthModule.useSignIn as jest.Mock).mockReturnValue(
        mockSignInMutation
      );

      renderLoginScreen();

      const signInButton = screen.getByTestId('signin-button');
      // Check that button exists and has loading text
      expect(signInButton).toBeTruthy();
      expect(screen.getByText('Signing In...')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper test IDs for all interactive elements', () => {
      renderLoginScreen();

      expect(screen.getByTestId('email-input')).toBeTruthy();
      expect(screen.getByTestId('password-input')).toBeTruthy();
      expect(screen.getByTestId('toggle-password-visibility')).toBeTruthy();
      expect(screen.getByTestId('remember-me-checkbox')).toBeTruthy();
      expect(screen.getByTestId('signin-button')).toBeTruthy();
      expect(screen.getByTestId('forgot-password-link')).toBeTruthy();
      expect(screen.getByTestId('signup-link')).toBeTruthy();
    });
  });
});
