/** Shared input rules, used by route handlers and covered by tests. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum
  message: 4000,
} as const;

export type ContactInput = { name: string; email: string; message: string };
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function validateEmail(raw: unknown): ValidationResult<string> {
  if (typeof raw !== 'string') return { ok: false, error: 'A valid email address is required.' };
  const email = raw.toLowerCase().trim();
  if (!email || email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email address is required.' };
  }
  return { ok: true, value: email };
}

export function validateContact(body: unknown): ValidationResult<ContactInput> {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) return { ok: false, error: 'Please tell us your name.' };
  if (name.length > LIMITS.name) return { ok: false, error: 'That name is too long.' };

  const email = validateEmail(b.email);
  if (!email.ok) return email;

  const message = typeof b.message === 'string' ? b.message.trim() : '';
  if (message.length < 10) {
    return { ok: false, error: 'Please give us a little more detail (at least 10 characters).' };
  }
  if (message.length > LIMITS.message) {
    return { ok: false, error: 'That message is too long.' };
  }

  return { ok: true, value: { name, email: email.value, message } };
}

/** Escape user text before it goes anywhere near an HTML email body. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
