import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';
import type { Product } from '@/lib/types';

/**
 * Two large-format plates, deliberately offset. Asymmetry is the only place
 * this system permits itself a gesture.
 */
export function Seasonal({ products }: { products: Product[] }) {
  const picks = products.slice(0, 2);
  if (!picks.length) return null;

  return (
    <section className="pb-[var(--chapter)]">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="t-label t-label--accent">Limited</p>
              <h2 className="t-head mt-4 max-w-md">Seasonal drops, while the harvest lasts.</h2>
            </div>
            <QuietLink href="/collections">The collections</QuietLink>
          </div>
        </Reveal>
      </div>

      <div className="shell mt-14 grid gap-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-2">
        {picks.map((product, i) => (
          <Reveal key={product._id} delay={i * 110} className={i === 1 ? 'lg:mt-28' : ''}>
            <Link href={`/products/${product.slug}`} className="group block">
              <div className="plate plate--hover relative aspect-[4/5]">
                <Image
                  src={product.image}
                  alt={product.alt || product.title}
                  fill
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
                <div className="plate__veil" />
                <div className="absolute inset-x-0 bottom-0 p-[clamp(1.25rem,2.6vw,2.5rem)]">
                  <p className="t-label" style={{ color: 'var(--on-media-mute)' }}>
                    {product.categoryTitle}
                  </p>
                  <h3 className="t-head mt-3" style={{ color: 'var(--on-media)' }}>
                    {product.title}
                  </h3>
                </div>
              </div>
            </Link>
            <p className="t-body mt-6 max-w-measure">{product.shortDescription}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
