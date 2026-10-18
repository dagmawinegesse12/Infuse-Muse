import { EVENT, dateLabel, timeLabel } from '@/lib/event';
import { venueAddress, venueMapLinks } from '@/lib/event-venue';
import { absoluteUrl } from '@/lib/metadata';
import { qrSvg } from '@/lib/qr';
import { publicName } from '@/lib/tickets';
import { signTicket } from '@/lib/ticket-token';

/**
 * One ticket: a name, the details including the street address (ticket holders
 * only), and a QR that opens /t/<token>, which is also what the door scanner reads. Digits stay in the body face while the
 * display font is a trial licence.
 */
export async function TicketCard({
  orderId,
  position,
  total,
  holder,
  used,
}: {
  orderId: string;
  position: number;
  total: number;
  holder: string;
  used: boolean;
}) {
  const svg = await qrSvg(absoluteUrl(`/t/${signTicket(orderId, position)}`));
  const maps = venueMapLinks();

  return (
    <article
      className="grid gap-8 border p-6 sm:grid-cols-[1fr_12rem] sm:p-8"
      style={{ borderColor: 'var(--rule-strong)' }}
    >
      <div>
        <p className="t-label t-label--accent">
          Ticket {position} of {total}
        </p>
        <h2 className="t-sub mt-4">{EVENT.name}</h2>
        <p className="t-body t-body--lead mt-4" style={{ color: 'var(--ink-strong)' }}>
          {publicName(holder)}
        </p>
        <p className="t-body mt-4">
          {dateLabel()}
          <br />
          {timeLabel()}
          <br />
          {venueAddress()}
        </p>
        <p className="mt-3 flex gap-x-6">
          <a href={maps.google} target="_blank" rel="noreferrer noopener" className="wipe-link t-body">
            Google Maps
          </a>
          <a href={maps.apple} target="_blank" rel="noreferrer noopener" className="wipe-link t-body">
            Apple Maps
          </a>
        </p>
        {used ? (
          <p className="t-label mt-6" role="status">
            Already used
          </p>
        ) : null}
      </div>
      <div
        role="img"
        aria-label={`QR code for ticket ${position} of ${total}`}
        className="mx-auto w-full max-w-[12rem]"
        style={{ opacity: used ? 0.35 : 1 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </article>
  );
}
