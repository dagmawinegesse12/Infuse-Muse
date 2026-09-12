import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  DEFAULT_THEME,
  SELECTABLE_THEMES,
  THEME_STORAGE_KEY,
} from '@/components/system/theme-constants';

export const metadata: Metadata = {
  title: {
    default: 'Infuse & Muse | Premium Tea Blends',
    template: '%s | Infuse & Muse',
  },
  description:
    'Premium small-batch loose leaf tea. Crafted for calm, gifting, and everyday ritual.',
};

/**
 * Runs before first paint so a returning viewer never sees the wrong ground
 * flash before hydration. Kept to one statement and inlined deliberately.
 *
 * The stored preference is checked against SELECTABLE_THEMES rather than
 * against every theme that exists, so withdrawing one does not strand the
 * people who had already chosen it. Their choice stays in localStorage and is
 * simply not honoured while it is unavailable.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');
document.documentElement.dataset.muse=${JSON.stringify(SELECTABLE_THEMES)}.indexOf(t)>-1?t:'${DEFAULT_THEME}';}
catch(e){document.documentElement.dataset.muse='${DEFAULT_THEME}';}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-muse={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
