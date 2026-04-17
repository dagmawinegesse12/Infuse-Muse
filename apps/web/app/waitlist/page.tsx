import type { Metadata } from 'next';
import Image from 'next/image';
import { WaitlistForm } from './waitlist-form';

export const metadata: Metadata = {
  title: 'Coming Soon | Infuse & Muse',
  description: 'Infuse & Muse is almost ready. Join the waitlist for early access and an exclusive welcome offer.',
};

export default function WaitlistPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#030a05]">

      {/* ── LEFT CURTAIN ─────────────────────────── */}
      <div
        className="absolute inset-y-0 left-0 w-[52%]"
        style={{
          background: `repeating-linear-gradient(
            to right,
            #020705 0px,
            #061410 5px,
            #0d2e1e 11px,
            #175030 18px,
            #1e5c38 24px,
            #175030 30px,
            #0d2e1e 36px,
            #061410 42px,
            #020705 48px
          )`,
        }}
      />

      {/* ── RIGHT CURTAIN ────────────────────────── */}
      <div
        className="absolute inset-y-0 right-0 w-[52%]"
        style={{
          background: `repeating-linear-gradient(
            to left,
            #020705 0px,
            #061410 5px,
            #0d2e1e 11px,
            #175030 18px,
            #1e5c38 24px,
            #175030 30px,
            #0d2e1e 36px,
            #061410 42px,
            #020705 48px
          )`,
        }}
      />

      {/* Left inner shadow — curtain falling toward center */}
      <div
        className="absolute inset-y-0 left-[38%] w-[14%]"
        style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.82))' }}
      />

      {/* Right inner shadow */}
      <div
        className="absolute inset-y-0 right-[38%] w-[14%]"
        style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.82))' }}
      />

      {/* Top gold stage light */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            'radial-gradient(ellipse 55% 80% at 50% -10%, rgba(239,203,128,0.13) 0%, transparent 65%)',
        }}
      />

      {/* Bottom fade to black */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)' }}
      />

      {/* Overall vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* ── CONTENT ─────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-7 px-6 pb-10 pt-6 text-center">

        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Infuse & Muse"
          width={160}
          height={152}
          priority
          className="w-32 sm:w-36"
          style={{ filter: 'drop-shadow(0 0 24px rgba(239,203,128,0.18))' }}
        />

        {/* Brand name + tagline */}
        <div className="space-y-2">
          <p className="font-serif text-xl tracking-[0.28em] text-[#efcb80] sm:text-2xl">
            Infuse &amp; Muse
          </p>
          <p className="text-[10px] tracking-[0.38em] text-[#efcb80]/45 uppercase">
            Redefining stillness
          </p>
        </div>

        {/* Ornament divider */}
        <div className="flex w-36 items-center gap-3">
          <div className="h-px flex-1 bg-[#efcb80]/25" />
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none" className="shrink-0">
            <rect x="1" y="1" width="4" height="4" transform="rotate(45 3 3)" fill="#efcb80" fillOpacity="0.45" />
          </svg>
          <div className="h-px flex-1 bg-[#efcb80]/25" />
        </div>

        {/* CTA */}
        <p className="text-[11px] font-medium tracking-[0.42em] text-[#efcb80]/70 uppercase">
          Be the first to know
        </p>

        {/* Form */}
        <WaitlistForm />

        <p className="text-[10px] tracking-widest text-white/20 uppercase">
          Mississauga &nbsp;·&nbsp; Ontario &nbsp;·&nbsp; Canada
        </p>
      </div>
    </div>
  );
}
