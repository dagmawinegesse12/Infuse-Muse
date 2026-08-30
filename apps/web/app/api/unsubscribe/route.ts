import { NextResponse } from 'next/server';
import { getResend } from '@/lib/email/client';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.redirect(new URL('/unsubscribe?status=error', request.url));
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;

  try {
    if (audienceId) {
      const { data } = await getResend().contacts.list({ audienceId });
      const contact = (data?.data ?? []).find(
        (c: { email: string }) => c.email === email
      );
      if (contact) {
        await getResend().contacts.update({
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
