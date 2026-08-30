import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getResend } from '@/lib/email/client';
import { sendWaitlistConfirmation } from '@/lib/email/service';


// ── Local dev fallback (file-based) ──────────────────────────────────────────
const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist.json');
type Entry = { email: string; joinedAt: string };

async function loadEntries(): Promise<Entry[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf-8')) as Entry[];
  } catch {
    return [];
  }
}

// ── Dedup check ───────────────────────────────────────────────────────────────
async function isAlreadyOnList(email: string): Promise<boolean> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      const { data } = await getResend().contacts.list({ audienceId });
      return (data?.data ?? []).some(
        (c: { email: string }) => c.email === email
      );
    } catch {
      return false;
    }
  }
  return (await loadEntries()).some((e) => e.email === email);
}

// ── Add to list ───────────────────────────────────────────────────────────────
async function addToList(email: string): Promise<void> {
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    await getResend().contacts.create({ email, audienceId, unsubscribed: false });
    return;
  }
  const entries = await loadEntries();
  entries.push({ email, joinedAt: new Date().toISOString() });
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const raw = typeof body.email === 'string' ? body.email : '';
  const email = raw.toLowerCase().trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (await isAlreadyOnList(email)) {
    return NextResponse.json({
      message: "You're already on the list — we'll be in touch before launch.",
    });
  }

  try {
    await addToList(email);
  } catch (err) {
    // Storage is either a Resend audience or, without RESEND_AUDIENCE_ID, a
    // local JSON file — and the filesystem is read-only on Vercel. Never tell
    // someone they are on the list when the write did not land.
    console.error('[waitlist] failed to record signup:', err);
    return NextResponse.json(
      { error: 'We could not save your details just now. Please try again shortly.' },
      { status: 503 }
    );
  }

  try {
    await sendWaitlistConfirmation(email);
  } catch (err) {
    console.error('[waitlist] email failed:', err);
  }

  return NextResponse.json({
    message: "Welcome to the list! You'll hear from us before we launch.",
  });
}
