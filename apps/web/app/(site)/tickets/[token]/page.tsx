import type { Metadata } from 'next';
import { TicketCard } from '@/components/event/ticket-card';
import { PageHeader } from '@/components/system/page-header';
import { QuietLink } from '@/components/system/quiet-link';
import { adminConfigured, fetchTicketOrder } from '@/lib/shopify-admin';
import { STATUS_MESSAGE } from '@/lib/tickets';
import { verifyOrder } from '@/lib/ticket-token';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your tickets', robots: { index: false, follow: false } };

export default async function YourTicketsPage({ params }: { params: { token: string } }) {
  const verified = process.env.TICKET_SECRET ? verifyOrder(params.token) : null;
  const order = verified && adminConfigured() ? await fetchTicketOrder(verified.orderId).catch(() => null) : null;

  if (!order || order.status === 'none') {
    return (
      <>
        <PageHeader eyebrow="Opening Pour" title="We could not open these tickets." />
        <section className="shell pb-[var(--chapter)]">
          <p className="t-body max-w-measure">
            The link may be incomplete. You can find your tickets again with your order number and email.
          </p>
          <div className="mt-8">
            <QuietLink href="/tickets">Find my tickets</QuietLink>
          </div>
        </section>
      </>
    );
  }

  if (order.status !== 'ok') {
    return (
      <>
        <PageHeader eyebrow="Opening Pour" title="Your tickets" />
        <section className="shell pb-[var(--chapter)]">
          <p className="t-body max-w-measure" role="status">
            {STATUS_MESSAGE[order.status]} Order {order.name}.
          </p>
          <div className="mt-8">
            <QuietLink href="/contact">Ask us a question</QuietLink>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`Order ${order.name}`}
        title="Your tickets"
        lede="Show the code on your ticket at the door. A screenshot works."
      />
      <section className="shell pb-[var(--chapter)]">
        <div className="grid max-w-3xl gap-8">
          {Array.from({ length: order.total }, (_, i) => i + 1).map((position) => (
            <TicketCard
              key={position}
              orderId={order.orderId}
              position={position}
              total={order.total}
              holder={order.holder}
              used={order.admitted.includes(position)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
