/**
 * Logging Service
 * Handles structured logging with Supabase integration
 * Following service layer pattern per coding standards
 */

import { config } from '../../config/environment';
import { getSupabaseClient } from '../api/supabaseClient';
import type {
  LogEntry,
  CrashReport,
  UnhandledErrorContext,
} from '@shared/types/errors';

/**
 * Logger class for centralized logging
 */
class Logger {
  private supabaseClient = getSupabaseClient();

  /**
   * Generate unique ID for log entries
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create base log entry with common fields
   */
  private createBaseLogEntry(
    level: LogEntry['level'],
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      id: this.generateId(),
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: config.environment,
      context,
    };
  }

  /**
   * Add user context to log entry if available
   */
  private async addUserContext(logEntry: LogEntry): Promise<LogEntry> {
    try {
      const {
        data: { user },
      } = await this.supabaseClient.auth.getUser();
      if (user) {
        logEntry.user = {
          id: user.id,
          email: user.email,
        };
      }
    } catch {
      // Silent fail - don't block logging if user context fails
    }
    return logEntry;
  }

  /**
   * Send log to Supabase (if in production) or console (if in development)
   */
  private async sendLog(logEntry: LogEntry): Promise<void> {
    // Always log to console in development
    if (config.isDevelopment) {
      const consoleMethod =
        logEntry.level === 'error'
          ? 'error'
          : logEntry.level === 'warn'
            ? 'warn'
            : 'log';
      console[consoleMethod](
        `[${logEntry.level.toUpperCase()}] ${logEntry.message}`,
        {
          timestamp: logEntry.timestamp,
          context: logEntry.context,
          error: logEntry.error,
        }
      );
    }

    // In production, send to Supabase logs
    if (config.isProduction) {
      try {
        // Using Supabase Edge Function for logging
        await this.supabaseClient.functions.invoke('log-entry', {
          body: { logEntry },
        });
      } catch (error) {
        // Fallback to console if Supabase logging fails
        console.error('Failed to send log to Supabase:', error);
        console.error('Original log entry:', logEntry);
      }
    }
  }

  /**
   * Log debug message
   */
  async debug(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    if (config.isDevelopment) {
      const logEntry = await this.addUserContext(
        this.createBaseLogEntry('debug', message, context)
      );
      await this.sendLog(logEntry);
    }
  }

  /**
   * Log info message
   */
  async info(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    const logEntry = await this.addUserContext(
      this.createBaseLogEntry('info', message, context)
    );
    await this.sendLog(logEntry);
  }

  /**
   * Log warning message
   */
  async warn(
    message: string,
    context?: Record<string, unknown>
  ): Promise<void> {
    const logEntry = await this.addUserContext(
      this.createBaseLogEntry('warn', message, context)
    );
    await this.sendLog(logEntry);
  }

  /**
   * Log error message with optional Error object
   */
  async error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    const logEntry = await this.addUserContext(
      this.createBaseLogEntry('error', message, context)
    );

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    await this.sendLog(logEntry);
  }

  /**
   * Report crash with detailed context
   */
  async reportCrash(crashReport: CrashReport): Promise<void> {
    try {
      // Send crash report to Supabase
      if (config.isProduction) {
        await this.supabaseClient.functions.invoke('crash-report', {
          body: { crashReport },
        });
      }

      // Also log as error for consistency
      await this.error(
        'Application crash reported',
        new Error(crashReport.error.message),
        {
          crashId: crashReport.id,
          errorInfo: crashReport.errorInfo,
          userContext: crashReport.userContext,
          deviceContext: crashReport.deviceContext,
          appState: crashReport.appState,
        }
      );
    } catch (error) {
      // Fallback logging
      console.error('Failed to report crash:', error);
      console.error('Original crash report:', crashReport);
    }
  }

  /**
   * Handle unhandled errors
   */
  async handleUnhandledError(context: UnhandledErrorContext): Promise<void> {
    const message = `Unhandled ${context.type} error: ${context.error.message}`;

    await this.error(message, context.error, {
      type: context.type,
      fatal: context.fatal,
      timestamp: context.timestamp,
      context: context.context,
    });

    // If fatal error, also create crash report
    if (context.fatal) {
      const crashReport: CrashReport = {
        id: this.generateId(),
        timestamp: context.timestamp,
        error: {
          name: context.error.name,
          message: context.error.message,
          stack: context.error.stack,
        },
        deviceContext: {
          platform: 'react-native',
          appVersion: '1.0.0', // TODO: Get from app config
        },
        appState: {
          currentScreen: 'unknown',
        },
        environment: config.environment,
      };

      await this.reportCrash(crashReport);
    }
  }
}

// Export singleton logger instance
export const logger = new Logger();

// Export Logger class for testing
export { Logger };