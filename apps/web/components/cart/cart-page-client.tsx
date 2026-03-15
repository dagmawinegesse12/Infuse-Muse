'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
      // Keep loading=true while Stripe redirects; browser will navigate away.
      window.location.href = data.url;
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
      setLoading(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-emerald-950/15 bg-white/70 p-10 text-center">
        <h1 className="font-serif text-3xl text-emerald-950">Your cart is still empty</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-emerald-950/65">
          Start with a featured blend, then return here to review your selections and move into checkout.
        </p>
        <Button href="/products" className="mt-6">Shop teas</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {state.items.map((item) => (
          <div key={item.id} className="rounded-[2rem] border border-emerald-950/10 bg-white/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-emerald-950">{item.name}</h2>
                <p className="mt-1 text-sm text-emerald-950/60">{formatPrice(item.price)} per pouch</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-sm text-emerald-950/50 hover:text-emerald-950">
                Remove
              </button>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="inline-flex items-center rounded-full border border-emerald-950/10 bg-white">
                <button onClick={() => setQuantity(item.id, item.quantity - 1)} className="px-4 py-2">−</button>
                <span className="min-w-12 text-center">{item.quantity}</span>
                <button onClick={() => setQuantity(item.id, item.quantity + 1)} className="px-4 py-2">+</button>
              </div>
              <div className="font-medium text-emerald-950">{formatPrice(item.quantity * item.price)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6">
        <h2 className="font-serif text-2xl text-emerald-950">Order summary</h2>
        <div className="mt-6 space-y-3 text-sm text-emerald-950/70">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Calculated at checkout</span></div>
          <div className="border-t border-emerald-950/10 pt-3 text-base font-semibold text-emerald-950 flex justify-between"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
        </div>
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <div className="mt-6 grid gap-3">
          <Button onClick={handleCheckout} disabled={loading}>{loading ? 'Redirecting…' : 'Checkout with Stripe'}</Button>
          <Button variant="secondary" onClick={clearCart}>Clear cart</Button>
        </div>
      </div>
    </div>
  );
}
