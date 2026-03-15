import Link from 'next/link';
import { stripe } from '@/lib/stripe';
import { ClearCart } from './clear-cart';

interface Props {
  searchParams: { session_id?: string };
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(cents / 100);
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;

  let customerName: string | null = null;
  let amountTotal: number | null = null;
  let orderRef: string | null = null;
  type OrderItem = { name: string; qty: number; unit: number };
  let orderItems: OrderItem[] = [];

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerName = session.customer_details?.name ?? null;
      amountTotal = session.amount_total;
      orderRef = session.id.slice(-12).toUpperCase();

      const raw = session.metadata?.orderItems;
      if (raw) orderItems = JSON.parse(raw) as OrderItem[];
    } catch {
      // Non-fatal — page still renders gracefully without session data.
    }
  }

  const firstName = customerName?.split(' ')[0];
  const greeting = firstName ? `Thank you, ${firstName}.` : 'Thank you.';

  return (
    <>
      <ClearCart />

      <div className="mx-auto max-w-xl px-4 py-16 sm:py-24">

        {/* Header */}
        <div className="rounded-[2.5rem] bg-[#173c33] px-8 py-12 text-center text-white">
          <div
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">
            Infuse &amp; Muse
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal">
            Order confirmed.
          </h1>
          <p className="mt-3 text-sm text-white/55">
            {greeting} Your confirmation email is on its way.
          </p>
        </div>

        {/* Order summary card */}
        <div className="mt-4 rounded-[2rem] border border-emerald-950/10 bg-white/80 px-8 py-8">

          {orderItems.length > 0 && (
            <>
              <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-[#c79f3d]">
                Order Summary
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#ede7dd]">
                    <th className="pb-2 text-left text-[11px] font-normal uppercase tracking-[0.14em] text-[#9a8f83]">Blend</th>
                    <th className="pb-2 text-center text-[11px] font-normal uppercase tracking-[0.14em] text-[#9a8f83]">Qty</th>
                    <th className="pb-2 text-right text-[11px] font-normal uppercase tracking-[0.14em] text-[#9a8f83]">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, i) => (
                    <tr key={i} className="border-b border-[#ede7dd]">
                      <td className="py-3 font-serif text-[15px] text-emerald-950">{item.name}</td>
                      <td className="py-3 text-center text-[#7a6a56]">&times; {item.qty}</td>
                      <td className="py-3 text-right text-emerald-950">{formatPrice(item.unit * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                {amountTotal !== null && (
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="pt-4 text-[12px] uppercase tracking-[0.14em] text-[#9a8f83]">Total paid</td>
                      <td className="pt-4 text-right font-serif text-[22px] text-emerald-950">{formatPrice(amountTotal)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>

              <div className="my-6 border-t border-[#ede7dd]" />
            </>
          )}

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#c79f3d]">
            What Happens Next
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5a6e68]">
            We&apos;ll reach out with pickup or shipping details. Questions?
            Email us at{' '}
            <a href="mailto:hello@infuseandmuse.ca" className="text-[#173c33] underline">
              hello@infuseandmuse.ca
            </a>
            .
          </p>

          {orderRef && (
            <p className="mt-4 text-[11px] text-[#a89e90]">
              Order ref: {orderRef}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="flex-1 rounded-full bg-[#173c33] px-6 py-3.5 text-center font-serif text-sm text-white"
          >
            Explore more blends
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-full border border-emerald-950/15 bg-white/80 px-6 py-3.5 text-center text-sm text-emerald-950"
          >
            Return home
          </Link>
        </div>
      </div>
    </>
  );
}
