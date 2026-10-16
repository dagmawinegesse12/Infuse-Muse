import type { Metadata } from 'next';
import { TicketCard } from '@/components/event/ticket-card';
import { PageHeader } from '@/components/system/page-header';
import { adminConfigured, fetchTicketOrder } from '@/lib/shopify-admin';
import { STATUS_MESSAGE } from '@/lib/tickets';
import { verifyTicket } from '@/lib/ticket-token';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Ticket', robots: { index: false, follow: false } };

export default async function TicketPage({ params }: { params: { token: string } }) {
  const ticket = process.env.TICKET_SECRET ? verifyTicket(params.token) : null;
  const order = ticket && adminConfigured() ? await fetchTicketOrder(ticket.orderId).catch(() => null) : null;

  const usable = ticket && order && order.status === 'ok' && ticket.position <= order.total;
  if (!ticket || !order || !usable) {
    const reason = order && order.status !== 'ok' && order.status !== 'none' ? STATUS_MESSAGE[order.status] : null;
    return (
      <>
        <PageHeader eyebrow="Opening Pour" title="This ticket is not valid." />
        <section className="shell pb-[var(--chapter)]">
          <p className="t-body max-w-measure" role="status">
            {reason ?? 'The code could not be verified.'}
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={`Order ${order.name}`} title="Your ticket" />
      <section className="shell pb-[var(--chapter)]">
        <div className="max-w-3xl">
          <TicketCard
            orderId={order.orderId}
            position={ticket.position}
            total={order.total}
            holder={order.holder}
            used={order.admitted.includes(ticket.position)}
          />
        </div>
      </section>
    </>
  );
}
