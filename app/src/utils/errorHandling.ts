/**
 * Error Handling Utilities
 * Global error handlers and utility functions for error management
 */

import { logger } from '../services/logging/loggerService';
import { config } from '../config/environment';
import type { UnhandledErrorContext, CrashReport } from '@shared/types/errors';

// React Native global error handler interface
interface RNErrorUtils {
  getGlobalHandler(): ((error: Error, isFatal: boolean) => void) | null;
  setGlobalHandler(handler: (error: Error, isFatal: boolean) => void): void;
}

interface RNGlobal {
  ErrorUtils?: RNErrorUtils;
  onunhandledrejection?: (event: { reason: unknown }) => void;
}

/**
 * Setup global error handlers for React Native
 */
export function setupGlobalErrorHandlers(): void {
  const globalObj = global as unknown as RNGlobal;

  // Handle unhandled JavaScript errors
  if (globalObj.ErrorUtils) {
    const originalErrorHandler = globalObj.ErrorUtils.getGlobalHandler();

    globalObj.ErrorUtils.setGlobalHandler(
      (error: Error, isFatal: boolean) => {
        const context: UnhandledErrorContext = {
          type: 'javascript',
          timestamp: new Date().toISOString(),
          error,
          fatal: isFatal,
          context: {
            isFatal,
            errorType: 'unhandled_js_error',
          },
        };

        // Log the unhandled error
        logger.handleUnhandledError(context);

        // Call original handler to maintain default behavior
        if (originalErrorHandler) {
          originalErrorHandler(error, isFatal);
        }
      }
    );
  }

  // Handle unhandled Promise rejections
  const originalUnhandledRejection = globalObj.onunhandledrejection;

  globalObj.onunhandledrejection = (event: { reason: unknown }) => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    const context: UnhandledErrorContext = {
      type: 'promise_rejection',
      timestamp: new Date().toISOString(),
      error,
      fatal: false,
      context: {
        reason: event.reason,
        errorType: 'unhandled_promise_rejection',
      },
    };

    // Log the unhandled promise rejection
    logger.handleUnhandledError(context);

    // Call original handler if exists
    if (originalUnhandledRejection) {
      originalUnhandledRejection(event);
    }
  };

  // Log that error handlers are setup
  logger.info('Global error handlers initialized', {
    environment: config.environment,
    hasErrorUtils: !!globalObj.ErrorUtils,
  });
}

/**
 * Create standardized error report
 */
export function createErrorReport(
  error: Error,
  context: Record<string, unknown> = {}
): CrashReport {
  return {
    id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    deviceContext: {
      platform: 'react-native',
      appVersion: '1.0.0', // TODO: Get from app config
    },
    appState: {
      currentScreen: 'unknown', // TODO: Get from navigation state
      ...context,
    },
    environment: config.environment,
  };
}

/**
 * Handle and report async operation errors
 */
export async function handleAsyncError(
  error: Error,
  operation: string,
  context: Record<string, unknown> = {}
): Promise<void> {
  try {
    await logger.error(`Async operation failed: ${operation}`, error, {
      operation,
      ...context,
    });

    // Create crash report for critical errors in production
    if (config.isProduction && isCriticalError(error)) {
      const crashReport = createErrorReport(error, {
        operation,
        ...context,
      });
      await logger.reportCrash(crashReport);
    }
  } catch (loggingError) {
    // Fallback to console if logging fails
    console.error('Failed to handle async error:', loggingError);
    console.error('Original error:', error);
  }
}

/**
 * Determine if an error is critical and should trigger crash reporting
 */
export function isCriticalError(error: Error): boolean {
  const criticalPatterns = [
    /network error/i,
    /timeout/i,
    /unauthorized/i,
    /forbidden/i,
    /server error/i,
    /database/i,
    /connection/i,
  ];

  const errorMessage = error.message.toLowerCase();
  return criticalPatterns.some((pattern) => pattern.test(errorMessage));
}

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      await handleAsyncError(errorObj, operation, {
        args: args.length > 0 ? { argCount: args.length } : undefined,
      });
      throw error; // Re-throw to maintain original behavior
    }
  };
}

/**
 * Create user-friendly error messages
 */
export function getUserFriendlyErrorMessage(error: Error): string {
  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (errorMessage.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }

  if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
    return 'You need to sign in to access this feature.';
  }

  if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
    return "You don't have permission to perform this action.";
  }

  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'The requested resource was not found.';
  }

  if (errorMessage.includes('server') || errorMessage.includes('500')) {
    return 'A server error occurred. Please try again later.';
  }

  // Default message for unknown errors
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log performance metrics with error context
 */
export async function logPerformanceError(
  operation: string,
  duration: number,
  threshold: number = 5000
): Promise<void> {
  if (duration > threshold) {
    await logger.warn('Performance threshold exceeded', {
      operation,
      duration,
      threshold,
      performanceIssue: true,
    });
  }
}