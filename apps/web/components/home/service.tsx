import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

const SERVICES: Array<[string, string, string]> = [
  ['Local pickup', 'Collect in Mississauga, no shipping wait.', '/faq'],
  ['Gift wrapping', 'Hand-tied, with a written card.', '/contact'],
  ['Small batch', 'Blended to order, never warehoused.', '/about'],
  ['Private blending', 'Compositions made for one table.', '/contact'],
];

/** A direct nod to the reference's "At your service" band — four hairline columns. */
export function Service() {
  return (
    <section
      className="bleed border-y py-[clamp(3.5rem,7vw,6rem)]"
      style={{ borderColor: 'var(--rule)', background: 'var(--ground-2)' }}
    >
      <div className="shell">
        <Reveal>
          <p className="t-label t-label--accent">At your service</p>
        </Reveal>
        <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(([title, copy, href], i) => (
            <Reveal key={title} delay={i * 70}>
              <div className="border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
                <h3 className="t-sub">{title}</h3>
                <p className="t-body mt-3">{copy}</p>
                <div className="mt-6">
                  <QuietLink href={href}>Discover</QuietLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
