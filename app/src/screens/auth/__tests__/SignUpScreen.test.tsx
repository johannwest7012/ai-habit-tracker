/**
 * SignUpScreen Tests
 * Focus on form validation logic and error handling
 * Following "Test the Money, Not the Framework" philosophy
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUpScreen from '../SignUpScreen';
import { useSignUp } from '../../../hooks/useAuth';

// Mock the useSignUp hook
jest.mock('../../../hooks/useAuth');
const mockUseSignUp = useSignUp as jest.MockedFunction<typeof useSignUp>;

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
} as { navigate: jest.Mock };

// Mock Alert
jest.spyOn(Alert, 'alert');

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('SignUpScreen', () => {
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSignUp.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as unknown as ReturnType<typeof useSignUp>);
  });

  describe('Form Validation', () => {
    it('shows error when email is empty', async () => {
      const { getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Email is required')).toBeTruthy();
      });
    });

    it('shows error when email format is invalid', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'invalid-email');

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Please enter a valid email address')).toBeTruthy();
      });
    });

    it('shows error when display name is empty', async () => {
      const { getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Display name is required')).toBeTruthy();
      });
    });

    it('shows error when display name is too short', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const displayNameInput = getByPlaceholderText('Enter your display name');
      fireEvent.changeText(displayNameInput, 'A');

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(
          getByText('Display name must be at least 2 characters')
        ).toBeTruthy();
      });
    });

    it('shows error when password is empty', async () => {
      const { getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Password is required')).toBeTruthy();
      });
    });

    it('shows error when password does not meet requirements', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const passwordInput = getByPlaceholderText('Enter your password');
      fireEvent.changeText(passwordInput, '123'); // Too short, no letters

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(
          getByText(
            'Password must be at least 8 characters with letters and numbers'
          )
        ).toBeTruthy();
      });
    });

    it('shows error when passwords do not match', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const passwordInput = getByPlaceholderText('Enter your password');
      const confirmPasswordInput = getByPlaceholderText(
        'Confirm your password'
      );

      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmPasswordInput, 'different123');

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Passwords do not match')).toBeTruthy();
      });
    });

    it('clears errors when user starts typing in field', async () => {
      const { getByPlaceholderText, getByText, queryByText, getByTestId } =
        render(
          <TestWrapper>
            <SignUpScreen navigation={mockNavigation} />
          </TestWrapper>
        );

      // Trigger validation error
      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(getByText('Email is required')).toBeTruthy();
      });

      // Start typing in email field
      const emailInput = getByPlaceholderText('Enter your email');
      fireEvent.changeText(emailInput, 'user@example.com');

      // Error should be cleared
      expect(queryByText('Email is required')).toBeNull();
    });
  });

  describe('Form Submission', () => {
    it('calls signUp with correct data when form is valid', async () => {
      mockMutateAsync.mockResolvedValue({
        success: true,
        data: { user: { id: '123' }, session: { access_token: 'token' } },
      });

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      // Fill in valid form data
      fireEvent.changeText(
        getByPlaceholderText('Enter your display name'),
        'Test User'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your email'),
        'test@example.com'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your password'),
        'password123'
      );
      fireEvent.changeText(
        getByPlaceholderText('Confirm your password'),
        'password123'
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        });
      });
    });

    it('shows success alert and navigates to SignIn on successful registration', async () => {
      mockMutateAsync.mockResolvedValue({
        success: true,
        data: { user: { id: '123' }, session: { access_token: 'token' } },
      });

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      // Fill in valid form data
      fireEvent.changeText(
        getByPlaceholderText('Enter your display name'),
        'Test User'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your email'),
        'test@example.com'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your password'),
        'password123'
      );
      fireEvent.changeText(
        getByPlaceholderText('Confirm your password'),
        'password123'
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Registration Successful',
          'Please check your email for verification instructions.',
          [{ text: 'OK', onPress: expect.any(Function) }]
        );
      });
    });

    it('shows error alert on registration failure', async () => {
      mockMutateAsync.mockResolvedValue({
        success: false,
        error: { message: 'Email already exists' },
      });

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      // Fill in valid form data
      fireEvent.changeText(
        getByPlaceholderText('Enter your display name'),
        'Test User'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your email'),
        'test@example.com'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your password'),
        'password123'
      );
      fireEvent.changeText(
        getByPlaceholderText('Confirm your password'),
        'password123'
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Registration Failed',
          'Email already exists'
        );
      });
    });

    it('handles unexpected errors gracefully', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Network error'));

      const { getByPlaceholderText, getByTestId } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      // Fill in valid form data
      fireEvent.changeText(
        getByPlaceholderText('Enter your display name'),
        'Test User'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your email'),
        'test@example.com'
      );
      fireEvent.changeText(
        getByPlaceholderText('Enter your password'),
        'password123'
      );
      fireEvent.changeText(
        getByPlaceholderText('Confirm your password'),
        'password123'
      );

      const signUpButton = getByTestId('signup-button');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Registration Failed',
          'An unexpected error occurred. Please try again.'
        );
      });
    });
  });

  describe('UI Interactions', () => {
    it('toggles password visibility when eye button is pressed', () => {
      const { getByPlaceholderText, getAllByText } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const passwordInput = getByPlaceholderText('Enter your password');
      const eyeButtons = getAllByText('🙈');

      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // Press eye button to show password
      fireEvent.press(eyeButtons[0]);
      expect(passwordInput.props.secureTextEntry).toBe(false);

      // Press again to hide password
      fireEvent.press(eyeButtons[0]);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });

    it('navigates to SignIn when sign in link is pressed', () => {
      const { getByText } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      const signInLink = getByText('Sign In');
      fireEvent.press(signInLink);

      expect(mockNavigate).toHaveBeenCalledWith('SignIn');
    });

    it('shows loading state during form submission', () => {
      mockUseSignUp.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      } as unknown as ReturnType<typeof useSignUp>);

      const { getByText } = render(
        <TestWrapper>
          <SignUpScreen navigation={mockNavigation} />
        </TestWrapper>
      );

      expect(getByText('Creating Account...')).toBeTruthy();
    });
  });
});
