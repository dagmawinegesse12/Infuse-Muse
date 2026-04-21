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

      {/* Full-bleed background image — fixed so it doesn't scroll */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/waitlist-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-top sm:object-center"
        />
        {/* Dark veil */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 75% at 50% 50%, rgba(5,14,7,0.78) 0%, rgba(5,14,7,0.38) 60%, rgba(5,14,7,0.12) 100%),
              linear-gradient(to bottom, rgba(5,14,7,0.5) 0%, rgba(5,14,7,0.12) 40%, rgba(5,14,7,0.6) 100%)
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

      {/* Brand name */}
      <div className="anim-fade-up relative z-10 mb-8 sm:mb-10" style={{ animationDelay: '0.2s' }}>
        <span
          className="wl-brand"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            textTransform: 'uppercase',
            color: '#d4b87a',
          }}
        >
          Infuse &amp; Muse
        </span>
      </div>

      {/* Frosted glass card */}
      <div
        className="anim-fade-up wl-card relative z-10 w-full max-w-[520px] text-center"
        style={{
          animationDelay: '0.5s',
          background: 'rgba(8,20,10,0.55)',
          border: '1px solid rgba(184,154,90,0.2)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Eyebrow */}
        <span
          className="mb-5 block"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: '0.62rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#8a7040',
          }}
        >
          The Founding Circle
        </span>

        {/* Divider */}
        <div
          className="mx-auto mb-7"
          style={{
            width: 40,
            height: 1,
            background: 'linear-gradient(to right, transparent, #8a7040, transparent)',
          }}
        />

        {/* Headline */}
        <h1
          className="wl-headline mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: '#f0ead8',
          }}
        >
          Something beautiful<br />
          <em style={{ fontStyle: 'italic', color: '#d4b87a' }}>is steeping.</em>
        </h1>

        {/* Body */}
        <p
          className="wl-body mx-auto mb-9"
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 500,
            lineHeight: 1.9,
            color: '#c8be9e',
            maxWidth: 380,
          }}
        >
          We believe tea is not merely something to drink.<br />
          It is something to enter.<br />
          A ritual. A passage. A return.
        </p>

        {/* Sub-label */}
        <p
          className="wl-sublabel mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            textTransform: 'uppercase',
            color: '#8a7040',
          }}
        >
          Join us as we redefine stillness
        </p>

        {/* Form */}
        <WaitlistForm />

        {/* Note */}
        <p
          className="mb-9 mt-2"
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: '0.78rem',
            color: 'rgba(200,190,158,0.7)',
            letterSpacing: '0.08em',
            fontStyle: 'italic',
          }}
        >
          An invitation, not a newsletter.
        </p>

        {/* Pillars */}
        <div
          className="flex w-full"
          style={{ borderTop: '1px solid rgba(184,154,90,0.18)', paddingTop: 28 }}
        >
          {[
            ['Access', 'The founding', 'circle'],
            ['Ritual', 'A curated', 'experience'],
            ['Sovereignty', 'Luxury is time,', 'reclaimed'],
          ].map(([label, line1, line2], i, arr) => (
            <div
              key={label}
              className="flex-1 text-center"
              style={{
                padding: '0 8px',
                borderRight: i < arr.length - 1 ? '1px solid rgba(184,154,90,0.18)' : 'none',
              }}
            >
              <span
                className="wl-pillar-label mb-2 block"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  color: '#8a7040',
                }}
              >
                {label}
              </span>
              <span
                className="wl-pillar-body"
                style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: '#f0ead8',
                }}
              >
                {line1}<br />
                <em style={{ fontStyle: 'italic', color: '#c8be9e' }}>{line2}</em>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="anim-fade-in relative z-10 mt-8 flex items-center gap-3 sm:mt-11" style={{ animationDelay: '1.2s' }}>
        {['Toronto', 'Ontario', 'Canada'].map((item, i, arr) => (
          <span key={item} className="flex items-center gap-3">
            <span
              className="wl-footer-item"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 500,
                textTransform: 'uppercase',
                color: 'rgba(184,154,90,0.9)',
              }}
            >
              {item}
            </span>
            {i < arr.length - 1 && (
              <span
                style={{
                  width: 2, height: 2,
                  borderRadius: '50%',
                  background: 'rgba(138,112,64,0.5)',
                  display: 'inline-block',
                }}
              />
            )}
          </span>
        ))}
      </div>

    </div>
  );
}
