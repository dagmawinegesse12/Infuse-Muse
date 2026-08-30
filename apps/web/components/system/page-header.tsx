import { Reveal } from '@/components/system/reveal';

/**
 * The opening of every inner page. Sits on the ground rather than inside a
 * panel — the old build wrapped these in a dark rounded card, which is exactly
 * the vocabulary this system removes.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="shell pb-[clamp(2.5rem,5vw,4rem)] pt-[var(--header-clear)]">
      <Reveal>
        <p className="t-label t-label--accent">{eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="t-display mt-6 max-w-3xl">{title}</h1>
      </Reveal>
      {lede ? (
        <Reveal delay={160}>
          <p className="t-body t-body--lead mt-8 max-w-measure">{lede}</p>
        </Reveal>
      ) : null}
      <Reveal delay={220}>
        <hr className="rule mt-[clamp(2.5rem,5vw,4rem)]" />
      </Reveal>
    </header>
  );
}
