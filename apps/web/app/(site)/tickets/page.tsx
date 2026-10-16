import type { Metadata } from 'next';
import { TicketLookup } from '@/components/event/ticket-lookup';
import { PageHeader } from '@/components/system/page-header';

export const metadata: Metadata = { title: 'Find my tickets', robots: { index: false, follow: false } };

export default function FindTicketsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Opening Pour"
        title="Find my tickets"
        lede="Enter the order number from your confirmation email and the email you used to buy."
      />
      <section className="shell pb-[var(--chapter)]">
        <TicketLookup />
      </section>
    </>
  );
}
