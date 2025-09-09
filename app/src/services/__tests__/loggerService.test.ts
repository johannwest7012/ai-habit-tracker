/**
 * Logger Service Tests
 * Tests logging functionality with different levels and environments
 */

import { Logger, logger } from '../logging/loggerService';
import { getSupabaseClient } from '../api/supabaseClient';
import { config } from '../../config/environment';
import type {
  CrashReport,
  UnhandledErrorContext,
} from '@shared/types/errors';

// Mock dependencies
jest.mock('../api/supabaseClient');
jest.mock('../../config/environment');

const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
  },
  functions: {
    invoke: jest.fn(),
  },
};

const mockGetSupabaseClient = getSupabaseClient as jest.Mock;
const mockConfig = config as jest.Mocked<typeof config>;

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('Logger Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSupabaseClient.mockReturnValue(mockSupabaseClient);
    mockConfig.environment = 'test';
    mockConfig.isDevelopment = false;
    mockConfig.isProduction = false;
    mockConfig.isTest = true;

    // Mock console methods
    jest.spyOn(console, 'log').mockImplementation(mockConsole.log);
    jest.spyOn(console, 'warn').mockImplementation(mockConsole.warn);
    jest.spyOn(console, 'error').mockImplementation(mockConsole.error);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Logger Instance', () => {
    it('should export a singleton logger instance', () => {
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should export Logger class for testing', () => {
      expect(Logger).toBeDefined();
      expect(typeof Logger).toBe('function');
    });
  });

  describe('Log Levels', () => {
    describe('debug', () => {
      it('should log debug messages in development', async () => {
        mockConfig.isDevelopment = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        await logger.debug('Debug message', { test: true });

        expect(mockConsole.log).toHaveBeenCalledWith(
          '[DEBUG] Debug message',
          expect.objectContaining({
            timestamp: expect.any(String),
            context: { test: true },
          })
        );
      });

      it('should not log debug messages in production', async () => {
        mockConfig.isDevelopment = false;
        mockConfig.isProduction = true;

        await logger.debug('Debug message', { test: true });

        expect(mockConsole.log).not.toHaveBeenCalled();
        expect(mockSupabaseClient.functions.invoke).not.toHaveBeenCalled();
      });
    });

    describe('info', () => {
      it('should log info messages', async () => {
        mockConfig.isDevelopment = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        await logger.info('Info message', { test: true });

        expect(mockConsole.log).toHaveBeenCalledWith(
          '[INFO] Info message',
          expect.objectContaining({
            timestamp: expect.any(String),
            context: { test: true },
          })
        );
      });

      it('should send info logs to Supabase in production', async () => {
        mockConfig.isDevelopment = false;
        mockConfig.isProduction = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        await logger.info('Info message', { test: true });

        expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
          'log-entry',
          {
            body: {
              logEntry: expect.objectContaining({
                level: 'info',
                message: 'Info message',
                environment: 'test',
                context: { test: true },
              }),
            },
          }
        );
      });
    });

    describe('warn', () => {
      it('should log warning messages', async () => {
        mockConfig.isDevelopment = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        await logger.warn('Warning message', { test: true });

        expect(mockConsole.warn).toHaveBeenCalledWith(
          '[WARN] Warning message',
          expect.objectContaining({
            timestamp: expect.any(String),
            context: { test: true },
          })
        );
      });
    });

    describe('error', () => {
      it('should log error messages with error object', async () => {
        mockConfig.isDevelopment = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        const testError = new Error('Test error');
        await logger.error('Error message', testError, { test: true });

        expect(mockConsole.error).toHaveBeenCalledWith(
          '[ERROR] Error message',
          expect.objectContaining({
            timestamp: expect.any(String),
            context: { test: true },
            error: {
              name: 'Error',
              message: 'Test error',
              stack: expect.any(String),
            },
          })
        );
      });

      it('should log error messages without error object', async () => {
        mockConfig.isDevelopment = true;
        mockSupabaseClient.auth.getUser.mockResolvedValue({
          data: { user: null },
        });

        await logger.error('Error message', undefined, { test: true });

        expect(mockConsole.error).toHaveBeenCalledWith(
          '[ERROR] Error message',
          expect.objectContaining({
            timestamp: expect.any(String),
            context: { test: true },
          })
        );
      });
    });
  });

  describe('User Context', () => {
    it('should include user context when user is authenticated', async () => {
      mockConfig.isDevelopment = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        },
      });

      await logger.info('Test message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        '[INFO] Test message',
        expect.objectContaining({
          user: {
            id: 'user-123',
            email: 'test@example.com',
          },
        })
      );
    });

    it('should handle user context failure gracefully', async () => {
      mockConfig.isDevelopment = true;
      mockSupabaseClient.auth.getUser.mockRejectedValue(
        new Error('Auth failed')
      );

      await logger.info('Test message');

      expect(mockConsole.log).toHaveBeenCalledWith(
        '[INFO] Test message',
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      );
    });
  });

  describe('Crash Reporting', () => {
    it('should report crash with detailed context', async () => {
      mockConfig.isProduction = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const crashReport: CrashReport = {
        id: 'crash-123',
        timestamp: new Date().toISOString(),
        error: {
          name: 'Error',
          message: 'Test crash',
          stack: 'Error stack trace',
        },
        deviceContext: {
          platform: 'react-native',
          appVersion: '1.0.0',
        },
        appState: {
          currentScreen: 'TestScreen',
        },
        environment: 'test',
      };

      await logger.reportCrash(crashReport);

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
        'crash-report',
        {
          body: { crashReport },
        }
      );
    });

    it('should fallback to console logging when crash reporting fails', async () => {
      mockConfig.isProduction = true;
      mockSupabaseClient.functions.invoke.mockRejectedValue(
        new Error('Network error')
      );

      const crashReport: CrashReport = {
        id: 'crash-123',
        timestamp: new Date().toISOString(),
        error: {
          name: 'Error',
          message: 'Test crash',
        },
        deviceContext: {
          platform: 'react-native',
          appVersion: '1.0.0',
        },
        appState: {
          currentScreen: 'TestScreen',
        },
        environment: 'test',
      };

      await logger.reportCrash(crashReport);

      expect(mockConsole.error).toHaveBeenCalledWith(
        'Failed to report crash:',
        expect.any(Error)
      );
      expect(mockConsole.error).toHaveBeenCalledWith(
        'Original crash report:',
        crashReport
      );
    });
  });

  describe('Unhandled Error Handling', () => {
    it('should handle unhandled JavaScript errors', async () => {
      mockConfig.isDevelopment = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const context: UnhandledErrorContext = {
        type: 'javascript',
        timestamp: new Date().toISOString(),
        error: new Error('Unhandled error'),
        fatal: true,
        context: {
          errorType: 'unhandled_js_error',
        },
      };

      await logger.handleUnhandledError(context);

      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ERROR] Unhandled javascript error: Unhandled error',
        expect.objectContaining({
          error: {
            name: 'Error',
            message: 'Unhandled error',
            stack: expect.any(String),
          },
          context: {
            type: 'javascript',
            fatal: true,
            timestamp: context.timestamp,
            context: context.context,
          },
        })
      );
    });

    it('should handle unhandled Promise rejections', async () => {
      mockConfig.isDevelopment = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const context: UnhandledErrorContext = {
        type: 'promise_rejection',
        timestamp: new Date().toISOString(),
        error: new Error('Promise rejection'),
        fatal: false,
        context: {
          errorType: 'unhandled_promise_rejection',
        },
      };

      await logger.handleUnhandledError(context);

      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ERROR] Unhandled promise_rejection error: Promise rejection',
        expect.objectContaining({
          context: {
            type: 'promise_rejection',
            fatal: false,
            timestamp: context.timestamp,
            context: context.context,
          },
        })
      );
    });

    it('should create crash report for fatal errors', async () => {
      mockConfig.isProduction = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      const context: UnhandledErrorContext = {
        type: 'javascript',
        timestamp: new Date().toISOString(),
        error: new Error('Fatal error'),
        fatal: true,
      };

      await logger.handleUnhandledError(context);

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
        'crash-report',
        expect.objectContaining({
          body: {
            crashReport: expect.objectContaining({
              error: {
                name: 'Error',
                message: 'Fatal error',
                stack: expect.any(String),
              },
              environment: 'test',
            }),
          },
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should fallback to console when Supabase logging fails', async () => {
      mockConfig.isProduction = true;
      mockSupabaseClient.functions.invoke.mockRejectedValue(
        new Error('Network error')
      );
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await logger.info('Test message');

      expect(mockConsole.error).toHaveBeenCalledWith(
        'Failed to send log to Supabase:',
        expect.any(Error)
      );
    });
  });

  describe('Log Entry Structure', () => {
    it('should create log entries with correct structure', async () => {
      mockConfig.isDevelopment = true;
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await logger.info('Test message', { custom: 'context' });

      expect(mockConsole.log).toHaveBeenCalledWith(
        '[INFO] Test message',
        expect.objectContaining({
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
          ),
          context: { custom: 'context' },
        })
      );
    });

    it('should generate unique IDs for log entries', () => {
      const logger1 = new Logger();
      const logger2 = new Logger();

      // Access private method for testing
      const generateId1 = (logger1 as unknown as { generateId: () => string }).generateId();
      const generateId2 = (logger2 as unknown as { generateId: () => string }).generateId();

      expect(generateId1).not.toBe(generateId2);
      expect(typeof generateId1).toBe('string');
      expect(typeof generateId2).toBe('string');
    });
  });
});