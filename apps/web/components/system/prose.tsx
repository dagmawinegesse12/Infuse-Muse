import type { ReactNode } from 'react';
import { Reveal } from '@/components/system/reveal';

export function ProseSection({
  heading,
  children,
  index,
}: {
  heading: string;
  children: ReactNode;
  index: number;
}) {
  return (
    <Reveal delay={Math.min(index, 5) * 60}>
      <section
        className="grid gap-4 border-t py-10 lg:grid-cols-[4rem_18rem_1fr] lg:gap-10"
        style={{ borderColor: 'var(--rule)' }}
      >
        <span className="t-numeral pt-1">{String(index + 1).padStart(2, '0')}</span>
        <h2 className="t-sub">{heading}</h2>
        <div className="prose-muse max-w-measure">{children}</div>
      </section>
    </Reveal>
  );
}

/** Paragraph inside a ProseSection. */
export function P({ children }: { children: ReactNode }) {
  return <p className="t-body [&+&]:mt-5">{children}</p>;
}

/** Bulleted list inside a ProseSection. */
export function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="t-body flex gap-4">
          <span aria-hidden style={{ color: 'var(--accent)' }}>
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalFooterNote({ updated }: { updated: string }) {
  return (
    <Reveal>
      <p className="t-label mt-14">Last updated · {updated}</p>
    </Reveal>
  );
}
