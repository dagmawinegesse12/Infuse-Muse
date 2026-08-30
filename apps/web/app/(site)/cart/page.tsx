import { CartPageClient } from '@/components/cart/cart-page-client';
import { PageHeader } from '@/components/system/page-header';

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bag"
        title="Review your blends before checkout."
        lede="Adjust quantities or remove anything — your selections are kept while you browse."
      />
      <div className="shell pb-[var(--chapter)]">
        <CartPageClient />
      </div>
    </>
  );
}
