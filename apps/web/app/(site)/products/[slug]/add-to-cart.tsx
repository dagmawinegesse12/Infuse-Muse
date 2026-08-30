'use client';

import { useCart } from '@/lib/cart/cart-context';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  return (
    <Button
      onClick={() => {
        addItem({
          id: product._id,
          slug: product.slug,
          name: product.title,
          image: product.image,
          price: product.priceCents,
        });
        openCart();
      }}
    >
      Add to bag
    </Button>
  );
}
