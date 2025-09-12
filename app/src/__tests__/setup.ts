// Set up Jest for React Native testing

// Mock environment variables for testing
// Note: Jest doesn't automatically load .env files like Expo does at runtime,
// so we need to explicitly set environment variables for tests to work properly
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.EXPO_PUBLIC_ENV = 'test';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
