import { EVENT } from './event';
import { venueAddress, venueMapLinks } from './event-venue';

/**
 * What the event page says for "Where". The street address goes only to a
 * visitor on the owner's private invite link (or the invite QR, which carries
 * it); the public page says the area. Server-only, like the venue file.
 */
export type Where = {
  text: string;
  maps: { google: string; apple: string } | null;
};

export function whereFor(invited: boolean): Where {
  return invited
    ? { text: venueAddress(), maps: venueMapLinks() }
    : { text: EVENT.venueLabel, maps: null };
}
