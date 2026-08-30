import Link from 'next/link';
import type { ReactNode } from 'react';

/** Where the link sits — decides which ink it takes. */
type Tone = 'ground' | 'plate' | 'media';

/**
 * The only call to action in the system: a word and a hairline.
 * There are no filled buttons anywhere in the storefront chrome.
 */
export function QuietLink({
  href,
  children,
  tone = 'ground',
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <Link href={href} data-tone={tone} className={`quiet-link ${className}`.trim()}>
      {children}
    </Link>
  );
}
