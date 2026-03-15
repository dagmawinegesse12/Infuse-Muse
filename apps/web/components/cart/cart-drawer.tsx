'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { state, closeCart, setQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      {state.isOpen && <button className="fixed inset-0 z-40 bg-black/40" onClick={closeCart} aria-label="Close cart overlay" />}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-emerald-950/10 bg-[#f7f3ec] shadow-2xl transition-transform duration-300 ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-emerald-950/10 px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl text-emerald-950">Your cart</h2>
            <p className="text-sm text-emerald-950/60">Thoughtful blends, ready when you are.</p>
          </div>
          <button onClick={closeCart} className="rounded-full border border-emerald-950/10 px-3 py-1.5 text-sm text-emerald-950">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {state.items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-emerald-950/15 bg-white/60 p-8 text-center">
              <h3 className="font-serif text-xl text-emerald-950">Your cart is empty</h3>
              <p className="mt-3 text-sm leading-7 text-emerald-950/65">
                Browse signature blends, build your ritual, and come back when you are ready to check out.
              </p>
              <Button href="/products" className="mt-5">Shop teas</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-emerald-950/10 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-emerald-950">{item.name}</h3>
                      <p className="mt-1 text-sm text-emerald-950/60">{formatPrice(item.price)} each</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-sm text-emerald-950/50 hover:text-emerald-950">
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-emerald-950/10 bg-white">
                      <button onClick={() => setQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5">−</button>
                      <span className="min-w-10 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => setQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5">+</button>
                    </div>
                    <div className="text-sm font-medium text-emerald-950">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-emerald-950/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm text-emerald-950/75">
            <span>Subtotal</span>
            <span className="text-lg font-semibold text-emerald-950">{formatPrice(subtotal)}</span>
          </div>
          <div className="grid gap-3">
            <Button href="/cart">Review cart</Button>
            <Link href="/contact" className="text-center text-sm text-emerald-950/60 underline-offset-4 hover:underline">
              Need a custom gift order?
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
