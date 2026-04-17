import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.redirect(new URL('/unsubscribe?status=error', request.url));
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  try {
    if (audienceId) {
      const { data } = await resend.contacts.list({ audienceId });
      const contact = (data?.data ?? []).find(
        (c: { email: string }) => c.email === email
      );
      if (contact) {
        await resend.contacts.update({
          id: contact.id,
          audienceId,
          unsubscribed: true,
        });
      }
    }
  } catch {
    // fail silently — still show success to user
  }

  return NextResponse.redirect(
    new URL(`/unsubscribe?status=success&email=${encodeURIComponent(email)}`, request.url)
  );
}
