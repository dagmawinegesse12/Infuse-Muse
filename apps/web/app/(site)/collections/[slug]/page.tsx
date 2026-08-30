import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { getCategoryBySlug, getProducts } from '@/lib/data';
import { createMetadata } from '@/lib/metadata';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return createMetadata({
      title: 'Collection not found | Infuse & Muse',
      description: 'Collection not found.',
      path: `/collections/${params.slug}`,
    });
  }
  return createMetadata({
    title: `${category.title} | Infuse & Muse Collections`,
    description: category.description,
    path: `/collections/${category.slug}`,
  });
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProducts(),
  ]);

  if (!category) notFound();

  const inCollection = products.filter((product) => product.categorySlug === category.slug);

  return (
    <>
      <PageHeader eyebrow="Collection" title={category.title} lede={category.description} />

      <div className="shell pb-[var(--chapter)]">
        {inCollection.length ? (
          <div className="grid gap-x-[clamp(1rem,2.4vw,2.5rem)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {inCollection.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 80}>
                <ProductCard product={product} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="t-body">Nothing in this collection yet.</p>
        )}

        <Reveal>
          <div className="mt-16">
            <QuietLink href="/collections">All collections</QuietLink>
          </div>
        </Reveal>
      </div>
    </>
  );
}
