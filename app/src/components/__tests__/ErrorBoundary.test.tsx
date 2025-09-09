/**
 * ErrorBoundary Component Tests
 * Tests error catching, fallback UI, and error reporting integration
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { logger } from '../../services/logging/loggerService';
import { config } from '../../config/environment';

// Mock dependencies
jest.mock('../../services/logging/loggerService');
jest.mock('../../config/environment');
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

const mockLogger = logger as jest.Mocked<typeof logger>;
const mockConfig = config as jest.Mocked<typeof config>;
const mockAlert = Alert.alert as jest.Mock;

// Test component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <></>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig.isDevelopment = false;
    mockConfig.isProduction = false;
    mockConfig.environment = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Catching', () => {
    it('should catch and display error when child component throws', () => {
      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Initially should render children without error
      expect(() => getByText('Oops! Something went wrong')).toThrow();

      // Re-render with error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should display error UI
      expect(getByText('Oops! Something went wrong')).toBeTruthy();
      expect(getByText(/We encountered an unexpected error/)).toBeTruthy();
    });

    it('should call logger.error when error occurs', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'React Error Boundary caught error',
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
          errorId: expect.any(String),
        })
      );
    });

    it('should call onError callback when provided', () => {
      const onErrorCallback = jest.fn();
      const { rerender } = render(
        <ErrorBoundary onError={onErrorCallback}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary onError={onErrorCallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onErrorCallback).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('should report crash in production environment', () => {
      mockConfig.isProduction = true;

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockLogger.reportCrash).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          timestamp: expect.any(String),
          error: expect.objectContaining({
            name: 'Error',
            message: 'Test error',
          }),
          environment: 'test',
        })
      );
    });
  });

  describe('Fallback UI', () => {
    it('should display debug information in development', () => {
      mockConfig.isDevelopment = true;

      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getByText('Debug Information:')).toBeTruthy();
      expect(getByText('Error: Test error')).toBeTruthy();
    });

    it('should not display debug information in production', () => {
      mockConfig.isDevelopment = false;

      const { queryByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(queryByText('Debug Information:')).toBeNull();
    });

    it('should display error ID when available', () => {
      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getByText(/Error ID:/)).toBeTruthy();
    });

    it('should display Try Again and Contact Support buttons', () => {
      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getByText('Try Again')).toBeTruthy();
      expect(getByText('Contact Support')).toBeTruthy();
    });
  });

  describe('Error Recovery', () => {
    it('should reset error state when Try Again button is pressed', () => {
      const { getByText, queryByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Trigger error
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getByText('Oops! Something went wrong')).toBeTruthy();

      // Press Try Again
      fireEvent.press(getByText('Try Again'));

      // Should reset to children (though they will still throw in this test)
      // In real scenario, the children would be rendered again
      expect(queryByText('Oops! Something went wrong')).toBeNull();
    });

    it('should show contact support alert when Contact Support is pressed', () => {
      const { getByText, rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      fireEvent.press(getByText('Contact Support'));

      expect(mockAlert).toHaveBeenCalledWith(
        'Contact Support',
        'You can contact support with the following information:',
        expect.arrayContaining([
          expect.objectContaining({
            text: 'Copy Error ID',
          }),
          expect.objectContaining({
            text: 'Cancel',
            style: 'cancel',
          }),
        ])
      );
    });
  });

  describe('Custom Fallback Component', () => {
    const CustomFallback: React.FC<{
      error: Error;
      resetError: () => void;
    }> = ({ error, resetError }) => (
      <>
        <Text>Custom Error: {error.message}</Text>
        <TouchableOpacity onPress={resetError}>
          <Text>Custom Reset</Text>
        </TouchableOpacity>
      </>
    );

    it('should render custom fallback component when provided', () => {
      const { getByText, queryByText, rerender } = render(
        <ErrorBoundary fallbackComponent={CustomFallback}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary fallbackComponent={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(getByText('Custom Error: Test error')).toBeTruthy();
      expect(getByText('Custom Reset')).toBeTruthy();
      expect(queryByText('Oops! Something went wrong')).toBeNull();
    });
  });

  describe('Error Handling Failures', () => {
    it('should fallback to console logging when logger fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLogger.error.mockRejectedValue(new Error('Logger failed'));

      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to log error boundary error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Component Lifecycle', () => {
    it('should update state correctly in getDerivedStateFromError', () => {
      // This test verifies the static method behavior
      const error = new Error('Test error');
      const result = ErrorBoundary.getDerivedStateFromError(error);

      expect(result).toEqual({
        hasError: true,
        error,
        errorId: expect.stringMatching(/^error-\d+-[a-z0-9]+$/),
      });
    });

    it('should render children when no error occurs', () => {
      const { getByText } = render(
        <ErrorBoundary>
          <div>Test Child Component</div>
        </ErrorBoundary>
      );

      expect(getByText('Test Child Component')).toBeTruthy();
    });
  });
});
