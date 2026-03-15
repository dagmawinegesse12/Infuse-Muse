import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2.5rem] bg-[#173c33] p-10 text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/60">Contact</p>
        <h1 className="mt-4 font-serif text-5xl">Questions, gifting, or local pickup?</h1>
        <p className="mt-5 text-base leading-8 text-emerald-50/75">
          Reach out for product questions, partnerships, event gifting, or pickup coordination in Mississauga.
        </p>
        <div className="mt-8 space-y-4 text-sm text-emerald-50/75">
          <p><strong className="text-white">Location:</strong> Mississauga, Ontario, Canada</p>
          <p><strong className="text-white">Email:</strong> hello@infuseandmuse.ca</p>
          <p><strong className="text-white">Pickup:</strong> Available on select local orders</p>
        </div>
      </section>
      <section className="rounded-[2.5rem] border border-emerald-950/10 bg-white/80 p-8">
        <h2 className="font-serif text-3xl text-emerald-950">Send a note</h2>
        <form className="mt-6 grid gap-4">
          <input className="rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-emerald-950 placeholder:text-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-900/20" placeholder="Your name" />
          <input className="rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-emerald-950 placeholder:text-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-900/20" placeholder="Email address" type="email" />
          <textarea className="min-h-40 rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-emerald-950 placeholder:text-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-900/20" placeholder="How can we help?" />
          <Button type="submit">Send inquiry</Button>
        </form>
      </section>
    </div>
  );
}
