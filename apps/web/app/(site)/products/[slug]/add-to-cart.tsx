'use client';

import { useCart } from '@/lib/cart/cart-context';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, state } = useCart();
  const soldOut = product.availableForSale === false;
  // Local fallback data has no variant, so there is nothing to sell.
  const unavailable = !product.variantId;

  if (soldOut || unavailable) {
    return (
      <Button disabled aria-disabled="true" style={{ opacity: 0.5 }}>
        {soldOut ? 'Sold out' : 'Unavailable'}
      </Button>
    );
  }

  return (
    <Button
      disabled={state.pending}
      onClick={() => addItem({ variantId: product.variantId as string })}
    >
      {state.pending ? 'Adding…' : 'Add to bag'}
    </Button>
  );
}
