import { NextResponse } from 'next/server';
import { isStaff } from './checkin';
import { adminConfigured } from './shopify-admin';

/** Shared front door for the check-in endpoints: configured, then PIN. Returns a response to send, or null to go on. */
export async function guardCheckin(request: Request): Promise<NextResponse | null> {
  if (!adminConfigured() || !process.env.TICKET_SECRET || !process.env.CHECKIN_PIN) {
    return NextResponse.json({ error: 'Check-in is not set up yet.' }, { status: 503 });
  }
  if (!isStaff(request.headers.get('x-checkin-pin'))) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: 'Wrong PIN.' }, { status: 401 });
  }
  return null;
}
