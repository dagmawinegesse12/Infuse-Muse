import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/cart/cart-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#f4efe6] text-emerald-950">
      <CartProvider>
        <Header />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </div>
  );
}
