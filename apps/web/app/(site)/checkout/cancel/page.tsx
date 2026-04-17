import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24 text-center">

      {/* Header */}
      <div className="rounded-[2.5rem] bg-[#0f3d2e] px-8 py-12 text-white">
        <div
          className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
        >
          <svg className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">Infuse &amp; Muse</p>
        <h1 className="mt-3 font-serif text-4xl font-normal">Payment cancelled.</h1>
        <p className="mt-3 text-sm leading-7 text-white/55">
          No charge was made. Your cart is still saved — come back whenever you&apos;re ready.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cart"
          className="flex-1 rounded-full bg-[#0f3d2e] px-6 py-3.5 text-center font-serif text-sm text-white"
        >
          Return to cart
        </Link>
        <Link
          href="/products"
          className="flex-1 rounded-full border border-emerald-950/15 bg-white/80 px-6 py-3.5 text-center text-sm text-emerald-950"
        >
          Keep browsing
        </Link>
      </div>

      {/* Help link */}
      <p className="mt-8 text-sm text-emerald-950/50">
        Having trouble?{' '}
        <a href="mailto:hello@infuseandmuse.com" className="text-[#0f3d2e] underline">
          Contact us
        </a>
      </p>
    </div>
  );
}
