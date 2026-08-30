import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
} from '@/components/system/theme-constants';

/**
 * These constants are imported by a Server Component to build the pre-paint
 * bootstrap script. If they ever move back into a 'use client' module, Next
 * hands the server a client-reference proxy and they stringify to
 * "[object Object]" — which silently breaks theming. Assert they are strings.
 */
describe('theme constants', () => {
  it('exposes a plain string storage key', () => {
    expect(typeof THEME_STORAGE_KEY).toBe('string');
    expect(THEME_STORAGE_KEY).toBe('muse-theme');
  });

  it('exposes a plain string default theme', () => {
    expect(typeof DEFAULT_THEME).toBe('string');
    expect(THEMES).toContain(DEFAULT_THEME);
  });

  it('offers exactly the two user-facing themes', () => {
    expect([...THEMES]).toEqual(['night', 'light']);
  });
});
