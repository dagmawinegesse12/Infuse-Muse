'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart/cart-context';
import { MAX_TICKETS_PER_ORDER, type SaleState } from '@/lib/event';
import { formatPrice } from '@/lib/utils';

const MESSAGES: Record<Exclude<SaleState, 'on-sale'>, string> = {
  'not-on-sale': 'Tickets are not on sale yet.',
  'sold-out': 'Sold out.',
  closed: 'Ticket sales have closed.',
  past: 'This gathering has passed.',
};

export function TicketPurchase({
  state,
  variantId,
  priceCents,
  currency,
  priceNote,
  invite,
}: {
  state: SaleState;
  variantId?: string;
  priceCents?: number;
  currency?: string;
  priceNote: string;
  invite?: string;
}) {
  const { addItem, state: cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  /* The QR code opens /events?from=qr. Those visitors came for the ticket, so
     Get tickets takes them straight to checkout instead of opening the bag. */
  const [direct, setDirect] = useState(false);
  const [heading, setHeading] = useState(false);

  useEffect(() => {
    try {
      setDirect(new URLSearchParams(window.location.search).get('from') === 'qr');
    } catch {
      setDirect(false);
    }
  }, []);

  const held = cart.items
    .filter((item) => item.variantId === variantId)
    .reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!heading || cart.pending) return;
    if (cart.error || !cart.checkoutUrl || held === 0) {
      setHeading(false);
      return;
    }
    window.location.assign(cart.checkoutUrl);
  }, [heading, cart.pending, cart.error, cart.checkoutUrl, held]);

  if (state !== 'on-sale' || !variantId) {
    return (
      <p className="t-sub" role="status">
        {MESSAGES[state === 'on-sale' ? 'not-on-sale' : state]}
      </p>
    );
  }

  const step = (by: number) =>
    setQuantity((q) => Math.min(MAX_TICKETS_PER_ORDER, Math.max(1, q + by)));

  const getTickets = async () => {
    await addItem({ variantId, quantity, openCart: !direct, invite });
    if (direct) setHeading(true);
  };

  const busy = cart.pending || heading;

  return (
    <div>
      <p className="t-label">Tickets</p>
      <p className="t-body t-body--lead mt-3">
        <span style={{ color: 'var(--ink-strong)' }}>{formatPrice(priceCents ?? 0, currency)}</span>{' '}
        {priceNote}
      </p>

      <div className="mt-8 flex items-center gap-6">
        <div
          className="inline-flex items-center border"
          style={{ borderColor: 'var(--rule-strong)' }}
        >
          <button
            type="button"
            aria-label="One fewer ticket"
            className="h-12 w-12 text-lg"
            disabled={quantity <= 1}
            onClick={() => step(-1)}
          >
            −
          </button>
          <span className="w-10 text-center" aria-live="polite" aria-label="Number of tickets">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="One more ticket"
            className="h-12 w-12 text-lg"
            disabled={quantity >= MAX_TICKETS_PER_ORDER}
            onClick={() => step(1)}
          >
            +
          </button>
        </div>

        <Button disabled={busy} onClick={getTickets}>
          {heading ? 'Taking you to checkout…' : cart.pending ? 'Adding…' : 'Get tickets'}
        </Button>
      </div>

      <p className="t-body mt-5">Up to {MAX_TICKETS_PER_ORDER} tickets per order.</p>
      {cart.error ? (
        <p className="t-body mt-3" role="alert">
          {cart.error}
        </p>
      ) : null}

      {held > 0 && cart.checkoutUrl && !heading ? (
        <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--rule)' }}>
          <p className="t-body">
            {held === 1 ? '1 ticket' : `${held} tickets`} in your bag.
          </p>
          <Button variant="secondary" href={cart.checkoutUrl} className="mt-4">
            Checkout
          </Button>
        </div>
      ) : null}
    </div>
  );
}
