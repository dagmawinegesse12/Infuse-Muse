import Link from 'next/link';
import { createMetadata } from '@/lib/metadata';
import { getCategories } from '@/lib/data';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export const metadata = createMetadata({
  title: 'Tea Collections | Infuse & Muse',
  description: 'Browse floral, fruity, and wellness tea collections from Infuse & Muse.',
  path: '/collections',
});

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        eyebrow="Collections"
        title="Browse by mood, flavour and ritual"
        lede="Each collection is built around a feeling or an hour rather than a shelf category."
      />

      <div className="shell pb-[var(--chapter)]">
        {categories.map((category, i) => (
          <Reveal key={category.slug} delay={i * 80}>
            <Link
              href={`/collections/${category.slug}`}
              className="group grid gap-4 border-b py-12 lg:grid-cols-[6rem_20rem_1fr_auto] lg:items-baseline lg:gap-10"
              style={{ borderColor: 'var(--rule)' }}
            >
              <span className="t-numeral">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="t-head">{category.title}</h2>
              <p className="t-body max-w-measure">{category.description}</p>
              <span className="quiet-link mt-2 lg:mt-0">Explore</span>
            </Link>
          </Reveal>
        ))}

        <Reveal>
          <div className="mt-14">
            <QuietLink href="/products">All blends</QuietLink>
          </div>
        </Reveal>
      </div>
    </>
  );
}
