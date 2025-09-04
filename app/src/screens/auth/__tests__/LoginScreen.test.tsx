import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { LoginScreen } from '../LoginScreen';

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock the useAuth hook
const mockSignIn = jest.fn();
const mockResetPassword = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    resetPassword: mockResetPassword,
    isLoading: false,
    error: null,
    clearError: mockClearError,
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue tracking your habits')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('should validate required fields', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('should validate email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should call signIn with valid credentials', async () => {
    mockSignIn.mockResolvedValue({ success: true });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle forgot password', async () => {
    mockResetPassword.mockResolvedValue({ success: true });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const forgotPasswordButton = getByText('Forgot Password?');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Password Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [{ text: 'OK' }]
      );
    });
  });

  it('should require email for password reset', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const forgotPasswordButton = getByText('Forgot Password?');
    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Email Required',
        'Please enter your email address first.'
      );
    });
  });

  it('should navigate to sign up', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const createAccountButton = getByText('Create Account');
    fireEvent.press(createAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});