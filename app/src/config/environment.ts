/**
 * Environment configuration following coding standards
 * Access environment variables only through config objects, never process.env directly
 * Source: architecture/coding-standards.md#critical-fullstack-rules
 */

export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'production' | 'test';
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

/**
 * Get environment configuration with proper typing and validation
 * @param env Optional environment variables for testing (defaults to process.env)
 * @returns EnvironmentConfig object with all required environment variables
 */
export function getEnvironmentConfig(
  env: Record<string, string | undefined> = process.env
): EnvironmentConfig {
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const environment =
    (env.EXPO_PUBLIC_ENVIRONMENT as EnvironmentConfig['environment']) ||
    'development';

  // Validate required environment variables
  if (!supabaseUrl) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_URL environment variable is required'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable is required'
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
    isTest: environment === 'test',
  };
}

// Lazy-loaded singleton config object
let _config: EnvironmentConfig | null = null;

export const config: EnvironmentConfig = new Proxy({} as EnvironmentConfig, {
  get(target, prop) {
    if (_config === null) {
      _config = getEnvironmentConfig();
    }
    return _config[prop as keyof EnvironmentConfig];
  },
});

// For testing: reset the cached config
export function resetEnvironmentConfig(): void {
  _config = null;
}
