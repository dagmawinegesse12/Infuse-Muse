import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { ContactForm } from '@/components/contact-form';

const DETAILS: Array<[string, string]> = [
  ['Location', 'Mississauga, Ontario, Canada'],
  ['Email', 'hello@infuseandmuse.com'],
  ['Pickup', 'Available on select local orders'],
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Questions, gifting, or local pickup?"
        lede="For product questions, partnerships, event gifting, or arranging a pickup in Mississauga."
      />

      <section className="shell grid gap-x-[clamp(2rem,6vw,6rem)] gap-y-16 pb-[var(--chapter)] lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <dl>
            {DETAILS.map(([label, value]) => (
              <div key={label} className="border-t py-6" style={{ borderColor: 'var(--rule)' }}>
                <dt className="t-label">{label}</dt>
                <dd className="t-body mt-3">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={110}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
