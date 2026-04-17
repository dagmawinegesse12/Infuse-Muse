/**
 * Email service abstraction.
 *
 * Currently backed by Resend (free tier: 3,000 emails/month).
 * To swap providers, only update this file — all callers stay unchanged.
 *
 * Setup:
 *   1. Sign up at https://resend.com
 *   2. Create an API key
 *   3. Set RESEND_API_KEY in .env.local
 *   4. Set EMAIL_FROM in .env.local (use "onboarding@resend.dev" for testing,
 *      or a verified domain address for production)
 */
import { Resend } from 'resend';
import { generateOrderConfirmationHtml } from './templates/order-confirmation';
import { generateWaitlistConfirmationHtml } from './templates/waitlist-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export type OrderItem = {
  name: string;
  qty: number;
  unit: number; // price in cents
};

export type OrderConfirmationParams = {
  to: string;
  customerName?: string;
  orderItems: OrderItem[];
  amountTotal: number; // in cents
  sessionId: string;
};

export async function sendOrderConfirmation(
  params: OrderConfirmationParams
): Promise<void> {
  const { to, customerName, orderItems, amountTotal, sessionId } = params;

  // Default from address works for Resend test sends.
  // For production, set EMAIL_FROM to a verified domain address.
  const from =
    process.env.EMAIL_FROM || 'Infuse & Muse <onboarding@resend.dev>';

  const { error } = await resend.emails.send({
    from,
    to,
    subject: 'Your Infuse & Muse order is confirmed ✓',
    html: generateOrderConfirmationHtml({
      customerName,
      orderItems,
      amountTotal,
      sessionId,
    }),
  });

  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}

export async function sendWaitlistConfirmation(to: string): Promise<void> {
  const from =
    process.env.EMAIL_FROM || 'Infuse & Muse <onboarding@resend.dev>';

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "You're on the Infuse & Muse waitlist",
    html: generateWaitlistConfirmationHtml(to),
    text: [
      'Infuse & Muse — Luxury Tea, Toronto',
      '',
      'Welcome to Infuse & Muse.',
      '',
      'You are part of something quietly special.',
      '',
      'A collection rooted in botanicals, ritual, and stillness.',
      '',
      'Each blend is more than a drink. It is a moment.',
      '',
      'You will be among the first to enter.',
      '',
      'Until then, stay close.',
      '',
      '— Mar',
      '',
      '─',
      'Instagram: https://www.instagram.com/infuseandmuse',
      'Pinterest: https://www.pinterest.com/infuseandmuse',
      '',
      'You received this because you joined the waitlist at infuseandmuse.com',
    ].join('\n'),
    headers: {
      'List-Unsubscribe': '<mailto:hello@infuseandmuse.com?subject=unsubscribe>',
    },
  });

  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}
