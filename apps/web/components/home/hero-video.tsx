'use client';

import { useRef, useState } from 'react';

/**
 * The hero film, with a sound control.
 *
 * The clip carries an audio track, but every browser blocks autoplay unless the
 * video starts muted — so it does, and the viewer opts in. Nothing about the
 * page depends on hearing it: the film is still atmosphere, and the words that
 * matter sit in the plate above it.
 *
 * Under `prefers-reduced-motion` the video is removed entirely by globals.css
 * and the poster underneath is all that remains; the control hides with it,
 * since there would be nothing left to unmute. That is the only case where it
 * hides — a control carrying sound must never be unreachable on a phone, which
 * is why this does not copy the scroll cue's `hidden sm:flex`.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    // Unmuting is a user gesture, so this is the moment a paused autoplay
    // video is allowed to start. Ignore rejection — the poster still shows.
    if (!next) void video.play().catch(() => {});
    setMuted(next);
  }

  return (
    <>
      <video
        ref={videoRef}
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-poster.jpg"
        aria-label="Infuse & Muse launch film"
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/*
        The wrapper carries the position, not the button. `.hit` sets
        `position: relative` to hang its 44px tap target off, and that beats
        Tailwind's `absolute` in the cascade — putting the two on one element
        pins the control to the top-left corner instead of the bottom-right.
      */}
      <div className="hero__sound absolute bottom-6 right-[var(--gutter)] z-10 sm:bottom-8">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="hit t-label flex items-center gap-3 rounded-full border px-4 py-2 backdrop-blur-sm"
          style={{
            color: 'var(--on-media)',
            borderColor: 'rgba(255, 255, 255, 0.22)',
            background: 'rgba(9, 37, 22, 0.32)',
          }}
        >
          {/* Three bars that stand up when the sound is on. */}
          <span aria-hidden className="flex h-3 items-end gap-[3px]">
            {[0.45, 1, 0.7].map((scale, i) => (
              <span
                key={i}
                className="block w-px origin-bottom transition-transform duration-500 ease-muse"
                style={{
                  height: '100%',
                  background: 'var(--on-media)',
                  transform: `scaleY(${muted ? 0.2 : scale})`,
                }}
              />
            ))}
          </span>
          {muted ? 'Sound' : 'Mute'}
        </button>
      </div>
    </>
  );
}
