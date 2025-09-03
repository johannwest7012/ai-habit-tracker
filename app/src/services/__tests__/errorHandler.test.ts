import { ErrorHandler } from '../errorHandler';

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('handles Error instances correctly', () => {
      const error = new Error('Test error');
      const result = ErrorHandler.handle(error, 'TestContext');

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('Test error');
      expect(result.details).toHaveProperty('stack');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('identifies network errors', () => {
      const error = new Error('Network request failed');
      const result = ErrorHandler.handle(error);

      expect(result.code).toBe('NETWORK_ERROR');
    });

    it('identifies auth errors', () => {
      const error = new Error('Auth session expired');
      const result = ErrorHandler.handle(error);

      expect(result.code).toBe('AUTH_ERROR');
    });

    it('identifies database errors', () => {
      const error = new Error('Supabase connection failed');
      const result = ErrorHandler.handle(error);

      expect(result.code).toBe('DATABASE_ERROR');
    });

    it('handles non-Error objects', () => {
      const result = ErrorHandler.handle('String error');

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('String error');
    });
  });

  describe('error type checks', () => {
    it('correctly identifies network errors', () => {
      const error = { code: 'NETWORK_ERROR', message: 'test', timestamp: new Date() };
      expect(ErrorHandler.isNetworkError(error)).toBe(true);
      expect(ErrorHandler.isAuthError(error)).toBe(false);
    });

    it('correctly identifies auth errors', () => {
      const error = { code: 'AUTH_ERROR', message: 'test', timestamp: new Date() };
      expect(ErrorHandler.isAuthError(error)).toBe(true);
      expect(ErrorHandler.isNetworkError(error)).toBe(false);
    });

    it('correctly identifies database errors', () => {
      const error = { code: 'DATABASE_ERROR', message: 'test', timestamp: new Date() };
      expect(ErrorHandler.isDatabaseError(error)).toBe(true);
      expect(ErrorHandler.isAuthError(error)).toBe(false);
    });
  });

  describe('getUserMessage', () => {
    it('returns appropriate message for network errors', () => {
      const error = { code: 'NETWORK_ERROR', message: 'test', timestamp: new Date() };
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Network connection issue. Please check your internet connection.');
    });

    it('returns appropriate message for auth errors', () => {
      const error = { code: 'AUTH_ERROR', message: 'test', timestamp: new Date() };
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Authentication failed. Please try logging in again.');
    });

    it('returns appropriate message for database errors', () => {
      const error = { code: 'DATABASE_ERROR', message: 'test', timestamp: new Date() };
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('Unable to connect to the server. Please try again later.');
    });

    it('returns default message for unknown errors', () => {
      const error = { code: 'UNKNOWN_ERROR', message: 'test', timestamp: new Date() };
      const message = ErrorHandler.getUserMessage(error);
      expect(message).toBe('An unexpected error occurred. Please try again.');
    });
  });
});