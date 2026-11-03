import { Resend } from 'resend';
import { absoluteUrl } from './metadata';
import { ticketEmail } from './ticket-email';
import { signOrder } from './ticket-token';
import type { TicketOrder } from './tickets';

/**
 * Emails a guest their personal ticket link. The one place that does it, so
 * the automatic send (Shopify's paid-order notification) and the door staff's
 * "Email tickets" button cannot drift apart. Throws if it could not send.
 */
export async function sendTicketEmail(order: TicketOrder): Promise<void> {
  if (!order.email) throw new Error('This order has no email address.');

  const mail = ticketEmail({
    holder: order.holder,
    orderName: order.name,
    tickets: order.total,
    link: absoluteUrl(`/tickets/${signOrder(order.orderId)}`),
    findUrl: absoluteUrl('/tickets'),
  });

  const replyTo = process.env.CONTACT_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: order.email,
    ...(replyTo ? { replyTo } : {}),
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
