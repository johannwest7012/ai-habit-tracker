/**
 * WelcomeScreen Component Tests
 * Testing core messaging display and navigation functionality
 * Following minimal testing approach - "Test the Money, Not the Framework"
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import WelcomeScreen from '../WelcomeScreen';

// Mock navigation
const mockNavigate = jest.fn();
const mockGetParent = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  getParent: mockGetParent,
} as const;

describe('WelcomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock parent navigation for auth navigation
    mockGetParent.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  const renderWelcomeScreen = () => {
    return render(
      <WelcomeScreen navigation={mockNavigation} route={{} as const} />
    );
  };

  describe('Core Messaging Display', () => {
    it('should display main headline about AI-guided habit formation', () => {
      renderWelcomeScreen();

      expect(screen.getByText('AI-Guided Habit Formation')).toBeTruthy();
    });

    it('should display subtitle explaining personal growth companion', () => {
      renderWelcomeScreen();

      expect(
        screen.getByText(
          'Your personal growth companion that adapts to your journey'
        )
      ).toBeTruthy();
    });

    it('should display value proposition emphasizing guidance over tracking', () => {
      renderWelcomeScreen();

      // Check for key parts of the value proposition
      expect(
        screen.getByText(
          /Unlike traditional habit trackers that focus on rigid streaks/
        )
      ).toBeTruthy();
      expect(
        screen.getByText(/shame-free approach to building lasting habits/)
      ).toBeTruthy();
      expect(screen.getByText(/AI adapts to your struggles/)).toBeTruthy();
    });

    it('should display key benefits list', () => {
      renderWelcomeScreen();

      expect(
        screen.getByText('Personalized guidance that learns from your patterns')
      ).toBeTruthy();
      expect(
        screen.getByText('Weekly stages that build gradually toward success')
      ).toBeTruthy();
      expect(
        screen.getByText('Adaptive recalibration when life gets in the way')
      ).toBeTruthy();
    });

    it('should display brand logo placeholder', () => {
      renderWelcomeScreen();

      // Check for the emoji logo (plant seedling representing growth)
      expect(screen.getByText('🌱')).toBeTruthy();
    });
  });

  describe('Call-to-Action Navigation', () => {
    it('should navigate to GoalSetup when Start Your Journey button is pressed', () => {
      renderWelcomeScreen();

      const getStartedButton = screen.getByTestId('get-started-button');
      fireEvent.press(getStartedButton);

      expect(mockNavigate).toHaveBeenCalledWith('GoalSetup');
    });

    it('should navigate to Auth SignIn when sign in link is pressed', () => {
      renderWelcomeScreen();

      const signInLink = screen.getByTestId('sign-in-link');
      fireEvent.press(signInLink);

      expect(mockGetParent).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('Auth', { screen: 'SignIn' });
    });

    it('should display primary call-to-action button text', () => {
      renderWelcomeScreen();

      const getStartedButton = screen.getByTestId('get-started-button');
      expect(getStartedButton).toBeTruthy();
      expect(screen.getByText('Start Your Journey')).toBeTruthy();
    });

    it('should display secondary sign in text', () => {
      renderWelcomeScreen();

      expect(screen.getByText('Already have an account? Sign In')).toBeTruthy();
    });
  });

  describe('Screen Layout and Accessibility', () => {
    it('should render without crashing', () => {
      const { getByTestId } = renderWelcomeScreen();

      // Check that main interactive elements are present
      expect(getByTestId('get-started-button')).toBeTruthy();
      expect(getByTestId('sign-in-link')).toBeTruthy();
    });

    it('should have proper test IDs for interactive elements', () => {
      renderWelcomeScreen();

      expect(screen.getByTestId('get-started-button')).toBeTruthy();
      expect(screen.getByTestId('sign-in-link')).toBeTruthy();
    });

    it('should display all core content sections', () => {
      renderWelcomeScreen();

      // Verify all main content is present
      expect(screen.getByText('AI-Guided Habit Formation')).toBeTruthy();
      expect(screen.getByText('Start Your Journey')).toBeTruthy();
      expect(screen.getByText('Already have an account? Sign In')).toBeTruthy();
    });
  });

  describe('Brand Aesthetic Elements', () => {
    it('should display decorative elements', () => {
      renderWelcomeScreen();

      // Component should render successfully with decorative elements
      // (specific styling elements are tested through visual inspection)
      expect(screen.getByText('🌱')).toBeTruthy();
    });
  });
});
