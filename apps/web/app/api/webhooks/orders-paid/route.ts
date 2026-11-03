import { NextResponse } from 'next/server';
import { addOrderTag, adminConfigured, fetchTicketOrder } from '@/lib/shopify-admin';
import { sendTicketEmail } from '@/lib/send-ticket-email';
import { EMAILED_TAG } from '@/lib/tickets';
import { verifyShopifyWebhook } from '@/lib/shopify-webhook';

/**
 * Shopify calls this when an order is paid. If the order has tickets and the
 * guest has not been emailed yet, send them their personal ticket link, then
 * tag the order so a repeat delivery does nothing. Anything but a 2xx makes
 * Shopify retry for up to two days, which is what we want for a temporary
 * failure and not what we want for an order that is simply not ours.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const valid = verifyShopifyWebhook(
    raw,
    request.headers.get('x-shopify-hmac-sha256'),
    process.env.SHOPIFY_ADMIN_CLIENT_SECRET
  );
  if (!valid) return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });

  if (!adminConfigured() || !process.env.TICKET_SECRET || !process.env.RESEND_API_KEY) {
    console.error('[ticket-email] not configured; Shopify will retry.');
    return NextResponse.json({ error: 'Not configured.' }, { status: 503 });
  }

  let orderId: string;
  try {
    const id = (JSON.parse(raw) as { id?: unknown }).id;
    if (typeof id !== 'number' && typeof id !== 'string') throw new Error('no id');
    orderId = String(id);
  } catch {
    return NextResponse.json({ error: 'Unreadable payload.' }, { status: 400 });
  }

  try {
    const order = await fetchTicketOrder(orderId);
    if (!order || order.status !== 'ok' || order.total < 1 || !order.email) {
      return NextResponse.json({ sent: false, reason: 'no tickets to email' });
    }
    if (order.emailed) return NextResponse.json({ sent: false, reason: 'already emailed' });

    await sendTicketEmail(order);

    // The email is out. If tagging fails, say so but do not make Shopify
    // retry, or the guest would get it twice.
    await addOrderTag(order.orderId, EMAILED_TAG).catch((e) =>
      console.error('[ticket-email] sent but could not tag the order:', e)
    );
    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('[ticket-email] failed:', error);
    return NextResponse.json({ error: 'Failed; will retry.' }, { status: 500 });
  }
}
