import './globals.css';
import type { Metadata, ReactNode } from 'next';
import { CartProvider } from '@/lib/cart/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

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
