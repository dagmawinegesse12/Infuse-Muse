/**
 * The Nov 15 gathering. One event for now, so it lives in code rather than a
 * CMS; the ticket itself is a Shopify product, found by handle and Product type.
 *
 * Toronto is on standard time (UTC-5) by Nov 15: daylight saving ends Nov 1.
 */
export const TICKET_HANDLE = "tea-gathering-ticket";
export const TICKET_PRODUCT_TYPE = "Event ticket";
export const MAX_TICKETS_PER_ORDER = 6;
/** Query parameter on the private link the owner sends to approved guests. */
export const INVITE_PARAM = "invite";

export const EVENT = {
  name: "Opening Pour",
  /** Owner copy, shown only when filled in. */
  description: "",
  startsAt: new Date("2026-11-15T16:00:00-05:00"),
  endsAt: new Date("2026-11-15T20:00:00-05:00"),
  salesCloseAt: new Date("2026-11-15T14:00:00-05:00"),
  timeZone: "America/Toronto",
  address: {
    street: "87 Wade Ave",
    city: "Toronto",
    region: "ON",
    postalCode: "M6H 1P5",
    country: "CA",
  },
  /** Shown until Shopify has the live price. */
  priceCents: 2500,
  priceNote: "plus HST",
} as const;

export type SaleState = "not-on-sale" | "on-sale" | "sold-out" | "closed" | "past";

export function saleState(
  now: Date,
  ticket: { availableForSale: boolean } | null
): SaleState {
  if (now >= EVENT.endsAt) return "past";
  if (now >= EVENT.salesCloseAt) return "closed";
  if (!ticket) return "not-on-sale";
  if (!ticket.availableForSale) return "sold-out";
  return "on-sale";
}

export const addressLine = () => {
  const a = EVENT.address;
  return `${a.street}, ${a.city}, ${a.region} ${a.postalCode}`;
};

export const mapLinks = () => {
  const query = encodeURIComponent(addressLine()).replace(/%20/g, "+").replace(/%2C/g, ",");
  return {
    google: `https://www.google.com/maps?q=${query}&ftid=0x882b34472d414009:0x55d72a744b79bac0`,
    apple: `https://maps.apple.com/?q=${query}`,
  };
};

function format(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: EVENT.timeZone, ...options }).format(date);
}

export const dateLabel = () =>
  format(EVENT.startsAt, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

const hour = (date: Date) =>
  format(date, { hour: "numeric", minute: "2-digit" })
    .replace(/\u202f|\s/g, " ")
    .replace(":00", "")
    .replace(/\s?([ap])\.?m\.?/i, (_, m: string) => ` ${m.toLowerCase()}m`);

export const timeLabel = () => `${hour(EVENT.startsAt)} to ${hour(EVENT.endsAt)}`;

const calendarDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(pageUrl: string) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT.name,
    dates: `${calendarDate(EVENT.startsAt)}/${calendarDate(EVENT.endsAt)}`,
    location: addressLine(),
    details: pageUrl,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function ticketsInCart(lines: { variantId: string; quantity: number }[], variantId: string) {
  return lines.reduce((sum, l) => (l.variantId === variantId ? sum + l.quantity : sum), 0);
}
