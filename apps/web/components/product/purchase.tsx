'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  ProductGallery,
  type GallerySlide,
} from '@/components/product/product-gallery';
import { AddToCartButton } from '@/app/(site)/products/[slug]/add-to-cart';
import { FULL_SET_CONTENTS, FULL_SET_RECOMMENDATION } from '@/lib/full-sets';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

/**
 * Choosing between the tin and the boxed set.
 *
 * The choice changes two things that sit in different halves of the page
 * layout: the photographs on the left, the price and the button on the right.
 * Rather than pull the whole page into the client, the provider wraps the
 * existing grid and the two halves read the same state — everything between
 * them stays a Server Component, passed straight through as children.
 *
 * With no set for this blend the provider still renders, `set` is null, and
 * the panel shows exactly what it showed before: one price, one button, no
 * control. That is what lets this ship while the sets are still Draft in
 * Shopify, where the Storefront API cannot see them.
 */
type Mode = 'tin' | 'set';

type PurchaseValue = {
  mode: Mode;
  setMode: (m: Mode) => void;
  tin: Product;
  set: Product | null;
  selected: Product;
};

const PurchaseContext = createContext<PurchaseValue | null>(null);

function usePurchase(): PurchaseValue {
  const value = useContext(PurchaseContext);
  if (!value) throw new Error('Purchase components need a <PurchaseProvider>');
  return value;
}

export function PurchaseProvider({
  tin,
  set,
  children,
}: {
  tin: Product;
  set: Product | null;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<Mode>('tin');
  // A set that sells out should not leave the customer stuck on it.
  const usable = set && set.availableForSale !== false ? set : null;
  const selected = mode === 'set' && usable ? usable : tin;

  return (
    <PurchaseContext.Provider
      value={{ mode, setMode, tin, set: usable, selected }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

/**
 * The photographs. Keyed on the mode so switching restarts at the first
 * slide — otherwise a customer on slide three of the tin lands on the third
 * piece of cutlery, which reads as a glitch.
 */
export function PurchaseGallery({
  tinSlides,
  setSlides,
}: {
  tinSlides: GallerySlide[];
  setSlides: GallerySlide[];
}) {
  const { mode, set } = usePurchase();
  const showSet = mode === 'set' && set && setSlides.length > 0;

  return (
    <ProductGallery
      key={showSet ? 'set' : 'tin'}
      slides={showSet ? setSlides : tinSlides}
    />
  );
}

/** Two words and a moving hairline, the same control as the theme switch. */
function ModeToggle() {
  const { mode, setMode } = usePurchase();

  return (
    <div
      role='radiogroup'
      aria-label='What to buy'
      className='flex items-center gap-6'
    >
      {(
        [
          ['tin', 'Tin only'],
          ['set', 'Full set'],
        ] as const
      ).map(([value, label]) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type='button'
            role='radio'
            aria-checked={active}
            onClick={() => setMode(value)}
            className='hit t-label relative pb-1.5 pt-1.5 transition-opacity duration-500 ease-muse'
            style={{ color: 'var(--ink-strong)', opacity: active ? 1 : 0.45 }}
          >
            {label}
            <span
              aria-hidden
              className='absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 ease-muse'
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

/**
 * Price, size and the button. `size` is the blend's either way: the boxed set
 * holds the same tin, so the quantity of tea does not change with the choice.
 */
export function PurchasePanel({ size }: { size: string }) {
  const { mode, set, selected } = usePurchase();

  return (
    <div>
      {set ? (
        <div className='mb-7'>
          <ModeToggle />
          {mode === 'set' ? <p className='t-body mt-4'>{FULL_SET_CONTENTS}</p> : null}
          <p className='t-body mt-3' style={{ opacity: 0.75 }}>
            {FULL_SET_RECOMMENDATION}
          </p>
        </div>
      ) : null}

      <div
        className='flex flex-wrap items-center justify-between gap-6 border-y py-7'
        style={{ borderColor: 'var(--rule)' }}
      >
        <div className='flex flex-wrap gap-x-12 gap-y-6'>
          <div>
            <p className='t-label'>Price</p>
            <p className='t-price mt-2 text-[1.125rem]'>
              {formatPrice(selected.priceCents, selected.currency)}
            </p>
            {/* GST/HST is added at checkout. "Tax", not "HST": outside the
                harmonized provinces the customer pays GST. Loose tea is
                zero-rated and the boxed set is not, so this line is literally
                true of the set and kept on the tin at the owner's request. */}
            <p className='t-label mt-2' style={{ opacity: 0.6 }}>
              plus tax
            </p>
          </div>
          <div>
            <p className='t-label'>Size</p>
            <p className='t-price mt-2 text-[1.125rem]'>{size}</p>
          </div>
        </div>
        <AddToCartButton product={selected} />
      </div>
    </div>
  );
}
