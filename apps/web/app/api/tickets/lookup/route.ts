import { NextResponse } from 'next/server';
import { adminConfigured, findTicketOrdersByEmail } from '@/lib/shopify-admin';
import { sendTicketEmail } from '@/lib/send-ticket-email';
import { validateEmail } from '@/lib/validation';

/**
 * "Find my tickets" by email alone. The tickets are emailed to that address,
 * never shown here, so knowing someone's email does not hand over their QR
 * codes. The answer is the same whether or not the email has tickets, so the
 * page cannot be used to learn who is coming.
 */
const SENT = 'If that email has tickets, we have just sent them. Check your inbox and spam folder.';

/* One send per email per minute on this server instance: enough to stop a
   button being hammered into someone's inbox, without a store to keep. */
const WAIT_MS = 60_000;
const lastSent = new Map<string, number>();

export async function POST(request: Request) {
  if (!adminConfigured() || !process.env.TICKET_SECRET || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Ticket lookup is temporarily unavailable.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = validateEmail(body?.email);
  if (!email.ok) {
    return NextResponse.json({ error: 'Please enter the email you used to buy your tickets.' }, { status: 400 });
  }

  const key = email.value.toLowerCase();
  const now = Date.now();
  if (now - (lastSent.get(key) ?? 0) < WAIT_MS) {
    return NextResponse.json({ ok: true, message: SENT });
  }

  try {
    const orders = await findTicketOrdersByEmail(key);
    if (orders.length === 0) {
      // Roughly the time a real send takes, so a miss does not answer faster.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ ok: true, message: SENT });
    }
    lastSent.set(key, now);
    for (const order of orders) await sendTicketEmail(order);
    return NextResponse.json({ ok: true, message: SENT });
  } catch (error) {
    lastSent.delete(key);
    console.error('[tickets] lookup failed:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}
