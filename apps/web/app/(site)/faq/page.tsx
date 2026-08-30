import { getFaqs } from '@/lib/data';
import { PageHeader } from '@/components/system/page-header';
import { Reveal } from '@/components/system/reveal';
import { QuietLink } from '@/components/system/quiet-link';

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageHeader
        eyebrow="Questions"
        title="Helpful answers before your next cup."
        lede="Ordering, storage, gifting and local pickup in Mississauga."
      />

      <section className="shell pb-[var(--chapter)]">
        {faqs.map((faq, i) => (
          <Reveal key={faq._id} delay={i * 70}>
            <article
              className="grid gap-4 border-b py-10 lg:grid-cols-[24rem_1fr] lg:gap-10"
              style={{ borderColor: 'var(--rule)' }}
            >
              <h2 className="t-sub">{faq.question}</h2>
              <p className="t-body max-w-measure">{faq.answer}</p>
            </article>
          </Reveal>
        ))}

        <Reveal>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
            <QuietLink href="/contact">Ask us directly</QuietLink>
            <QuietLink href="/products">Browse the blends</QuietLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
