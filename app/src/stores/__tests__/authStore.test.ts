import { useAuthStore } from '../authStore';
import { Session, User } from '@supabase/supabase-js';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      user: null,
      isLoading: true,
    });
  });

  it('initializes with default values', () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  it('sets session and updates user', () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User;

    const mockSession: Session = {
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: mockUser,
    } as Session;

    useAuthStore.getState().setSession(mockSession);

    const state = useAuthStore.getState();
    expect(state.session).toBe(mockSession);
    expect(state.user).toBe(mockUser);
  });

  it('sets session to null and clears user', () => {
    useAuthStore.getState().setSession(null);

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
  });

  it('sets user independently', () => {
    const mockUser: User = {
      id: 'user-456',
      email: 'another@example.com',
    } as User;

    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toBe(mockUser);
  });

  it('sets loading state', () => {
    useAuthStore.getState().setIsLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    useAuthStore.getState().setIsLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('resets store to initial state', () => {
    const mockUser: User = {
      id: 'user-789',
      email: 'reset@example.com',
    } as User;

    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setIsLoading(true);

    useAuthStore.getState().reset();

    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});