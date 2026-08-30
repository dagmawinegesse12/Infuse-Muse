import { Resend } from 'resend';

/**
 * Lazily-constructed Resend client.
 *
 * `new Resend(undefined)` throws at construction time. Building the client at
 * module scope therefore makes the whole module fail to import when
 * RESEND_API_KEY is unset, which breaks `next build` while it collects route
 * data — so any environment without the key (preview deploys, CI, a fresh
 * clone) cannot build at all. Constructing on first use keeps the build green
 * and turns a missing key into a handled runtime error instead.
 */
let client: Resend | null = null;

export const emailEnabled = (): boolean => Boolean(process.env.RESEND_API_KEY);

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error('RESEND_API_KEY is not set');
  }
  if (!client) client = new Resend(key);
  return client;
}
