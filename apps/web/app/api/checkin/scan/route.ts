import { NextResponse } from 'next/server';
import { scanTicket } from '@/lib/checkin';
import { guardCheckin } from '@/lib/checkin-route';
import { ticketTokenFromScan } from '@/lib/ticket-scan';

export async function POST(request: Request) {
  const blocked = await guardCheckin(request);
  if (blocked) return blocked;

  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const token = typeof body?.text === 'string' ? ticketTokenFromScan(body.text) : null;
  if (!token) {
    return NextResponse.json({ result: 'invalid', message: 'This is not an Opening Pour ticket.' });
  }
  try {
    return NextResponse.json(await scanTicket(token));
  } catch (error) {
    console.error('[checkin] scan failed:', error);
    return NextResponse.json({ error: 'Could not reach Shopify. Try again.' }, { status: 502 });
  }
}
