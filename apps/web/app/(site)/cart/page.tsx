import { CartHeader, CartPageClient } from '@/components/cart/cart-page-client';

export default function CartPage() {
  return (
    <>
      <CartHeader />
      <div className="shell pb-[var(--chapter)]">
        <CartPageClient />
      </div>
    </>
  );
}
