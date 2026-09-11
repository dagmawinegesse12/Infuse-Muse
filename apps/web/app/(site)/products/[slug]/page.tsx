import { notFound } from 'next/navigation';
import { ThemedImage } from '@/components/system/themed-image';
import { SchemaScript } from '@/components/schema-script';
import { getProductBySlug } from '@/lib/data';
import { createMetadata } from '@/lib/metadata';
import { formatPrice } from '@/lib/utils';
import { QuietLink } from '@/components/system/quiet-link';
import { Reveal } from '@/components/system/reveal';
import { AddToCartButton } from './add-to-cart';

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

      <div className="grid lg:grid-cols-2">
        {/* The photograph holds its own column and is never cropped: a blurred
            copy of itself fills whatever the column's shape leaves over. On
            large screens it sits below the fixed header, not under it. */}
        <div className="plate relative mt-[var(--header-h)] aspect-[4/5] lg:sticky lg:top-[var(--header-h)] lg:mt-0 lg:aspect-auto lg:h-[calc(100svh-var(--header-h))]">
          <ThemedImage
            src={product.image}
            srcLight={product.imageLight}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="scale-110 object-cover opacity-70 blur-2xl"
          />
          <ThemedImage
            src={product.image}
            srcLight={product.imageLight}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
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
              <div
                className="mt-12 flex flex-wrap items-center justify-between gap-6 border-y py-7"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="flex flex-wrap gap-x-12 gap-y-6">
                  <div>
                    <p className="t-label">Price</p>
                    <p className="t-price mt-2 text-[1.125rem]">
                      {formatPrice(product.priceCents, product.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="t-label">Size</p>
                    <p className="t-price mt-2 text-[1.125rem]">{product.size}</p>
                  </div>
                </div>
                <AddToCartButton product={product} />
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
                    ? 'Herbal — no caffeine'
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
    </>
  );
}
