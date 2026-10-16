import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EVENT } from '@/lib/event';
import { HONEYPOT, escapeHtml, validateTicketRequest } from '@/lib/validation';

const TO = process.env.CONTACT_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const THANKS = 'Thank you. We have your request and will be in touch.';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Same trap as the contact form: a bot gets the thank-you a person would.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trap === 'string' && trap.trim()) {
    console.warn('[ticket-request] Honeypot filled; dropping without sending.');
    return NextResponse.json({ message: THANKS });
  }

  const parsed = validateTicketRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, tickets, note } = parsed.value;

  if (!process.env.RESEND_API_KEY || !TO) {
    console.error('[ticket-request] RESEND_API_KEY or CONTACT_INBOX is not configured.');
    return NextResponse.json(
      { error: 'Requests are temporarily unavailable. Please email us directly.' },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Ticket request: ${name}, ${tickets} for ${EVENT.name}`.replace(/\s+/g, ' ').trim(),
      html:
        `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
        `<p><strong>Tickets:</strong> ${tickets}</p>` +
        (note ? `<p style="white-space:pre-wrap">${escapeHtml(note)}</p>` : '') +
        `<p>To approve, reply with your private invite link.</p>`,
    });
  } catch (error) {
    console.error('[ticket-request] Failed to send:', error);
    return NextResponse.json(
      { error: 'Something went wrong sending your request. Please try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: THANKS });
}
