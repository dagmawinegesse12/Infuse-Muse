/**
 * Shared by both the server layout (which inlines the pre-paint bootstrap) and
 * the client provider. Deliberately NOT in theme.tsx: that file is 'use client',
 * and a Server Component importing from it receives a client-reference proxy
 * rather than the value, which stringifies to "[object Object]".
 */
export type MuseTheme = 'night' | 'light';

export const THEME_STORAGE_KEY = 'muse-theme';
export const DEFAULT_THEME: MuseTheme = 'night';
export const THEMES: readonly MuseTheme[] = ['night', 'light'];
