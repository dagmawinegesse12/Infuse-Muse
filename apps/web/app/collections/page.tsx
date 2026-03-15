import Link from "next/link";
import { createMetadata } from "@/lib/metadata";
import { getCategories } from "@/lib/data";

export const metadata = createMetadata({
  title: "Tea Collections | Infuse & Muse",
  description: "Browse floral, fruity, and wellness tea collections from Infuse & Muse.",
  path: "/collections"
});

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#173c33] px-8 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">Collections</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            Browse by mood, flavor, and ritual
          </h1>
          <p className="mt-4 text-base leading-8 text-emerald-50/80">
            Explore curated tea categories — each designed around a feeling, a time of day, or a ritual.
          </p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/collections/${category.slug}`}
            className="group rounded-[28px] border border-emerald-950/10 bg-white/75 p-8 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#c79f3d]">Collection</p>
            <h2 className="mt-3 font-serif text-3xl text-emerald-950">{category.title}</h2>
            <p className="mt-4 text-base leading-8 text-emerald-950/65">{category.description}</p>
            <span className="mt-6 inline-flex text-sm font-medium text-emerald-900 underline-offset-4 group-hover:underline">
              Explore collection →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
