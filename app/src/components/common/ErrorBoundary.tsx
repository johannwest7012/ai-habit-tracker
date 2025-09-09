/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child component tree and provides fallback UI
 * Following React Error Boundary patterns with logging integration
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { logger } from '../../services/logging/loggerService';
import { config } from '../../config/environment';
import type {
  ErrorBoundaryState,
  ErrorInfo,
  CrashReport,
} from '@shared/types/errors';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
    resetError: () => void;
  }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary component that catches and handles React errors
 */
export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  /**
   * Static method called when an error occurs during rendering
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Lifecycle method called after an error has been thrown
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Generate crash report
    const crashReport: CrashReport = {
      id: this.state.errorId || `crash-${Date.now()}`,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      deviceContext: {
        platform: 'react-native',
        appVersion: '1.0.0', // TODO: Get from app config
      },
      appState: {
        currentScreen: 'unknown', // TODO: Get from navigation state
      },
      environment: config.environment,
    };

    // Log error and report crash
    this.handleError(error, errorInfo, crashReport);

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Handle error logging and crash reporting
   */
  private async handleError(
    error: Error,
    errorInfo: ErrorInfo,
    crashReport: CrashReport
  ): Promise<void> {
    try {
      // Log the error
      await logger.error('React Error Boundary caught error', error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: errorInfo.errorBoundary,
        errorBoundaryStack: errorInfo.errorBoundaryStack,
        errorId: this.state.errorId,
      });

      // Report crash in production
      if (config.isProduction) {
        await logger.reportCrash(crashReport);
      }
    } catch (loggingError) {
      // Fallback to console if logging fails
      console.error('Failed to log error boundary error:', loggingError);
      console.error('Original error:', error);
      console.error('Error info:', errorInfo);
    }
  }

  /**
   * Reset error state to recover from error
   */
  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * Handle contact support action
   */
  private handleContactSupport = (): void => {
    const errorId = this.state.errorId;

    Alert.alert(
      'Contact Support',
      'You can contact support with the following information:',
      [
        {
          text: 'Copy Error ID',
          onPress: () => {
            // TODO: Implement clipboard copy
            Alert.alert('Error ID Copied', `Error ID: ${errorId}`);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.subtitle}>
              We encountered an unexpected error. Don&apos;t worry, we&apos;ve
              been notified and are working to fix it.
            </Text>

            {config.isDevelopment && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.name}: {this.state.error.message}
                </Text>
                {this.state.error.stack && (
                  <Text style={styles.debugStack}>
                    {this.state.error.stack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={this.resetError}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleContactSupport}
              >
                <Text style={styles.secondaryButtonText}>Contact Support</Text>
              </TouchableOpacity>
            </View>

            {this.state.errorId && (
              <Text style={styles.errorId}>Error ID: {this.state.errorId}</Text>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#dc3545',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  debugStack: {
    fontSize: 10,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  actionContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007bff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  errorId: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;