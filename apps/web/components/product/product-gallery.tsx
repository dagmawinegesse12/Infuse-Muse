'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ThemedImage } from '@/components/system/themed-image';

export type GallerySlide = {
  src: string;
  /** Present only on the main product shot, which has one photo per theme. */
  srcLight?: string;
  alt: string;
};

/**
 * The product photographs, one at a time, with arrows on the edges of the image.
 *
 * The frame is square on purpose. The tin shots are 1800×1800 so they are not
 * cropped at all, and the still-life photographs are 3:2, which a square frame
 * trims only at the outer edges. A portrait frame would have cut both bowls out
 * of those, and a landscape one would have taken the lid off the tins.
 *
 * Slide one is a ThemedImage, so it keeps the night/light pair that the rest of
 * the site uses. The others are single photographs on a pale ground that read
 * correctly in either theme.
 *
 * Every slide stays mounted and is cross-faded, so moving between them never
 * shows a blank frame while a photograph decodes. Inactive slides are hidden
 * from assistive tech and from the pointer.
 */
export function ProductGallery({ slides }: { slides: GallerySlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + count) % count),
    [count]
  );

  // Left and right arrow keys move the gallery, but only when there is
  // somewhere to move to.
  useEffect(() => {
    if (count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, go]);

  return (
    <div
      className="plate relative aspect-square w-full overflow-hidden"
      role="group"
      aria-roledescription="carousel"
      aria-label="Product photographs"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-500 ease-muse"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? undefined : 'none' }}
          aria-hidden={i !== index}
        >
          {slide.srcLight ? (
            <ThemedImage
              src={slide.src}
              srcLight={slide.srcLight}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {count > 1 ? (
        <>
          <GalleryArrow direction="prev" onClick={() => go(-1)} />
          <GalleryArrow direction="next" onClick={() => go(1)} />

          {/* Position, and a way to jump straight to a photograph. */}
          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photograph ${i + 1} of ${count}`}
                aria-current={i === index}
                className="h-6 w-6 p-2"
              >
                <span
                  className="block h-1.5 w-1.5 rounded-full transition-opacity duration-300"
                  style={{ background: '#fff', opacity: i === index ? 1 : 0.45 }}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

/**
 * Sits on the edge of the photograph. The stills are pale and the tins are
 * dark, so the control carries its own translucent ground rather than relying
 * on contrast with whatever is behind it.
 */
function GalleryArrow({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous photograph' : 'Next photograph'}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white transition-colors duration-300 ${
        isPrev ? 'left-3' : 'right-3'
      }`}
      style={{ background: 'rgba(0,0,0,0.35)' }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points={isPrev ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
      </svg>
    </button>
  );
}
