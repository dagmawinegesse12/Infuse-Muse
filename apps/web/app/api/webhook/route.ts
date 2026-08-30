import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { sendOrderConfirmation } from '@/lib/email/service';
import { resolveOrderItems } from '@/lib/orders';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not configured.');
    return NextResponse.json(
      { error: 'Webhook not configured.' },
      { status: 500 }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature.' },
      { status: 400 }
    );
  }

  // Acknowledge receipt immediately — Stripe expects a fast 200.
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Only send confirmation after a successful payment.
  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true });
  }

  const email = session.customer_details?.email;
  if (!email) {
    console.warn('[webhook] No customer email on session:', session.id);
    return NextResponse.json({ received: true });
  }

  // Stripe's line items are authoritative; metadata is only a fallback.
  const orderItems = await resolveOrderItems(session);

  try {
    await sendOrderConfirmation({
      to: email,
      customerName: session.customer_details?.name ?? undefined,
      orderItems,
      amountTotal: session.amount_total ?? 0,
      sessionId: session.id,
    });
  } catch (err) {
    // Log but do not return an error — Stripe would retry the webhook.
    console.error('[webhook] Failed to send confirmation email:', err);
  }

  return NextResponse.json({ received: true });
}
