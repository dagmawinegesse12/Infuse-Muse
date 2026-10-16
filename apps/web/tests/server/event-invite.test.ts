import { afterEach, describe, expect, it, vi } from 'vitest';
import { isValidInvite } from '@/lib/event-invite';

afterEach(() => vi.unstubAllEnvs());

describe('isValidInvite', () => {
  it('accepts exactly the configured code', () => {
    vi.stubEnv('EVENT_INVITE_CODE', 'secret-code');
    expect(isValidInvite('secret-code')).toBe(true);
  });

  it.each(['', 'secret-cod', 'secret-codee', 'SECRET-CODE', undefined, null, 42])(
    'rejects %j',
    (code) => {
      vi.stubEnv('EVENT_INVITE_CODE', 'secret-code');
      expect(isValidInvite(code)).toBe(false);
    }
  );

  it('rejects everything when no code is configured', () => {
    vi.stubEnv('EVENT_INVITE_CODE', '');
    expect(isValidInvite('')).toBe(false);
    expect(isValidInvite('anything')).toBe(false);
  });
});
