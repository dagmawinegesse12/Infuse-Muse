import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/cart/cart-context';
import { ThemeProvider } from '@/components/system/theme';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

/** A theme pinned by a route, bypassing the viewer's own choice. */
export type ForcedTheme = 'night' | 'light' | 'parchment';

/**
 * The whole storefront renders inside this shell.
 *
 * Normally no `theme` is passed: tokens cascade from <html data-muse>, which
 * the viewer controls through the header toggle. Passing `theme` pins the
 * subtree to one tonality instead — used by the direction-preview routes.
 */
export function SiteShell({
  theme,
  children,
}: {
  theme?: ForcedTheme;
  children: ReactNode;
}) {
  return (
    <div data-muse={theme} className="muse-shell min-h-screen overflow-x-hidden">
      <ThemeProvider>
        <CartProvider>
          <Header showThemeToggle={!theme} />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </ThemeProvider>
    </div>
  );
}
