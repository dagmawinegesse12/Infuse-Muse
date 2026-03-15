import { getFaqs } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#173c33] px-8 py-14 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-100/70">FAQ</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            Helpful answers before your next cup.
          </h1>
          <p className="mt-4 text-base leading-8 text-emerald-50/80">
            Everything you need to know about our blends, ordering, and local pickup in Mississauga.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {faqs.map((faq) => (
          <article key={faq._id} className="rounded-[2rem] border border-emerald-950/10 bg-white/80 p-6">
            <h2 className="font-serif text-2xl text-emerald-950">{faq.question}</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-950/65">{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[2.5rem] bg-[#173c33] p-10 text-white">
        <h2 className="font-serif text-3xl">Still have questions?</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-emerald-50/75">
          Reach out directly for anything not covered here — gifting, local pickup, or custom orders in Mississauga.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/contact">Contact us</Button>
          <Button href="/products" variant="secondary">Browse teas</Button>
        </div>
      </section>
    </div>
  );
}
