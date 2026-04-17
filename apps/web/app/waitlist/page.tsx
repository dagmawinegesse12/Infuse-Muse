import type { Metadata } from 'next';
import Image from 'next/image';
import { WaitlistForm } from './waitlist-form';

export const metadata: Metadata = {
  title: 'Coming Soon | Infuse & Muse',
  description: 'Infuse & Muse is almost ready. Join the waitlist for early access and an exclusive welcome offer.',
};

export default function WaitlistPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a2a20] px-6 py-16 text-white">

      {/* Background radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(15,61,46,0.9)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(239,203,128,0.05)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(239,203,128,0.04)_0%,transparent_70%)]" />
      </div>

      {/* Thin gold top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#efcb80]/60 to-transparent" />

      {/* Content */}
      <div className="relative flex w-full max-w-lg flex-col items-center gap-8 text-center">

        {/* Logo */}
        <div className="flex flex-col items-center gap-0">
          <Image
            src="/images/logo.png"
            alt="Infuse & Muse"
            width={280}
            height={266}
            priority
            className="w-56 sm:w-64 lg:w-72 drop-shadow-2xl brightness-110 contrast-105"
          />
        </div>

        {/* Divider */}
        <div className="flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#efcb80]/30" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#efcb80]/60">Coming Soon</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#efcb80]/30" />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Something beautiful<br />is steeping.
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-7 text-white/55">
            We&rsquo;re putting the finishing touches on the shop. Join the waitlist
            and be the first to experience it — with an exclusive welcome offer.
          </p>
        </div>

        {/* Form */}
        <div className="w-full">
          <WaitlistForm />
        </div>

        {/* Trust line */}
        <p className="text-xs text-white/30">
          No spam. Just the good stuff, when it matters.
        </p>

        {/* Perks row */}
        <div className="grid w-full grid-cols-3 gap-4 border-t border-white/10 pt-8">
          {[
            ['Early access', 'Shop before anyone else'],
            ['Welcome offer', 'Exclusive launch discount'],
            ['Seasonal drops', 'First to know, every time'],
          ].map(([title, copy]) => (
            <div key={title} className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#efcb80]/80">{title}</p>
              <p className="text-xs leading-5 text-white/40">{copy}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom gold line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#efcb80]/30 to-transparent" />

      {/* Footer credit */}
      <p className="absolute bottom-5 text-[10px] tracking-widest text-white/20">
        MISSISSAUGA · ONTARIO · CANADA
      </p>
    </div>
  );
}
