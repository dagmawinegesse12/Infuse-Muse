import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug, getProducts } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) {
    return createMetadata({
      title: "Collection not found | Infuse & Muse",
      description: "Collection not found.",
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

  const collectionProducts = products.filter(
    (product) => product.categorySlug === category.slug
  );

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#173c33] px-8 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">Collection</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            {category.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-emerald-50/80">{category.description}</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {collectionProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
