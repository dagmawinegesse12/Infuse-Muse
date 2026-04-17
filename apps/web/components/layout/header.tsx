'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';

const links = [
  ['Home', '/'],
  ['Shop', '/products'],
  ['About', '/about'],
  ['FAQ', '/faq'],
  ['Contact', '/contact'],
  ['Waitlist', '/waitlist'],
] as const;

export function Header() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0f3d2e]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center text-white">
          <Image
            src="/images/logo.png"
            alt="Infuse & Muse"
            width={84}
            height={80}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([label, href]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? 'bg-white/12 text-white'
                    : 'text-emerald-100/80 hover:bg-white/8 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="hidden rounded-full bg-white/10 px-4 py-2 text-sm text-white sm:inline-flex"
          >
            Browse teas
          </Link>
          <button
            onClick={openCart}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
          >
            Cart {itemCount > 0 ? `(${itemCount})` : ''}
          </button>
        </div>
      </div>
    </header>
  );
}