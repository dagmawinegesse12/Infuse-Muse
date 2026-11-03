import { NextResponse } from 'next/server';
import { guardCheckin } from '@/lib/checkin-route';
import { sendTicketEmail } from '@/lib/send-ticket-email';
import { addOrderTag, fetchTicketOrder } from '@/lib/shopify-admin';
import { EMAILED_TAG, STATUS_MESSAGE, maskEmail } from '@/lib/tickets';

/**
 * Door staff send, or re-send, a guest their personal ticket link. For orders
 * taken by phone, where the email is added after the sale and Shopify's
 * paid-order notification has already come and gone.
 */
export async function POST(request: Request) {
  const blocked = await guardCheckin(request);
  if (blocked) return blocked;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: false, message: 'Email is not set up yet.' }, { status: 503 });
  }

  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const orderId = typeof b?.orderId === 'string' && /^\d{6,20}$/.test(b.orderId) ? b.orderId : null;
  if (!orderId) return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });

  try {
    const order = await fetchTicketOrder(orderId);
    if (!order) return NextResponse.json({ ok: false, message: 'Order not found.' }, { status: 404 });
    if (order.status !== 'ok') {
      const message = order.status === 'none' ? 'That order has no tickets.' : STATUS_MESSAGE[order.status];
      return NextResponse.json({ ok: false, message }, { status: 409 });
    }
    if (!order.email) {
      return NextResponse.json(
        { ok: false, message: 'This order has no email address. Add one in Shopify, then try again.' },
        { status: 409 }
      );
    }

    await sendTicketEmail(order);
    if (!order.emailed) {
      await addOrderTag(order.orderId, EMAILED_TAG).catch((e) =>
        console.error('[checkin] emailed but could not tag the order:', e)
      );
    }
    return NextResponse.json({ ok: true, to: maskEmail(order.email) });
  } catch (error) {
    console.error('[checkin] email failed:', error);
    return NextResponse.json({ ok: false, message: 'Could not send the email. Try again.' }, { status: 502 });
  }
}
