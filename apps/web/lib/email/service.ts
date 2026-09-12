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
import { getResend } from './client';
import { generateWaitlistConfirmationHtml } from './templates/waitlist-confirmation';

// Order confirmations are sent by Shopify since checkout moved there; this
// service now covers only the emails the site itself originates.

export async function sendWaitlistConfirmation(to: string): Promise<void> {
  const from =
    process.env.EMAIL_FROM || 'Infuse & Muse <onboarding@resend.dev>';

  const { error } = await getResend().emails.send({
    from,
    to,
    subject: "You're on the Infuse & Muse waitlist",
    html: generateWaitlistConfirmationHtml(to),
    text: [
      'Infuse & Muse · Luxury Tea, Toronto',
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
      'Mar',
      '',
      '─',
      'Instagram: https://www.instagram.com/infuseandmuse',
      'Pinterest: https://www.pinterest.com/infuseandmuse',
      '',
      'You received this because you joined the waitlist at infuseandmuse.com',
    ].join('\n'),
    headers: {
      'List-Unsubscribe': '<mailto:contact@infuseandmuse.com?subject=unsubscribe>',
    },
  });

  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}
