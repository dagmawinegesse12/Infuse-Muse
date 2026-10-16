import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Tickets are not stored anywhere: a ticket is an order number plus a position
 * (1st, 2nd... of the tickets on that order), and its link carries an HMAC so
 * it cannot be guessed or edited. TICKET_SECRET signs them; changing it
 * retires every link already handed out. Server-only (Node crypto).
 */
const SIG_LENGTH = 20;

function sign(message: string): string {
  const secret = process.env.TICKET_SECRET;
  if (!secret) throw new Error('TICKET_SECRET is not set.');
  return createHmac('sha256', secret).update(message).digest('hex').slice(0, SIG_LENGTH);
}

function matches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const ID = /^\d{6,20}$/;
const SIG = new RegExp(`^[0-9a-f]{${SIG_LENGTH}}$`);

/** Link to every ticket on one order: `<orderId>.<sig>`. */
export const signOrder = (orderId: string) => `${orderId}.${sign(`o:${orderId}`)}`;

export function verifyOrder(token: string): { orderId: string } | null {
  const [orderId, sig, ...rest] = token.split('.');
  if (rest.length || !ID.test(orderId ?? '') || !SIG.test(sig ?? '')) return null;
  return matches(sig, sign(`o:${orderId}`)) ? { orderId } : null;
}

/** One ticket: `<orderId>-<position>-<sig>`, position counting from 1. */
export const signTicket = (orderId: string, position: number) =>
  `${orderId}-${position}-${sign(`t:${orderId}:${position}`)}`;

export function verifyTicket(token: string): { orderId: string; position: number } | null {
  const [orderId, pos, sig, ...rest] = token.split('-');
  if (rest.length || !ID.test(orderId ?? '') || !/^\d{1,3}$/.test(pos ?? '') || !SIG.test(sig ?? '')) {
    return null;
  }
  const position = Number(pos);
  if (position < 1) return null;
  return matches(sig, sign(`t:${orderId}:${position}`)) ? { orderId, position } : null;
}
