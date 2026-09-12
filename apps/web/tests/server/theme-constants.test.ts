import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  LIGHT_THEME_ENABLED,
  SELECTABLE_THEMES,
  THEMES,
  THEME_CHOICE_ENABLED,
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

  it('still describes both themes the design system has', () => {
    expect([...THEMES]).toEqual(['night', 'light']);
  });

  /*
    The light ground is withdrawn until photography made for it exists. These
    assertions are the ones that will fail loudly if it is ever half-restored:
    the switch and what derives from it have to agree, or the toggle and the
    pre-paint bootstrap end up disagreeing about what is on offer.
  */
  it('derives what is selectable from the one switch', () => {
    expect([...SELECTABLE_THEMES]).toEqual(
      LIGHT_THEME_ENABLED ? ['night', 'light'] : ['night']
    );
    expect(THEME_CHOICE_ENABLED).toBe(SELECTABLE_THEMES.length > 1);
  });

  it('never leaves the default unselectable', () => {
    expect(SELECTABLE_THEMES).toContain(DEFAULT_THEME);
  });
});
