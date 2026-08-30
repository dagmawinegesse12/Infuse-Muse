'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { DEFAULT_THEME, THEME_STORAGE_KEY, type MuseTheme } from '@/components/system/theme-constants';

export type { MuseTheme };

type ThemeValue = { theme: MuseTheme; setTheme: (t: MuseTheme) => void; toggle: () => void };

const ThemeContext = createContext<ThemeValue | null>(null);

/**
 * Theme lives on <html data-muse>, written before first paint by the inline
 * script in app/layout.tsx. This provider only mirrors that attribute into
 * React state so the chrome can re-render (the crest has to swap colour), and
 * writes changes back to the DOM and to localStorage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<MuseTheme>(DEFAULT_THEME);

  // Adopt whatever the pre-paint script already decided.
  useEffect(() => {
    const current = document.documentElement.dataset.muse;
    if (current === 'light' || current === 'night') setThemeState(current);
  }, []);

  const setTheme = useCallback((next: MuseTheme) => {
    setThemeState(next);
    document.documentElement.dataset.muse = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage — the choice just won't persist.
    }
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === 'night' ? 'light' : 'night'),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

/**
 * Returns the live theme. Falls back to the default outside a provider, which
 * is what the forced-theme preview routes want.
 */
export function useMuseTheme(): ThemeValue {
  return (
    useContext(ThemeContext) ?? {
      theme: DEFAULT_THEME,
      setTheme: () => {},
      toggle: () => {},
    }
  );
}
