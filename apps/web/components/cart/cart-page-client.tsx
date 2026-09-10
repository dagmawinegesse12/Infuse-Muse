'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuietLink } from '@/components/system/quiet-link';
import { QuantityStepper } from '@/components/cart/quantity-stepper';

export function CartPageClient() {
  const { state, subtotal, checkoutUrl, setQuantity, removeItem, clearCart } = useCart();
  const [leaving, setLeaving] = useState(false);

  // Coming back from Shopify with the Back button can restore this page from
  // the bfcache with `leaving` still true; let the button work again.
  useEffect(() => {
    const reset = () => setLeaving(false);
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  function handleCheckout() {
    if (!checkoutUrl || leaving) return;
    // Shopify hosts payment, shipping and tax. Keep the button quiet while
    // the browser navigates away.
    setLeaving(true);
    window.location.assign(checkoutUrl);
  }

  if (!state.hydrated) {
    return (
      <div className="border-t py-20 text-center" style={{ borderColor: 'var(--rule)' }}>
        <p className="t-label">Loading your bag…</p>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="border-t py-20 text-center" style={{ borderColor: 'var(--rule)' }}>
        <h2 className="t-head">Your bag is still empty</h2>
        <p className="t-body mx-auto mt-6 max-w-measure">
          Start with a featured blend, then come back to review before checkout.
        </p>
        <div className="mt-10">
          <QuietLink href="/products">The blends</QuietLink>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid gap-x-[clamp(2rem,6vw,6rem)] gap-y-16 lg:grid-cols-[1.5fr_0.7fr] lg:items-start"
      aria-busy={state.pending}
    >
      <div>
        {state.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 border-b py-8 sm:grid-cols-[1fr_auto] sm:items-end"
            style={{ borderColor: 'var(--rule)' }}
          >
            <div>
              <h2 className="t-sub">{item.name}</h2>
              <p className="t-label mt-2">{formatPrice(item.price, state.currency)} per tin</p>
              <div className="mt-5">
                <QuantityStepper
                  value={item.quantity}
                  label={item.name}
                  onChange={(next) => setQuantity(item.id, next)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 sm:flex-col sm:items-end sm:gap-4">
              <p className="t-price text-[1rem]">
                {formatPrice(item.quantity * item.price, state.currency)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="hit t-label wipe-link"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="lg:sticky lg:top-28">
        <h2 className="t-label t-label--accent">Summary</h2>
        <dl className="mt-7">
          <div
            className="flex justify-between border-t py-4"
            style={{ borderColor: 'var(--rule)' }}
          >
            <dt className="t-body">Subtotal</dt>
            <dd className="t-price">{formatPrice(subtotal, state.currency)}</dd>
          </div>
          <div
            className="flex justify-between border-t py-4"
            style={{ borderColor: 'var(--rule)' }}
          >
            <dt className="t-body">Shipping and tax</dt>
            <dd className="t-body">Calculated at checkout</dd>
          </div>
          <div
            className="flex items-baseline justify-between border-t border-b py-5"
            style={{ borderColor: 'var(--rule-strong)' }}
          >
            <dt className="t-sub">Total before shipping</dt>
            <dd className="t-price text-[1.125rem]">{formatPrice(subtotal, state.currency)}</dd>
          </div>
        </dl>

        {state.error ? (
          <p role="alert" className="t-body mt-5" style={{ color: '#e08a7a' }}>
            {state.error}
          </p>
        ) : null}

        <div className="mt-9 grid gap-6">
          <Button onClick={handleCheckout} disabled={!checkoutUrl || state.pending || leaving}>
            {leaving ? 'Opening checkout…' : 'Checkout'}
          </Button>
          <button type="button" onClick={clearCart} className="quiet-link justify-self-start">
            Empty the bag
          </button>
        </div>
      </aside>
    </div>
  );
}
