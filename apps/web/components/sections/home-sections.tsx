import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getFaqs, getHomepage, getProducts, getSiteSettings } from "@/lib/data";

export async function HomeSections() {
  const [homepage, products, faqs, siteSettings] = await Promise.all([
    getHomepage(),
    getProducts(),
    getFaqs(),
    getSiteSettings(),
  ]);

  const featuredSlugs = homepage.featuredSlugs ?? [];
  const seasonalSlugs = homepage.seasonalSlugs ?? [];

  const featured = featuredSlugs.length
    ? products.filter((product) => featuredSlugs.includes(product.slug))
    : products.filter((product) => product.featured);

  const seasonal = seasonalSlugs.length
    ? products.filter((product) => seasonalSlugs.includes(product.slug))
    : products.filter((product) => product.seasonal);

  return (
    <div className="space-y-24 pb-12">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0f3d2e] px-6 py-16 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">
              {homepage.eyebrow}
            </p>

            <h1 className="font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
              Redefining Stillness
            </h1>

            <p className="max-w-xl text-base leading-8 text-emerald-50/80 sm:text-lg">
              {homepage.subheadline}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button href="/products">{homepage.ctaPrimary}</Button>
              <Button href="/about" variant="secondary">
                {homepage.ctaSecondary}
              </Button>
            </div>

            <div className="grid gap-4 pt-4 text-sm text-emerald-50/75 sm:grid-cols-3">
              <div>
                <strong className="block text-white">Boutique feel</strong>
                Crafted for gifting and ritual.
              </div>
              <div>
                <strong className="block text-white">Flexible catalog</strong>
                Easy seasonal drops and feature swaps.
              </div>
              <div>
                <strong className="block text-white">Local touch</strong>
                Built for {siteSettings.city} discovery and pickup.
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-white/10 p-4 backdrop-blur">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/images/products/rose-vitalitea.png"
                  alt="Rose VitaliTea featured blend"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="space-y-4 pt-8 sm:pt-12">
              <div className="rounded-[2rem] bg-white/10 p-4 backdrop-blur">
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/images/products/lavender-lullaby.png"
                    alt="Lavender Lullaby calming herbal blend"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 text-sm leading-7 text-emerald-50/75">
                “A calm luxury brand experience with elegant blends and a giftable,
                premium feel.”
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-950/45">
              Featured blends
            </p>
            <h2 className="mt-3 font-serif text-4xl text-emerald-950">
              Designed to feel giftable, intentional, and easy to love.
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-emerald-950 underline-offset-4 hover:underline"
          >
            See the full shop
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-[2.5rem] bg-white/65 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
        <div className="rounded-[2rem] bg-[#0f3d2e] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/60">
            Brand story
          </p>
          <h2 className="mt-4 font-serif text-4xl">
            A tea brand for the mood around the cup.
          </h2>
        </div>

        <div className="space-y-5 text-base leading-8 text-emerald-950/72">
          <p>
            Infuse & Muse was imagined as a boutique tea experience rather than a
            commodity storefront. The goal is simple: make tea feel beautiful again,
            both in the cup and in the way it is discovered online.
          </p>
          <p>
            The blends are named with personality, the visuals are soft and premium,
            and the site is structured so the owner can keep adding new flavors,
            editing collections, and promoting seasonal drops without friction.
          </p>
          <Button href="/about" variant="secondary">
            More about the brand
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          [
            "Why choose us",
            "Small-batch presentation, premium visual identity, and flavor-forward blends that feel elevated from first glance to final sip.",
          ],
          [
            "Seasonal flexibility",
            "The storefront and CMS are designed so new blends, banners, and featured collections can be updated quickly.",
          ],
          [
            "Built for trust",
            "Local business signals, clear FAQs, polished product pages, and a realistic checkout flow create confidence early.",
          ],
        ].map(([title, copy]) => (
          <div
            key={title}
            className="rounded-[2rem] border border-emerald-950/10 bg-white/75 p-6"
          >
            <h3 className="font-serif text-2xl text-emerald-950">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-emerald-950/65">{copy}</p>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-950/45">
            Seasonal blends
          </p>
          <h2 className="mt-3 font-serif text-4xl text-emerald-950">
            Limited drops that keep the storefront feeling alive.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {seasonal.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-[#eadfcf] px-8 py-12 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-950/45">
          What customers remember
        </p>
        <blockquote className="mx-auto mt-5 max-w-4xl font-serif text-3xl leading-snug text-emerald-950">
          “Beautiful tea, beautiful mood, and a premium experience from the first glance.”
        </blockquote>
        <p className="mt-4 text-sm text-emerald-950/60">
          Infuse &amp; Muse customer sentiment
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-emerald-950/10 bg-white/75 p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-950/45">
            FAQ preview
          </p>
          <h2 className="mt-3 font-serif text-4xl text-emerald-950">
            A few helpful questions before you order.
          </h2>
          <div className="mt-8 space-y-5">
            {faqs.slice(0, 2).map((faq) => (
              <div key={faq._id} className="rounded-[1.5rem] bg-[#f7f3ec] p-5">
                <h3 className="font-medium text-emerald-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-emerald-950/65">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          <Button href="/faq" variant="secondary" className="mt-6">
            Read all FAQs
          </Button>
        </div>

        <div className="rounded-[2rem] bg-[#0f3d2e] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/60">
            Visit or connect
          </p>
          <h2 className="mt-3 font-serif text-4xl">
            Ready to shop, gift, or ask a question?
          </h2>
          <p className="mt-4 text-sm leading-7 text-emerald-50/75">
            Use the shop for direct browsing, or reach out for custom gifting,
            collaborations, and local pickup support in {siteSettings.city}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/products">Start shopping</Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}