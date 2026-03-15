'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart/cart-context';

function formatPrice(priceCents: number, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
  }).format(priceCents / 100);
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.3] overflow-hidden bg-[#eef3ee]">
          <Image
            src={product.image}
            alt={product.alt || product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-950/45">
              {product.categoryTitle}
            </p>
            <h3 className="mt-2 font-serif text-2xl text-emerald-950">
              {product.title}
            </h3>
          </div>
          <p className="text-sm font-medium text-emerald-950">
            {formatPrice(product.priceCents, product.currency)}
          </p>
        </div>

        <p className="text-sm leading-7 text-emerald-950/65">
          {product.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.tastingNotes?.slice(0, 3).map((note) => (
            <span
              key={note}
              className="rounded-full bg-[#f4efe6] px-3 py-1 text-xs text-emerald-950/75"
            >
              {note}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              addItem({
                id: product._id,
                slug: product.slug,
                name: product.title,
                image: product.image,
                price: product.priceCents,
              })
            }
            className="rounded-full bg-emerald-900 px-4 py-2 text-sm text-white transition hover:bg-emerald-800"
          >
            Add to cart
          </button>

          <Link
            href={`/products/${product.slug}`}
            className="rounded-full border border-emerald-950/10 px-4 py-2 text-sm text-emerald-950"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}