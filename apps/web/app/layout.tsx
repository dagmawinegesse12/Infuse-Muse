import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DEFAULT_THEME, THEME_STORAGE_KEY } from '@/components/system/theme-constants';

export const metadata: Metadata = {
  title: {
    default: 'Infuse & Muse | Premium Tea Blends',
    template: '%s | Infuse & Muse',
  },
  description:
    'Premium boutique tea blends from Mississauga. Crafted for calm, gifting, and everyday ritual.',
};

/**
 * Runs before first paint so a returning viewer never sees the wrong ground
 * flash before hydration. Kept to one statement and inlined deliberately.
 */
const themeBootstrap = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');
document.documentElement.dataset.muse=(t==='light'||t==='night')?t:'${DEFAULT_THEME}';}
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
