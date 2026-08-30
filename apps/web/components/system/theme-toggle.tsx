'use client';

import { useMuseTheme } from '@/components/system/theme';
import { THEMES } from '@/components/system/theme-constants';

/**
 * Two words and a moving hairline — the same grammar as every other control.
 * Both labels stay rendered so the control never changes width on switch.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useMuseTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`relative inline-flex items-center gap-3 ${className}`.trim()}
    >
      {THEMES.map((option) => {
        const active = theme === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(option)}
            className="hit t-label relative pb-1.5 pt-1.5 transition-opacity duration-500 ease-muse"
            style={{
              color: 'var(--ink-strong)',
              opacity: active ? 1 : 0.45,
            }}
          >
            {option === 'night' ? 'Dark' : 'Light'}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 ease-muse"
              style={{
                background: 'var(--accent)',
                transform: active ? 'scaleX(1)' : 'scaleX(0)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
