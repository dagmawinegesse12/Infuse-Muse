import Image from 'next/image';
import Link from 'next/link';

/**
 * Full-bleed film, near-silent chrome, and one small plate floating at centre —
 * the device the reference uses to open its season.
 *
 * The video is decorative: muted, looping, inline, and never the sole carrier of
 * meaning. `hero__still` sits underneath as the poster and is the only thing
 * shown when the viewer has asked for reduced motion (see globals.css).
 *
 * On `parchment` the media is inset rather than full-height, because a dark
 * frame bled edge to edge on a pale ground reads as a hole in the page.
 */
export function Hero() {
  return (
    <section className="hero__frame bleed relative">
      <div className="hero__media plate relative w-full">
        {/* Poster, and the only media shown under reduced motion. */}
        <Image
          src="/video/hero-poster.jpg"
          alt="Tea steeping in a glass pot, filmed in close detail"
          fill
          priority
          sizes="100vw"
          className="hero__still object-cover"
          style={{ objectPosition: '50% 55%' }}
        />

        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0" style={{ background: 'var(--hero-veil)' }} />

        {/* Centre plate */}
        <div className="absolute inset-0 flex items-center justify-center px-[var(--gutter)]">
          <div
            className="w-full max-w-[22rem] px-8 py-10 text-center"
            style={{ background: 'var(--plate)', color: 'var(--plate-ink)' }}
          >
            <p className="t-label" style={{ color: 'var(--plate-ink)', opacity: 0.62 }}>
              Autumn · Winter 2026
            </p>
            <h1
              className="mt-5 font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.14]"
              style={{ color: 'var(--plate-ink)' }}
            >
              Redefining Stillness
            </h1>
            <div
              className="mx-auto my-7 h-px w-10"
              style={{ background: 'var(--plate-ink)', opacity: 0.28 }}
            />
            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="wipe-link t-label mx-auto"
                style={{ color: 'var(--plate-ink)' }}
              >
                The Blends
              </Link>
              <Link
                href="/about"
                className="wipe-link t-label mx-auto"
                style={{ color: 'var(--plate-ink)' }}
              >
                The Maison
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue — a hairline that breathes. */}
        <div className="hero__cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
          <span className="t-label" style={{ color: 'var(--on-media-mute)' }}>
            Scroll
          </span>
          <span
            className="block h-10 w-px origin-top"
            style={{ background: 'var(--on-media)', opacity: 0.35 }}
          />
        </div>
      </div>
    </section>
  );
}
