import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0f3d2e] px-8 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">About Infuse &amp; Muse</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            A boutique tea brand built around calm, beauty, and everyday ritual.
          </h1>
          <p className="mt-4 text-base leading-8 text-emerald-50/80">
            Rooted in Mississauga. Crafted for those who believe tea is more than a drink — it is a moment.
          </p>
        </div>
      </section>

      <section className="grid gap-8 rounded-[2.5rem] bg-white/65 p-8 lg:grid-cols-2 lg:p-12">
        <p className="text-base leading-8 text-emerald-950/70">
          Infuse &amp; Muse is designed to feel warm, giftable, and elevated. Instead of treating tea like a commodity catalog, the brand centers mood, visual identity, and the quiet luxury of a beautiful cup prepared with intention.
        </p>
        <p className="text-base leading-8 text-emerald-950/70">
          Every blend is named with personality, presented with care, and designed to make gifting feel effortless — whether for a friend, a ritual, or yourself.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          ['Elegant flavor storytelling', 'Each blend has a name, a mood, and a story. We want your first glance to feel as good as your first sip.'],
          ['Giftable by design', 'From the visual identity to the product descriptions, everything is crafted to feel premium and easy to share.'],
          ['Built for Mississauga', 'We are a local brand with local roots — designed for discovery, pickup, and community connection.']
        ].map(([title, copy]) => (
          <div key={title} className="rounded-[2rem] border border-emerald-950/10 bg-white/75 p-6">
            <h2 className="font-serif text-2xl text-emerald-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-950/65">{copy}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[2.5rem] bg-[#0f3d2e] p-10 text-white">
        <h2 className="font-serif text-4xl">Ready to explore the blends?</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50/75">
          Browse signature and seasonal teas — each with clear tasting notes and a premium presentation designed for ritual and gifting.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/products">Browse the shop</Button>
          <Button href="/contact" variant="secondary">Get in touch</Button>
        </div>
      </section>
    </div>
  );
}
