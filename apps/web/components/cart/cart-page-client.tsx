'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QuietLink } from '@/components/system/quiet-link';
import { QuantityStepper } from '@/components/cart/quantity-stepper';

export function CartPageClient() {
  const { state, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: state.items }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        setError(data.error ?? 'Unable to start checkout. Please try again.');
        setLoading(false);
        return;
      }
      // Keep loading=true while Stripe redirects; the browser navigates away.
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
      setLoading(false);
    }
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
    <div className="grid gap-x-[clamp(2rem,6vw,6rem)] gap-y-16 lg:grid-cols-[1.5fr_0.7fr] lg:items-start">
      <div>
        {state.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 border-b py-8 sm:grid-cols-[1fr_auto] sm:items-end"
            style={{ borderColor: 'var(--rule)' }}
          >
            <div>
              <h2 className="t-sub">{item.name}</h2>
              <p className="t-label mt-2">{formatPrice(item.price)} per pouch</p>
              <div className="mt-5">
                <QuantityStepper
                  value={item.quantity}
                  label={item.name}
                  onChange={(next) => setQuantity(item.id, next)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 sm:flex-col sm:items-end sm:gap-4">
              <p className="t-price text-[1rem]">{formatPrice(item.quantity * item.price)}</p>
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
            <dd className="t-price">{formatPrice(subtotal)}</dd>
          </div>
          <div
            className="flex justify-between border-t py-4"
            style={{ borderColor: 'var(--rule)' }}
          >
            <dt className="t-body">Shipping</dt>
            <dd className="t-body">Calculated at checkout</dd>
          </div>
          <div
            className="flex items-baseline justify-between border-t border-b py-5"
            style={{ borderColor: 'var(--rule-strong)' }}
          >
            <dt className="t-sub">Total</dt>
            <dd className="t-price text-[1.125rem]">{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        {error ? (
          <p role="alert" className="t-body mt-5" style={{ color: '#e08a7a' }}>
            {error}
          </p>
        ) : null}

        <div className="mt-9 grid gap-6">
          <Button onClick={handleCheckout} disabled={loading}>
            {loading ? 'Redirecting…' : 'Checkout'}
          </Button>
          <button type="button" onClick={clearCart} className="quiet-link justify-self-start">
            Empty the bag
          </button>
        </div>
      </aside>
    </div>
  );
}
