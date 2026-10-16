import { NextResponse } from 'next/server';
import { setTicketAdmitted } from '@/lib/checkin';
import { guardCheckin } from '@/lib/checkin-route';

export async function POST(request: Request) {
  const blocked = await guardCheckin(request);
  if (blocked) return blocked;

  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const orderId = typeof b?.orderId === 'string' && /^\d{6,20}$/.test(b.orderId) ? b.orderId : null;
  const position = typeof b?.position === 'number' && Number.isInteger(b.position) ? b.position : null;
  if (!orderId || position === null || typeof b?.admitted !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  try {
    const result = await setTicketAdmitted(orderId, position, b.admitted);
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (error) {
    console.error('[checkin] admit failed:', error);
    return NextResponse.json({ error: 'Could not reach Shopify. Try again.' }, { status: 502 });
  }
}
