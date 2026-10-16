import { NextResponse } from 'next/server';
import { adminConfigured, findTicketOrder } from '@/lib/shopify-admin';
import { signOrder } from '@/lib/ticket-token';
import { validateEmail } from '@/lib/validation';

const MISS = 'We could not find tickets for that order number and email.';

export async function POST(request: Request) {
  if (!adminConfigured() || !process.env.TICKET_SECRET) {
    return NextResponse.json({ error: 'Ticket lookup is temporarily unavailable.' }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const order = typeof body?.order === 'string' ? body.order : '';
  const email = validateEmail(body?.email);
  if (!/\d/.test(order) || !email.ok) {
    return NextResponse.json({ error: 'Please enter your order number and the email you used.' }, { status: 400 });
  }

  try {
    const found = await findTicketOrder(order, email.value);
    if (!found) {
      // Slow a guesser down; a real guest who mistyped will barely notice.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: MISS }, { status: 404 });
    }
    return NextResponse.json({ url: `/tickets/${signOrder(found.orderId)}` });
  } catch (error) {
    console.error('[tickets] lookup failed:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}
