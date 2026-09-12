import Image from 'next/image';
import type { Muse } from '@/lib/muses';

/**
 * The artwork behind a Muse, or a typographic stand-in where none exists yet.
 *
 * All five works now have paintings; The Old-Soul's arrived on 2026-09-12.
 * The fallback below is kept for any archetype added without art: rather than
 * leave a hole or repeat another work, that plate becomes a quiet title card,
 * house green with a soft radial lift, a gold hairline frame and a small
 * centred mark. It carries no text of its own, since every plate already
 * captions itself with a numeral and a name, and repeating the name inside the
 * frame read as a duplication rather than a design.
 */
export function MusePlate({
  muse,
  sizes,
  priority = false,
}: {
  muse: Muse;
  sizes: string;
  priority?: boolean;
}) {
  if (muse.image) {
    return (
      <Image
        src={muse.image}
        alt={muse.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 18%, #17513c 0%, #0f3d2e 52%, #092516 100%)',
      }}
      aria-hidden="true"
    >
      {/* Hairline frame, inset from the plate edge. */}
      <div
        className="pointer-events-none absolute inset-[clamp(0.75rem,1.6vw,1.5rem)] border"
        style={{ borderColor: 'rgba(239, 203, 128, 0.28)' }}
      />
      {/* A small lozenge, turned on its point — the house mark at rest. */}
      <div className="flex flex-col items-center gap-5">
        <span
          className="block h-3 w-3 rotate-45 border"
          style={{ borderColor: 'rgba(239, 203, 128, 0.7)' }}
        />
        <span
          className="block h-px w-10"
          style={{ background: '#efcb80', opacity: 0.4 }}
        />
      </div>
    </div>
  );
}
