import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type { CartItem } from '@/lib/cart/cart-types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[checkout] STRIPE_SECRET_KEY is not configured.');
    return NextResponse.json(
      { error: 'Checkout is not configured. Contact support.' },
      { status: 500 }
    );
  }

  let items: CartItem[];
  try {
    const body = await request.json();
    items = Array.isArray(body.items) ? body.items : [];
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }

  // Basic item validation
  for (const item of items) {
    if (
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      item.price < 1 ||
      typeof item.quantity !== 'number' ||
      item.quantity < 1
    ) {
      return NextResponse.json(
        { error: 'Invalid item in cart.' },
        { status: 400 }
      );
    }
  }

  // Compact order metadata for the webhook to use when sending the email.
  // Stripe metadata values are limited to 500 chars; this format stays well under.
  const orderItemsMeta = JSON.stringify(
    items.map((i) => ({
      name: i.name.slice(0, 60),
      qty: i.quantity,
      unit: i.price, // stored as cents
    }))
  );

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',

      line_items: items.map((item) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
            // Only pass absolute image URLs; skip relative /images/... paths
            // as Stripe requires publicly accessible URLs.
          },
          unit_amount: item.price, // price is already stored in cents
        },
        quantity: item.quantity,
      })),

      // Stripe Checkout will collect the customer's email during payment.
      // It is available after payment in session.customer_details.email.
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },

      // Pass order details in metadata so the webhook can build the email.
      metadata: {
        orderItems: orderItemsMeta,
      },

      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Log full error server-side; return a safe message to the client.
    console.error('[checkout] Stripe error:', error);
    return NextResponse.json(
      { error: 'Unable to start checkout. Please try again.' },
      { status: 500 }
    );
  }
}
