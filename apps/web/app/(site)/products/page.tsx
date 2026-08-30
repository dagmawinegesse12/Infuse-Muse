import { createMetadata } from '@/lib/metadata';
import { getCategories, getProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { CategoryChip } from '@/components/category-chip';
import { PageHeader } from '@/components/system/page-header';
import { SearchField } from '@/components/search-field';
import { searchProducts } from '@/lib/search';
import { Reveal } from '@/components/system/reveal';

export const metadata = createMetadata({
  title: 'Shop Tea Blends | Infuse & Muse',
  description:
    'Browse premium tea blends from Infuse & Muse, including floral, fruity, and wellness teas in Mississauga.',
  path: '/products',
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string; q?: string };
}) {
  const selectedCategory = searchParams?.category;
  const query = searchParams?.q?.trim() ?? '';
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const byCategory = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;
  const filtered = query ? searchProducts(byCategory, query) : byCategory;

  return (
    <>
      <PageHeader
        eyebrow="The Blends"
        title="Browse the full collection"
        lede="Signature compositions and seasonal drops, each with its tasting notes stated plainly."
      />

      <div className="shell pb-[var(--chapter)]">
        <Reveal>
          <SearchField defaultValue={query} category={selectedCategory} />
        </Reveal>

        <Reveal delay={60}>
          <nav className="mt-10 flex flex-wrap gap-x-10 gap-y-6" aria-label="Filter by collection">
            <CategoryChip href="/products" label="All blends" active={!selectedCategory} />
            {categories.map((category) => (
              <CategoryChip
                key={category.slug}
                href={`/products?category=${category.slug}`}
                label={category.title}
                active={selectedCategory === category.slug}
              />
            ))}
          </nav>
        </Reveal>

        {filtered.length ? (
          <div className="mt-16 grid gap-x-[clamp(1rem,2.4vw,2.5rem)] gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 80}>
                <ProductCard product={product} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="t-body mt-16">
            {query
              ? `Nothing matches “${query}”. Try a flavour, a botanical, or a mood.`
              : 'Nothing in this collection yet.'}
          </p>
        )}
      </div>
    </>
  );
}
