'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';

/**
 * Squared, unframed, shadowless. The photograph does the selling; the tile
 * contributes a name, an origin note and a price. `Add` only appears on hover
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
        <p className="t-price shrink-0">{formatPrice(product.priceCents, product.currency)}</p>
      </div>

      <p className="t-body mt-3 line-clamp-2">{product.shortDescription}</p>

      <button
        type="button"
        onClick={() =>
          addItem({
            id: product._id,
            slug: product.slug,
            name: product.title,
            image: product.image,
            price: product.priceCents,
          })
        }
        className="quiet-link mt-5 opacity-0 transition-opacity duration-700 ease-muse focus-visible:opacity-100 group-hover:opacity-100"
      >
        Add to bag
      </button>
    </article>
  );
}
