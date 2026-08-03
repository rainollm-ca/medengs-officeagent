import { describe, expect, it } from 'vitest';
import { isAuthRequired, isPublicPath, validateAccessToken } from '../lib/security';

describe('production access guard', () => {
  it('leaves health checks public', () => {
    expect(isPublicPath('/api/health')).toBe(true);
    expect(isPublicPath('/api/health/deep')).toBe(true);
    expect(isPublicPath('/dashboard')).toBe(false);
  });

  it('requires auth in production or when explicitly enabled', () => {
    expect(isAuthRequired({ NODE_ENV: 'development' })).toBe(false);
    expect(isAuthRequired({ NODE_ENV: 'development', REQUIRE_AUTH: 'true' })).toBe(true);
    expect(isAuthRequired({ NODE_ENV: 'production' })).toBe(true);
  });

  it('validates bearer tokens and fails closed without a configured token', () => {
    expect(validateAccessToken('Bearer demo-token', 'demo-token')).toBe(true);
    expect(validateAccessToken('Bearer wrong', 'demo-token')).toBe(false);
    expect(validateAccessToken('Basic demo-token', 'demo-token')).toBe(false);
    expect(validateAccessToken('Bearer demo-token', undefined)).toBe(false);
  });
});
