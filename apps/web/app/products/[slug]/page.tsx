import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SchemaScript } from "@/components/schema-script";
import { getProductBySlug } from "@/lib/data";
import { createMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return createMetadata({
      title: "Product not found | Infuse & Muse",
      description: "Tea product not found.",
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
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: [product.image],
    brand: { "@type": "Brand", name: "Infuse & Muse" },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug}`,
    },
  };

  return (
    <div className="py-4">
      <SchemaScript data={schema} />

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-emerald-950/8 bg-[#e8e2d7] shadow-sm">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c79f3d]">
              {product.categoryTitle}
            </p>
            <h1 className="mt-2 font-serif text-5xl text-emerald-950">
              {product.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-emerald-950/70">
              {product.shortDescription}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-emerald-950/10 bg-white/75 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-950/45">Price</p>
                <p className="mt-1 text-2xl font-medium text-emerald-950">
                  {formatPrice(product.priceCents, product.currency)}
                </p>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>

          <p className="text-base leading-8 text-emerald-950/70">{product.description}</p>

          <div className="grid gap-5 rounded-[1.75rem] border border-emerald-950/10 bg-[#f3efe7] p-5 sm:grid-cols-2">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#c79f3d]">Tasting notes</h2>
              <ul className="mt-3 space-y-2 text-sm text-emerald-950/70">
                {product.tastingNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#c79f3d]">Ingredients</h2>
              <ul className="mt-3 space-y-2 text-sm text-emerald-950/70">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-950/60">
            <span className="rounded-full border border-emerald-950/10 bg-white/70 px-3 py-1">
              Caffeine: {product.caffeineLevel}
            </span>
            <Link
              href="/products"
              className="underline-offset-4 hover:text-emerald-950 hover:underline"
            >
              ← Back to all blends
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
