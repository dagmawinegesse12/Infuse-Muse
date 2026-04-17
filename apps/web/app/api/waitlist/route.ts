import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { sendWaitlistConfirmation } from '@/lib/email/service';

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const { data } = await resend.contacts.list({ audienceId });
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
    await resend.contacts.create({ email, audienceId, unsubscribed: false });
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

  await addToList(email);

  sendWaitlistConfirmation(email).catch((err) =>
    console.error('[waitlist] email failed:', err)
  );

  return NextResponse.json({
    message: "Welcome to the list! You'll hear from us before we launch.",
  });
}
