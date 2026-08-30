'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Stagger in ms. Siblings 80ms apart read as one gesture. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Fades a block up once, the first time it enters the viewport.
 * Deliberately one-shot: nothing re-animates on scroll-back.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-in={shown ? 'true' : 'false'}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
