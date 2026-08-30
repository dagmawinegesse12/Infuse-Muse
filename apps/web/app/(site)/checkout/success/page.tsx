import { stripe } from '@/lib/stripe';
import { resolveOrderItems, type OrderItem } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';
import { QuietLink } from '@/components/system/quiet-link';
import { ClearCart } from './clear-cart';

interface Props {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;

  let customerName: string | null = null;
  let amountTotal: number | null = null;
  let orderRef: string | null = null;
  let orderItems: OrderItem[] = [];

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerName = session.customer_details?.name ?? null;
      amountTotal = session.amount_total;
      orderRef = session.id.slice(-12).toUpperCase();

      orderItems = await resolveOrderItems(session);
    } catch {
      // Non-fatal — the page still renders without session data.
    }
  }

  const firstName = customerName?.split(' ')[0];

  return (
    <>
      <ClearCart />

      <div className="shell mx-auto max-w-2xl pb-[var(--chapter)] pt-[var(--header-clear)]">
        <div className="text-center">
          <p className="t-label t-label--accent">Order confirmed</p>
          <h1 className="t-display mt-8">
            {firstName ? `Thank you, ${firstName}.` : 'Thank you.'}
          </h1>
          <p className="t-body t-body--lead mt-8">Your confirmation email is on its way.</p>
        </div>

        {orderItems.length > 0 ? (
          <div className="mt-[clamp(3rem,7vw,5rem)]">
            <h2 className="t-label">Order summary</h2>
            <dl className="mt-7">
              {orderItems.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex items-baseline justify-between gap-6 border-t py-5"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <dt className="t-sub">
                    {item.name}
                    <span className="t-label ml-3">× {item.qty}</span>
                  </dt>
                  <dd className="t-price">{formatPrice(item.unit * item.qty)}</dd>
                </div>
              ))}
              {amountTotal !== null ? (
                <div
                  className="flex items-baseline justify-between border-t border-b py-6"
                  style={{ borderColor: 'var(--rule-strong)' }}
                >
                  <dt className="t-sub">Total paid</dt>
                  <dd className="t-price text-[1.125rem]">{formatPrice(amountTotal)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : null}

        <div className="mt-[clamp(3rem,7vw,5rem)] border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
          <h2 className="t-label">What happens next</h2>
          <p className="t-body mt-5 max-w-measure">
            We will reach out with pickup or shipping details. Any questions, write to{' '}
            <a href="mailto:hello@infuseandmuse.com" className="wipe-link text-ink">
              hello@infuseandmuse.com
            </a>
            .
          </p>
          {orderRef ? <p className="t-label mt-8">Order ref · {orderRef}</p> : null}
        </div>

        <div className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
          <QuietLink href="/products">Explore more blends</QuietLink>
          <QuietLink href="/">Return home</QuietLink>
        </div>
      </div>
    </>
  );
}
