'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { useMuseTheme } from '@/components/system/theme';
import { ThemeToggle } from '@/components/system/theme-toggle';
import { THEME_CHOICE_ENABLED } from '@/components/system/theme-constants';

const PRIMARY = [
  ['Blends', '/products'],
  ['The Archetypes', '/muses'],
  ['The Prologue', '/about'],
] as const;

const SECONDARY = [
  ['Contact', '/contact'],
  ['Questions', '/faq'],
] as const;

export function Header({ showThemeToggle = true }: { showThemeToggle?: boolean }) {
  /* The route may allow the toggle while the theme itself is withdrawn, in
     which case the mobile block's "Theme" heading would label nothing. */
  const themeControl = showThemeToggle && THEME_CHOICE_ENABLED;
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { theme } = useMuseTheme();

  /* The house crest is pale gold — 1.07:1 on the cream ground, effectively
     invisible. Light mode gets the same artwork recoloured to brand green. */
  const crest = theme === 'light' ? '/images/logo-green.png' : '/images/logo.png';
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  /* Only the homepage puts a full-bleed hero under the bar. Elsewhere the
     header sits on the ground from the start, so no scrim is drawn over the
     artwork. */
  const overHero = pathname === '/' || pathname.startsWith('/preview/');
  const solid = lifted || open || !overHero;

  /* Transparent over the hero; acquires a ground and a hairline once the
     page has moved. */
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-700 ease-muse"
        style={{
          backgroundColor: solid ? 'var(--ground)' : 'transparent',
          borderBottom: `1px solid ${solid && !open ? 'var(--rule)' : 'transparent'}`,
        }}
      >
        <div
          className="header-scrim"
          style={{ opacity: solid ? 0 : 1 }}
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[var(--gutter)] pb-4 pt-6 sm:pb-5 sm:pt-8">
          {/* Left — menu */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="hit group flex items-center gap-3 justify-self-start text-ink-strong"
          >
            <span className="relative block h-[9px] w-[18px]">
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-700 ease-muse"
                style={{ top: 0, transform: open ? 'translateY(4px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute left-0 block h-px w-full bg-current transition-transform duration-700 ease-muse"
                style={{ top: 8, transform: open ? 'translateY(-4px) rotate(-45deg)' : 'none' }}
              />
            </span>
            <span className="t-label hidden text-ink-strong sm:inline">{open ? 'Close' : 'Menu'}</span>
          </button>

          {/* Centre — crest */}
          <Link
            href="/"
            aria-label="Infuse &amp; Muse, home"
            className="hit justify-self-center"
          >
            <Image
              src={crest}
              alt="Infuse &amp; Muse"
              width={200}
              height={190}
              priority
              className="h-20 w-auto sm:h-24"
            />
          </Link>

          {/* Right — commerce */}
          <div className="flex items-center gap-5 justify-self-end sm:gap-7">
            {themeControl ? <ThemeToggle className="hidden sm:inline-flex" /> : null}
            <Link href="/products" className="hit t-label wipe-link hidden text-ink-strong sm:inline">
              Search
            </Link>
            <button type="button" onClick={openCart} className="hit t-label wipe-link text-ink-strong">
              Bag{itemCount > 0 ? ` (${itemCount})` : ''}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu. Opens as a curtain, links stagger in behind it. */}
      <div
        className="fixed inset-0 z-40 transition-[opacity,visibility] duration-700 ease-muse"
        style={{
          background: 'var(--ground)',
          opacity: open ? 1 : 0,
          visibility: open ? 'visible' : 'hidden',
        }}
        aria-hidden={!open}
      >
        <div className="h-full pt-28">
          <nav className="flex h-full flex-col justify-center px-[var(--gutter)] pb-16">
            <ul>
              {PRIMARY.map(([label, href], i) => (
                <li key={href} className="overflow-hidden">
                  <Link
                    href={href}
                    className="t-display block py-2 transition-[opacity,transform] duration-700 ease-muse"
                    style={{
                      opacity: open ? 1 : 0,
                      transform: open ? 'none' : 'translateY(28px)',
                      transitionDelay: `${140 + i * 70}ms`,
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="rule my-10 max-w-md" />

            {themeControl ? (
              <div
                className="mb-10 transition-opacity duration-700 ease-muse sm:hidden"
                style={{ opacity: open ? 1 : 0, transitionDelay: '380ms' }}
              >
                <p className="t-label mb-3">Theme</p>
                <ThemeToggle />
              </div>
            ) : null}

            <ul className="flex flex-wrap gap-x-8 gap-y-6">
              {SECONDARY.map(([label, href], i) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="t-label wipe-link transition-opacity duration-700 ease-muse"
                    style={{ opacity: open ? 1 : 0, transitionDelay: `${420 + i * 60}ms` }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
