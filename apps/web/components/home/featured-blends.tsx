import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';
import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/types';

export function FeaturedBlends({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="shell pb-[var(--chapter)]">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
          <div>
            <p className="t-label t-label--accent">The Blends</p>
            <h2 className="t-head mt-4 max-w-xl">Five compositions, each for a different hour.</h2>
          </div>
          <QuietLink href="/products">View all</QuietLink>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-x-[clamp(1rem,2.4vw,2.5rem)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product._id} delay={i * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
