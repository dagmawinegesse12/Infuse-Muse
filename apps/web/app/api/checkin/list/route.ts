import { NextResponse } from 'next/server';
import { guardCheckin } from '@/lib/checkin-route';
import { listTicketOrders } from '@/lib/shopify-admin';

export async function POST(request: Request) {
  const blocked = await guardCheckin(request);
  if (blocked) return blocked;
  try {
    const orders = (await listTicketOrders())
      .map(({ email, ...order }) => ({ ...order, email: email ?? '' }))
      .sort((a, b) => a.holder.localeCompare(b.holder));
    const ok = orders.filter((o) => o.status === 'ok');
    return NextResponse.json({
      orders,
      sold: ok.reduce((n, o) => n + o.total, 0),
      admitted: ok.reduce((n, o) => n + o.admitted.length, 0),
    });
  } catch (error) {
    console.error('[checkin] list failed:', error);
    return NextResponse.json({ error: 'Could not reach Shopify. Try again.' }, { status: 502 });
  }
}
