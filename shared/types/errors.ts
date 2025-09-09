/**
 * Error types for error boundary and logging system
 * Following type sharing standards per coding standards
 */

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string | null;
  errorBoundaryStack?: string | null;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  environment: 'development' | 'production' | 'test';
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  user?: {
    id?: string;
    email?: string;
  };
  device?: {
    platform?: string;
    version?: string;
  };
}

export interface CrashReport {
  id: string;
  timestamp: string;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  errorInfo?: ErrorInfo;
  userContext?: {
    id?: string;
    authenticated: boolean;
    lastAction?: string;
  };
  deviceContext: {
    platform: string;
    appVersion: string;
    osVersion?: string;
    deviceModel?: string;
  };
  appState: {
    currentScreen?: string;
    navigationState?: Record<string, any>;
    memoryUsage?: number;
  };
  environment: 'development' | 'production' | 'test';
}

export interface UnhandledErrorContext {
  type: 'javascript' | 'promise_rejection' | 'native';
  timestamp: string;
  error: Error;
  fatal: boolean;
  context?: Record<string, any>;
}