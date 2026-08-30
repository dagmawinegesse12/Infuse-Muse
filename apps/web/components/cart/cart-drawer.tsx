'use client';

import { useEffect } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuietLink } from '@/components/system/quiet-link';
import { QuantityStepper } from '@/components/cart/quantity-stepper';

export function CartDrawer() {
  const { state, closeCart, setQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCart]);

  return (
    <>
      <button
        className="fixed inset-0 z-40 transition-opacity duration-700 ease-muse"
        onClick={closeCart}
        aria-label="Close bag"
        tabIndex={state.isOpen ? 0 : -1}
        style={{
          background: 'rgba(4, 9, 7, 0.6)',
          opacity: state.isOpen ? 1 : 0,
          visibility: state.isOpen ? 'visible' : 'hidden',
        }}
      />

      <aside
        aria-hidden={!state.isOpen}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l transition-transform duration-700 ease-muse"
        style={{
          background: 'var(--ground)',
          borderColor: 'var(--rule)',
          transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div
          className="flex items-start justify-between border-b px-[clamp(1.25rem,4vw,2rem)] py-6"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div>
            <h2 className="t-sub">Your bag</h2>
            <p className="t-label mt-2">
              {state.items.length === 0
                ? 'Empty'
                : `${state.items.length} ${state.items.length === 1 ? 'blend' : 'blends'}`}
            </p>
          </div>
          <button onClick={closeCart} className="hit t-label wipe-link text-ink-strong">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[clamp(1.25rem,4vw,2rem)]">
          {state.items.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="t-sub">Nothing here yet</h3>
              <p className="t-body mt-4">
                Browse the blends and come back when you are ready.
              </p>
              <div className="mt-8">
                <QuietLink href="/products">The blends</QuietLink>
              </div>
            </div>
          ) : (
            state.items.map((item) => (
              <div
                key={item.id}
                className="border-b py-6"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="t-sub">{item.name}</h3>
                    <p className="t-label mt-2">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="t-price">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <QuantityStepper
                    compact
                    value={item.quantity}
                    label={item.name}
                    onChange={(next) => setQuantity(item.id, next)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="hit t-label wipe-link"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          className="border-t px-[clamp(1.25rem,4vw,2rem)] py-6"
          style={{ borderColor: 'var(--rule)' }}
        >
          <div className="mb-6 flex items-baseline justify-between">
            <span className="t-label">Subtotal</span>
            <span className="t-price text-[1.0625rem]">{formatPrice(subtotal)}</span>
          </div>
          <Button href="/cart" className="w-full">
            Review bag
          </Button>
        </div>
      </aside>
    </>
  );
}
