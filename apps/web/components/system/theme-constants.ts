/**
 * Shared by both the server layout (which inlines the pre-paint bootstrap) and
 * the client provider. Deliberately NOT in theme.tsx: that file is 'use client',
 * and a Server Component importing from it receives a client-reference proxy
 * rather than the value, which stringifies to "[object Object]".
 */
export type MuseTheme = 'night' | 'light';

export const THEME_STORAGE_KEY = 'muse-theme';
export const DEFAULT_THEME: MuseTheme = 'night';

/** Every theme the design system has tokens and photography slots for. */
export const THEMES: readonly MuseTheme[] = ['night', 'light'];

/**
 * The light ground is withdrawn, at the owner's request, until photographs made
 * for it exist: the current `-light.jpg` set is not what she wants standing
 * behind it.
 *
 * This is the whole switch. Set it back to true and the toggle returns, the
 * bootstrap honours a stored 'light' again, and the light photographs start
 * showing — nothing else to undo, because nothing was deleted. The light
 * tokens, the `.muse-img--light` rules, the ThemedImage pairs and the tests
 * covering all of it are still here and still exercised.
 *
 * A viewer who chose light before it was withdrawn keeps that preference in
 * localStorage, unread for now, and gets it back when this flips.
 */
export const LIGHT_THEME_ENABLED = false;

/** What a viewer may actually choose today. */
export const SELECTABLE_THEMES: readonly MuseTheme[] = LIGHT_THEME_ENABLED
  ? THEMES
  : [DEFAULT_THEME];

/** False while only one theme is on offer, which is when the toggle hides. */
export const THEME_CHOICE_ENABLED = SELECTABLE_THEMES.length > 1;
