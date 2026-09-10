import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

/**
 * Shopify webhook target. Register it in the admin under Settings →
 * Notifications → Webhooks for `products/update`, `products/create`,
 * `products/delete` and `collections/update`, JSON format, pointing at
 * `https://<site>/api/revalidate`. Any hit that verifies purges every
 * cached Storefront read, so a price or stock edit shows within seconds
 * instead of waiting out the 60-second window.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 });
  }

  const provided = request.headers.get('x-shopify-hmac-sha256');
  if (!provided) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 401 });
  }

  const raw = await request.text();
  const expected = createHmac('sha256', secret).update(raw, 'utf8').digest('base64');
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  revalidateTag('shopify');
  return NextResponse.json({ revalidated: true });
}
