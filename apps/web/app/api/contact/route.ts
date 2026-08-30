import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml, validateContact } from '@/lib/validation';

const TO = process.env.CONTACT_INBOX || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = validateContact(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, email, message } = parsed.value;

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
      subject: `Enquiry from ${name}`,
      html:
        `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
  } catch (error) {
    console.error('[contact] Failed to send:', error);
    return NextResponse.json(
      { error: 'Something went wrong sending your note. Please try again.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: 'Thank you — your note is on its way to us.' });
}
