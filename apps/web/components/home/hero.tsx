import Image from 'next/image';
import Link from 'next/link';
import { HeroVideo } from '@/components/home/hero-video';

/**
 * Full-bleed film, near-silent chrome, and one small plate held low in the
 * frame so the film itself is what greets the viewer.
 *
 * The film starts muted so it is allowed to autoplay, and offers a sound
 * control — see HeroVideo. It is never the sole carrier of meaning.
 * `hero__still` sits underneath as the poster and is the only thing shown when
 * the viewer has asked for reduced motion (see globals.css).
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
          alt="A figure at the shoreline under a full moon, filmed at night"
          fill
          priority
          sizes="100vw"
          className="hero__still object-cover"
          style={{ objectPosition: '50% 55%' }}
        />

        <HeroVideo />

        <div className="absolute inset-0" style={{ background: 'var(--hero-veil)' }} />

        {/*
          A direct way into the shop from the film. The plate below also links
          to the blends, but that reads as editorial; this reads as a way to
          buy, and sits on the opposite edge to the sound control so the two
          balance.

          The wrapper carries the position, not the link: `.hit` sets
          `position: relative` for its 44px tap target, which beats Tailwind's
          `absolute` in the cascade. Same reason as HeroVideo's control.
        */}
        <div className="absolute left-[var(--gutter)] top-[calc(var(--header-h)+0.75rem)] z-10 sm:bottom-8 sm:top-auto">
          <Link
            href="/products"
            className="hit t-label flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-sm"
            style={{
              color: 'var(--on-media)',
              borderColor: 'rgba(255, 255, 255, 0.22)',
              background: 'rgba(9, 37, 22, 0.32)',
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 7h12l-1.2 13.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L6 7z" />
              <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
            </svg>
            Order now
          </Link>
        </div>

        {/* Plate, seated on the foot of the frame so the film's subject stays
            clear of it and it reads as anchored rather than floating. */}
        <div className="absolute inset-0 flex items-end justify-center px-[var(--gutter)]">
          <div
            className="w-full max-w-[22rem] px-8 py-10 text-center"
            style={{ background: 'var(--plate)', color: 'var(--plate-ink)' }}
          >
            <h1
              className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.14]"
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
                href="/muses"
                className="wipe-link t-label mx-auto"
                style={{ color: 'var(--plate-ink)' }}
              >
                The Archetypes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
