interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'production' | 'test';
}

const getConfig = (): EnvironmentConfig => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const environment =
    (process.env.EXPO_PUBLIC_ENV as EnvironmentConfig['environment']) ||
    'development';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Check your .env.local file.'
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    environment,
  };
};

export const config = getConfig();
