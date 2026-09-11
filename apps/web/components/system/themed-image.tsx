import Image, { type ImageProps } from 'next/image';

/**
 * A photograph with one version per theme: `src` for night (the emerald
 * shots), `srcLight` for the light ground.
 *
 * Both are rendered and CSS shows the one that matches <html data-muse>, so
 * the right photo is there on first paint and swaps instantly with the toggle
 * — no hydration flash, no client state. The hidden one is `display: none`,
 * which keeps it out of the accessibility tree and, being lazy, unloaded.
 * `priority` applies to the night version only, the default theme.
 *
 * Without a distinct `srcLight` this is a plain next/image.
 */
export function ThemedImage({
  src,
  srcLight,
  className = '',
  priority,
  ...props
}: Omit<ImageProps, 'src'> & { src: string; srcLight?: string }) {
  if (!srcLight || srcLight === src) {
    return <Image src={src} className={className} priority={priority} {...props} />;
  }

  return (
    <>
      <Image
        src={src}
        className={`${className} muse-img--night`.trim()}
        priority={priority}
        {...props}
      />
      <Image src={srcLight} className={`${className} muse-img--light`.trim()} {...props} />
    </>
  );
}
