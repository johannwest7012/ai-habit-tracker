import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../common/ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <Text>No error</Text>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('renders error UI when error is thrown', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Oops, something went wrong!')).toBeTruthy();
    expect(getByText('Test error')).toBeTruthy();
  });

  it('resets error state when Try Again is pressed', () => {
    let shouldThrow = true;
    const DynamicThrowError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <Text>No error</Text>;
    };

    const { getByText } = render(
      <ErrorBoundary>
        <DynamicThrowError />
      </ErrorBoundary>
    );

    expect(getByText('Oops, something went wrong!')).toBeTruthy();

    // Change the condition before pressing Try Again
    shouldThrow = false;

    fireEvent.press(getByText('Try Again'));

    expect(getByText('No error')).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = <Text>Custom error UI</Text>;

    const { getByText } = render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error UI')).toBeTruthy();
  });
});
