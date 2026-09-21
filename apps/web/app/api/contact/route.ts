import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  CONTACT_TOPICS,
  HONEYPOT,
  contactSubject,
  escapeHtml,
  validateContact,
} from '@/lib/validation';

const TO = process.env.CONTACT_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const THANKS = 'Thank you. Your note is on its way to us.';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // Bots that fill every input fill this one too, and get the same thank-you a
  // person would: telling them they were caught only teaches them what to skip.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trap === 'string' && trap.trim()) {
    console.warn('[contact] Honeypot filled; dropping without sending.');
    return NextResponse.json({ message: THANKS });
  }

  const parsed = validateContact(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, message, topic, about } = parsed.value;
  const topicLabel = CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;

  if (!process.env.RESEND_API_KEY || !TO) {
    // Fail loudly in the log, softly to the sender: never claim a message was
    // delivered when it was not.
    console.error('[contact] RESEND_API_KEY or CONTACT_INBOX is not configured.');
    return NextResponse.json(
      { error: 'Our contact form is temporarily unavailable. Please email us directly.' },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: contactSubject({ name, topic, about }),
      html:
        `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
        `<p><strong>About:</strong> ${escapeHtml(topicLabel)}${
          about ? `, ${escapeHtml(about)}` : ''
        }</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
  } catch (error) {
    console.error('[contact] Failed to send:', error);
    return NextResponse.json(
      { error: 'Something went wrong sending your note. Please try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: THANKS });
}
