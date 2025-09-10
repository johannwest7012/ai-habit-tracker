import { logger } from '../utils/logger';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  static handle(error: unknown, context?: string): AppError {
    const timestamp = new Date();
    
    if (error instanceof Error) {
      const appError: AppError = {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: { stack: error.stack },
        timestamp,
      };

      if (error.message.includes('Network')) {
        appError.code = 'NETWORK_ERROR';
      } else if (error.message.includes('Auth')) {
        appError.code = 'AUTH_ERROR';
      } else if (error.message.includes('Supabase')) {
        appError.code = 'DATABASE_ERROR';
      }

      logger.error(`Error in ${context || 'Unknown context'}`, error, { context });
      return appError;
    }

    const appError: AppError = {
      code: 'UNKNOWN_ERROR',
      message: String(error),
      timestamp,
    };

    logger.error(`Non-Error thrown in ${context || 'Unknown context'}`, undefined, { 
      error: String(error),
      context 
    });

    return appError;
  }

  static isNetworkError(error: AppError): boolean {
    return error.code === 'NETWORK_ERROR';
  }

  static isAuthError(error: AppError): boolean {
    return error.code === 'AUTH_ERROR';
  }

  static isDatabaseError(error: AppError): boolean {
    return error.code === 'DATABASE_ERROR';
  }

  static getUserMessage(error: AppError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Network connection issue. Please check your internet connection.';
      case 'AUTH_ERROR':
        return 'Authentication failed. Please try logging in again.';
      case 'DATABASE_ERROR':
        return 'Unable to connect to the server. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}