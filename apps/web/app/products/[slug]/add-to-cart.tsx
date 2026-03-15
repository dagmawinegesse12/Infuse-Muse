'use client';

import { useCart } from '@/lib/cart/cart-context';
import type { Product } from '@/lib/types';

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  return (
    <button
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
      className="rounded-full bg-emerald-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
    >
      Add to cart
    </button>
  );
}
