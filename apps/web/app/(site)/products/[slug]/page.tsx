import Image from 'next/image';
import { notFound } from 'next/navigation';
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
      title: 'Product not found | Infuse & Muse',
      description: 'Tea product not found.',
      path: `/products/${params.slug}`,
    });
  }
  return createMetadata({
    title: product.seoTitle || `${product.title} | Infuse & Muse`,
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
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${product.slug}`,
    },
  };

  return (
    <>
      <SchemaScript data={schema} />

      <div className="grid lg:grid-cols-2">
        {/* The photograph runs to the edge and holds its own column. */}
        <div className="plate relative min-h-[70vw] lg:sticky lg:top-0 lg:h-screen lg:min-h-0">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
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
                <div>
                  <p className="t-label">Price</p>
                  <p className="t-price mt-2 text-[1.125rem]">
                    {formatPrice(product.priceCents, product.currency)}
                  </p>
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
                <p className="t-body mt-4">{product.caffeineLevel}</p>
              </div>
            </Reveal>

            <Reveal delay={410}>
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
