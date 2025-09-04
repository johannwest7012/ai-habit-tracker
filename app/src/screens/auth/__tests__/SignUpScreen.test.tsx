import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUpScreen } from '../SignUpScreen';

// Mock the useAuth hook
const mockSignUp = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
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

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Join us to start tracking your habits')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
  });

  it('should validate email format', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const signUpButton = getByText('Create Account');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should validate password strength', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByText('Create Account');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('should validate password confirmation', async () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const signUpButton = getByText('Create Account');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'DifferentPassword');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('should call signUp with valid data', async () => {
    mockSignUp.mockResolvedValue({ success: true, needsVerification: false });

    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    const signUpButton = getByText('Create Account');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      });
    });
  });

  it('should navigate to login when "Sign In" is pressed', () => {
    const { getByText } = render(
      <SignUpScreen navigation={mockNavigation as any} route={{} as any} />
    );

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});