import { notFound } from 'next/navigation';
import { PurchaseGallery, PurchasePanel, PurchaseProvider } from '@/components/product/purchase';
import { SchemaScript } from '@/components/schema-script';
import { getFullSets, getProductBySlug } from '@/lib/data';
import { fullSetSlides, fullSetTitleFor, isFullSet } from '@/lib/full-sets';
import { createMetadata } from '@/lib/metadata';
import { QuietLink } from '@/components/system/quiet-link';
import { Reveal } from '@/components/system/reveal';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return createMetadata({
      title: 'Product not found',
      description: 'Tea product not found.',
      path: `/products/${params.slug}`,
    });
  }
  return createMetadata({
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  /*
    The boxed set for this blend, if Shopify is publishing one. Paired by title
    rather than handle (see lib/full-sets.ts), and absent while the sets are
    Draft — in which case the page sells the tin exactly as it did before.

    A set's own page asks for no set, or it would offer to sell itself a box.
  */
  const fullSet = isFullSet(product)
    ? null
    : (await getFullSets()).find((s) => s.title === fullSetTitleFor(product.title)) ?? null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: [product.image],
    brand: { '@type': 'Brand', name: 'Infuse & Muse' },
    weight: product.size,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.availableForSale === false
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
    },
  };

  return (
    <>
      <SchemaScript data={schema} />

      <PurchaseProvider tin={product} set={fullSet}>
      <div className="grid lg:grid-cols-2">
        {/* The photographs. Square, because the tins are square and the wider
            stills only lose their outer edges at that ratio; a portrait frame
            cut the bowls out of the stills and a landscape one took the lid off
            the tins. Sticky on large screens so the image stays alongside the
            copy, and self-start so the grid does not stretch it. */}
        <div className="mt-[var(--header-h)] lg:sticky lg:top-[var(--header-h)] lg:mt-0 lg:self-start">
          <PurchaseGallery
            tinSlides={[
              { src: product.image, srcLight: product.imageLight, alt: product.alt },
              ...(product.gallery ?? []),
            ]}
            setSlides={fullSetSlides(product.slug)}
          />
        </div>

        <div className="px-[var(--gutter)] pb-[clamp(5rem,9vw,8rem)] pt-[clamp(3rem,7vw,8rem)] lg:pt-[var(--header-clear)]">
          <div className="max-w-measure">
            <Reveal>
              <p className="t-label t-label--accent">{product.categoryTitle}</p>
            </Reveal>
            <Reveal delay={70}>
              <h1 className="t-display mt-6">{product.title}</h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="t-body t-body--lead mt-7">{product.shortDescription}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-12">
                <PurchasePanel size={product.size} />
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="t-body mt-10">{product.description}</p>
            </Reveal>

            <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              <Reveal delay={280}>
                <div className="border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                  <h2 className="t-label">Tasting notes</h2>
                  <ul className="mt-5 space-y-3">
                    {product.tastingNotes.map((note) => (
                      <li key={note} className="t-body">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={330}>
                <div className="border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                  <h2 className="t-label">Ingredients</h2>
                  <ul className="mt-5 space-y-3">
                    {product.ingredients.map((ingredient) => (
                      <li key={ingredient} className="t-body">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal delay={370}>
              <div className="mt-12 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <h2 className="t-label">Caffeine</h2>
                <p className="t-body mt-4">
                  {product.caffeineLevel === 'Herbal'
                    ? 'Herbal, no caffeine'
                    : product.caffeineLevel}
                </p>
              </div>
            </Reveal>

            <Reveal delay={410}>
              <div className="mt-12 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <h2 className="t-label">How to brew</h2>
                <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-3">
                  {(
                    [
                      ['Water', product.brewing.temperature],
                      ['Steep', product.brewing.time],
                      ['Measure', product.brewing.amount],
                    ] as const
                  ).map(([term, value]) => (
                    <div key={term}>
                      <dt className="t-label" style={{ opacity: 0.6 }}>
                        {term}
                      </dt>
                      <dd className="t-body mt-2">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            <Reveal delay={450}>
              <div className="mt-12 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <h2 className="t-label">Allergens</h2>
                {/*
                  Never render an absent declaration as "none" — this is food.
                  The owner has not supplied allergen information for any blend
                  (see docs/CONTENT-INTAKE.md); until they do, say so plainly.
                */}
                <p className="t-body mt-4">
                  {product.allergens || (
                    <>
                      Not yet confirmed for this blend. Please{' '}
                      <a href="/contact" className="underline underline-offset-4">
                        contact us
                      </a>{' '}
                      before ordering if you have an allergy.
                    </>
                  )}
                </p>
              </div>
            </Reveal>

            <Reveal delay={490}>
              <div className="mt-14">
                <QuietLink href="/products">All blends</QuietLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      </PurchaseProvider>
    </>
  );
}
