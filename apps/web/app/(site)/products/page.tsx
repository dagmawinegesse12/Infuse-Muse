import { createMetadata } from "@/lib/metadata";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { CategoryChip } from "@/components/category-chip";

export const metadata = createMetadata({
  title: "Shop Tea Blends | Infuse & Muse",
  description:
    "Browse premium tea blends from Infuse & Muse, including floral, fruity, and wellness teas in Mississauga.",
  path: "/products",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const selectedCategory = searchParams?.category;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0f3d2e] px-8 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">
            Shop teas
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            Browse the full collection
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50/80">
            Signature blends and seasonal drops with clear tasting notes —
            crafted for gifting, ritual, and everyday enjoyment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CategoryChip
              href="/products"
              label="All blends"
              active={!selectedCategory}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category.slug}
                href={`/products?category=${category.slug}`}
                label={category.title}
                active={selectedCategory === category.slug}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
