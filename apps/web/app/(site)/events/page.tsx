import Image from 'next/image';
import { TicketPurchase } from '@/components/event/ticket-purchase';
import { TicketRequestForm } from '@/components/event/ticket-request-form';
import { PageHeader } from '@/components/system/page-header';
import { QuietLink } from '@/components/system/quiet-link';
import { Reveal } from '@/components/system/reveal';
import { SchemaScript } from '@/components/schema-script';
import { getEventTicket } from '@/lib/data';
import { isValidInvite } from '@/lib/event-invite';
import {
  EVENT,
  INVITE_PARAM,
  dateLabel,
  googleCalendarUrl,
  saleState,
  timeLabel,
} from '@/lib/event';
import { absoluteUrl, createMetadata } from '@/lib/metadata';
import { formatPrice } from '@/lib/utils';

const PHOTO = '/images/events/opening-pour.jpg';

export const metadata = createMetadata({
  title: EVENT.name,
  description: `${dateLabel()}, ${timeLabel()}, ${EVENT.venueLabel}.`,
  path: '/events',
  image: PHOTO,
});

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const ticket = await getEventTicket();
  const state = saleState(new Date(), ticket);

  /* Tickets are by request. A guest the owner has approved arrives on a
     private link carrying the invite code; everyone else sees the request
     form. The code is checked here on the server and again by the cart. */
  const raw = searchParams[INVITE_PARAM];
  const code = Array.isArray(raw) ? raw[0] : raw;
  const invited = isValidInvite(code);
  const sellable = state === 'on-sale' || state === 'not-on-sale';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: EVENT.name,
    startDate: EVENT.startsAt.toISOString(),
    endDate: EVENT.endsAt.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: EVENT.venueLabel,
      address: { '@type': 'PostalAddress', addressLocality: 'Toronto', addressRegion: 'ON', addressCountry: 'CA' },
    },
    image: [absoluteUrl(PHOTO)],
    organizer: { '@type': 'Organization', name: 'Infuse & Muse', url: absoluteUrl('/') },
  };

  const rows: [string, React.ReactNode][] = [
    ['When', dateLabel()],
    ['Time', timeLabel()],
    ['Tickets', `${formatPrice(ticket?.priceCents ?? EVENT.priceCents, ticket?.currency)} ${EVENT.priceNote}`],
    ['Where', EVENT.venueLabel],
  ];

  return (
    <>
      <SchemaScript data={schema} />
      <PageHeader eyebrow="Gathering" title={EVENT.name} />

      <section className="shell pb-[var(--chapter)]">
        <div className="grid gap-14 lg:grid-cols-[1fr_26rem] lg:gap-20">
          <div>
            {rows.map(([label, value], i) => (
              <Reveal key={label} delay={i * 70}>
                <div
                  className="grid gap-3 border-b py-8 sm:grid-cols-[8rem_1fr] sm:gap-10"
                  style={{ borderColor: 'var(--rule)' }}
                >
                  <h2 className="t-label">{label}</h2>
                  <div className="t-body t-body--lead">{value}</div>
                </div>
              </Reveal>
            ))}

            {EVENT.description ? (
              <Reveal delay={220}>
                <p className="t-body t-body--lead mt-10 max-w-measure">{EVENT.description}</p>
              </Reveal>
            ) : null}

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
                <a
                  href={googleCalendarUrl(absoluteUrl('/events'))}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="quiet-link"
                  data-tone="ground"
                >
                  Add to Google Calendar
                </a>
              </div>
            </Reveal>
          </div>

          <aside className="lg:pt-8">
            <Reveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={PHOTO}
                  alt="An antelope resting on a deep green velvet sofa"
                  fill
                  sizes="(min-width: 1024px) 26rem, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10">
                {sellable && !invited ? (
                  <TicketRequestForm />
                ) : (
                  <TicketPurchase
                    state={state}
                    variantId={invited ? ticket?.variantId : undefined}
                    priceCents={ticket?.priceCents}
                    currency={ticket?.currency}
                    priceNote={EVENT.priceNote}
                    invite={invited ? code : undefined}
                  />
                )}
              </div>
            </Reveal>
          </aside>
        </div>

        <Reveal>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
            <QuietLink href="/contact">Ask us a question</QuietLink>
            <QuietLink href="/products">Browse the blends</QuietLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
