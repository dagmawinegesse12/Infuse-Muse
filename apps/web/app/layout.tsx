import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/cart/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';
// layout.tsx is the root layout for the entire application, wrapping all pages and components. It includes the CartProvider for global cart state, the Header and Footer for consistent navigation and branding, and the CartDrawer for accessible cart functionality across the site. The metadata object defines default SEO properties for the application.
export const metadata: Metadata = {
  title: {
    default: 'Infuse & Muse | Premium Tea Blends',
    template: '%s | Infuse & Muse',
  },
  description: 'Premium boutique tea blends from Mississauga. Crafted for calm, gifting, and everyday ritual.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f4efe6] text-emerald-950 antialiased">
        <CartProvider>
          <Header />
          <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
