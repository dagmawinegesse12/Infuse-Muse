'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';

/**
 * Squared, unframed, shadowless. The photograph does the selling; the tile
 * contributes a name, its archetype, a price and the pack size. `Add` only appears on hover
 * so a grid at rest reads as a wall of images rather than a row of buttons.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addItem } = useCart();

  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="plate plate--hover relative aspect-[3/4]">
          <Image
            src={product.image}
            alt={product.alt || product.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 88vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex items-baseline justify-between gap-6 pt-5">
        <div className="min-w-0">
          <h3 className="t-sub truncate">
            <Link href={`/products/${product.slug}`} className="hit wipe-link">
              {product.title}
            </Link>
          </h3>
          <p className="t-label mt-2">{product.categoryTitle}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="t-price">{formatPrice(product.priceCents, product.currency)}</p>
          {product.size ? (
            <p className="t-label mt-1" style={{ opacity: 0.6 }}>
              {product.size}
            </p>
          ) : null}
        </div>
      </div>

      <p className="t-body mt-3 line-clamp-2">{product.shortDescription}</p>

      {product.availableForSale === false ? (
        <p className="t-label mt-5" style={{ opacity: 0.6 }}>
          Sold out
        </p>
      ) : product.variantId ? (
        <button
          type="button"
          onClick={() => addItem({ variantId: product.variantId as string })}
          className="quiet-link mt-5 opacity-0 transition-opacity duration-700 ease-muse focus-visible:opacity-100 group-hover:opacity-100"
        >
          Add to bag
        </button>
      ) : null}
    </article>
  );
}
