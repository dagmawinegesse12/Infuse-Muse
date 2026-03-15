import { CartPageClient } from '@/components/cart/cart-page-client';

export default function CartPage() {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-950/45">Cart</p>
        <h1 className="mt-3 font-serif text-5xl text-emerald-950">Review your teas before checkout.</h1>
        <p className="mt-4 text-base leading-8 text-emerald-950/65">
          Adjust quantities, remove items, or head straight to checkout — your selections are saved while you browse.
        </p>
      </section>
      <CartPageClient />
    </div>
  );
}
