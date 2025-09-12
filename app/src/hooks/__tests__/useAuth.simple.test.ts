/**
 * Authentication Hooks Tests - Simplified
 * Unit tests for authentication query keys and basic functionality
 */

import { authQueryKeys } from '../useAuth';

describe('Auth Query Keys', () => {
  it('should have correct query key structure', () => {
    expect(authQueryKeys.all).toEqual(['auth']);
    expect(authQueryKeys.session()).toEqual(['auth', 'session']);
    expect(authQueryKeys.user()).toEqual(['auth', 'user']);
  });

  it('should maintain consistency in key naming', () => {
    const sessionKey = authQueryKeys.session();
    const userKey = authQueryKeys.user();

    expect(sessionKey[0]).toBe(authQueryKeys.all[0]);
    expect(userKey[0]).toBe(authQueryKeys.all[0]);

    expect(sessionKey[1]).toBe('session');
    expect(userKey[1]).toBe('user');
  });

  it('should return new arrays each time for dynamic keys', () => {
    const sessionKey1 = authQueryKeys.session();
    const sessionKey2 = authQueryKeys.session();

    expect(sessionKey1).toEqual(sessionKey2);
    expect(sessionKey1).not.toBe(sessionKey2); // Different array instances
  });
});
