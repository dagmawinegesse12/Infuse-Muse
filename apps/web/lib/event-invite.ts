import { timingSafeEqual } from 'crypto';

/**
 * Tickets are by request. The owner approves a guest by sending the private
 * link `/events?invite=<code>`; the code lives in EVENT_INVITE_CODE. Changing
 * that variable retires every link already sent. Server-only: it uses Node's
 * crypto, so the browser never sees it.
 */
export function isValidInvite(code: unknown): boolean {
  const secret = process.env.EVENT_INVITE_CODE;
  if (!secret || typeof code !== 'string' || !code) return false;
  const given = Buffer.from(code);
  const wanted = Buffer.from(secret);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}
