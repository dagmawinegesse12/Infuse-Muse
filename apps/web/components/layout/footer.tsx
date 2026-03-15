import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-emerald-950/10 bg-[#102b24] text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Infuse & Muse</h2>
          <p className="max-w-md text-sm leading-7 text-emerald-50/70">
            Boutique tea blends designed to make the everyday feel more intentional. Rooted in calm, crafted for ritual,
            and proudly serving Mississauga, Canada.
          </p>
          <div className="text-sm text-emerald-50/70">Mississauga, Ontario · Local pickup and seasonal drops</div>
        </div>
        <div>
          <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-100/60">Explore</h3>
          <div className="grid gap-3 text-sm text-emerald-50/80">
            <Link href="/products">Shop all teas</Link>
            <Link href="/about">Our story</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-emerald-100/60">Why customers stay</h3>
          <ul className="space-y-3 text-sm leading-7 text-emerald-50/70">
            <li>Elegant blends with clear flavor profiles</li>
            <li>Simple checkout flow built for small-batch shopping</li>
            <li>Content-managed storefront ready for seasonal updates</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8 px-4 py-5 text-center text-xs text-emerald-50/50 sm:px-6 lg:px-8">
        © 2026 Infuse & Muse. Crafted for calm, gifting, and everyday ritual.
      </div>
    </footer>
  );
}
