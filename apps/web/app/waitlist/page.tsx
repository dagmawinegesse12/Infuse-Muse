import type { Metadata } from 'next';
import Image from 'next/image';
import { WaitlistForm } from './waitlist-form';

export const metadata: Metadata = {
  title: 'The Founding Circle | Infuse & Muse',
  description: 'Something beautiful is steeping. Join the Infuse & Muse founding circle.',
};

export default function WaitlistPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 text-white sm:px-6 sm:py-16">

      {/* Full-bleed background image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/waitlist-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: '100% 40%' }}
        />
        {/* Dark veil */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 75% at 50% 50%, rgba(5,14,7,0.52) 0%, rgba(5,14,7,0.22) 60%, rgba(5,14,7,0.05) 100%),
              linear-gradient(to bottom, rgba(5,14,7,0.32) 0%, rgba(5,14,7,0.08) 40%, rgba(5,14,7,0.38) 100%)
            `,
          }}
        />
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.03,
          }}
        />
      </div>

      {/* Logo + header image */}
      <div className="anim-fade-up relative z-10 mb-8 flex flex-col items-center gap-3 sm:mb-10" style={{ animationDelay: '0.2s' }}>
        <Image
          src="/images/logomark.svg"
          alt="Infuse & Muse logo"
          width={80} height={100}
          priority
          className="w-12 sm:w-14"
        />
        <Image
          src="/images/wordmark.svg"
          alt="Infuse & Muse — Redefining stillness"
          width={420}
          height={84}
          priority
          className="w-72 sm:w-[340px] md:w-[400px]"
        />
      </div>

      {/* Card */}
      <div
        className="anim-fade-up wl-card relative z-10 w-full max-w-[520px] text-center"
        style={{
          animationDelay: '0.5s',
          background: 'rgba(8,20,10,0.62)',
          border: '1px solid rgba(184,154,90,0.22)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Eyebrow */}
        <p className="wl-eyebrow mb-4">
          The Founding Circle
        </p>

        {/* Divider */}
        <div className="mx-auto mb-6" style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, rgba(239,203,128,0.6), transparent)' }} />

        {/* Headline */}
        <h1 className="wl-headline mb-4">
          Something beautiful<br />
          <em style={{ fontFamily: "'Erotique', Georgia, serif", fontStyle: 'italic', color: '#efcb80' }}>is steeping.</em>
        </h1>

        {/* Body */}
        <p className="wl-body mx-auto mb-8" style={{ maxWidth: 380 }}>
          We believe tea is not merely something to drink.<br />
          It is something to enter.<br />
          A ritual. A passage. A return.
        </p>

        {/* Sub-label */}
        <p className="wl-sublabel mb-5">
          Join us as we redefine stillness
        </p>

        {/* Form */}
        <WaitlistForm />

        {/* Note */}
        <p className="wl-note mb-8 mt-2">
          An invitation, not a newsletter.
        </p>

        {/* Pillars */}
        <div style={{ borderTop: '1px solid rgba(184,154,90,0.18)', paddingTop: 24 }}>
          {[
            ['Access',      'The founding circle'],
            ['Ritual',      'A curated experience'],
            ['Sovereignty', 'Luxury is time, reclaimed'],
          ].map(([label, description], i, arr) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(184,154,90,0.12)' : 'none',
            }}>
              <span className="wl-pillar-label">
                {label}
              </span>
              <span className="wl-pillar-body">
                {description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="anim-fade-in relative z-10 mt-8 flex items-center gap-3 sm:mt-10" style={{ animationDelay: '1.2s' }}>
        {['Toronto', 'Ontario', 'Canada'].map((item, i, arr) => (
          <span key={item} className="flex items-center gap-3">
            <span className="wl-footer-item">{item}</span>
            {i < arr.length - 1 && (
              <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(200,190,158,0.5)', display: 'inline-block' }} />
            )}
          </span>
        ))}
      </div>

    </div>
  );
}
