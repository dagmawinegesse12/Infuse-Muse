/**
 * The street address, shown only to people holding a valid ticket: in the
 * ticket email and on their ticket pages. Everywhere public says "Downtown
 * Toronto" (EVENT.venueLabel in lib/event.ts). Keep this file out of anything
 * a browser or a search engine can reach without a ticket: import it from
 * server code that has already checked an order, never from a client component.
 */
export const VENUE = {
  street: '87 Wade Ave',
  city: 'Toronto',
  region: 'ON',
  postalCode: 'M6H 1P5',
} as const;

export const venueAddress = () => `${VENUE.street}, ${VENUE.city}, ${VENUE.region} ${VENUE.postalCode}`;

export function venueMapLinks() {
  const query = encodeURIComponent(venueAddress()).replace(/%20/g, '+').replace(/%2C/g, ',');
  return {
    google: `https://www.google.com/maps?q=${query}&ftid=0x882b34472d414009:0x55d72a744b79bac0`,
    apple: `https://maps.apple.com/?q=${query}`,
  };
}
