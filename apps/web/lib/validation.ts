/** Shared input rules, used by route handlers and covered by tests. */

import { demoProducts } from './demo-data';
import { MAX_TICKETS_PER_ORDER } from './event';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 120,
  email: 254, // RFC 5321 maximum
  message: 4000,
} as const;

/**
 * What a note is about. Everything goes to the same inbox; the topic only sets
 * the subject line, so the owner can sort feedback from enquiries in Outlook
 * without a second form for customers to choose between.
 */
export const CONTACT_TOPICS = [
  { value: 'question', label: 'Question', subject: 'Question' },
  { value: 'gifting', label: 'Gifting', subject: 'Gifting enquiry' },
  { value: 'partnership', label: 'Partnership', subject: 'Partnership enquiry' },
  { value: 'feedback', label: 'Feedback', subject: 'Feedback' },
] as const;

/**
 * The name of a field no person can see. Shared by the form, which renders it
 * hidden, and the route, which drops any note that arrives with it filled.
 * Deliberately not a name autofill recognises, or a real person's browser
 * would fill it and their note would vanish.
 */
export const HONEYPOT = 'hp_note';

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value'];

/**
 * What a piece of feedback is about. Optional, and asked only for feedback.
 * Drawn from the blends so a new one appears here without anyone remembering
 * to add it.
 */
export const FEEDBACK_ABOUT: readonly string[] = [
  ...demoProducts.map((p) => p.title),
  'The full set',
  'Something else',
];

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  topic: ContactTopic;
  /** Only ever set for feedback. */
  about?: string;
};
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

  // A missing topic is a question: that is what the form asked before topics
  // existed, and an old tab submitting without one should still get through.
  const topicRaw = typeof b.topic === 'string' && b.topic ? b.topic : 'question';
  const topic = CONTACT_TOPICS.find((t) => t.value === topicRaw)?.value;
  if (!topic) return { ok: false, error: 'Please choose what your note is about.' };

  let about: string | undefined;
  if (topic === 'feedback' && typeof b.about === 'string' && b.about) {
    if (!FEEDBACK_ABOUT.includes(b.about)) {
      return { ok: false, error: 'Please choose a blend from the list.' };
    }
    about = b.about;
  }

  return { ok: true, value: { name, email: email.value, message, topic, about } };
}

export type TicketRequestInput = {
  name: string;
  email: string;
  tickets: number;
  note: string;
};

export function validateTicketRequest(body: unknown): ValidationResult<TicketRequestInput> {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  if (!name) return { ok: false, error: 'Please tell us your name.' };
  if (name.length > LIMITS.name) return { ok: false, error: 'That name is too long.' };

  const email = validateEmail(b.email);
  if (!email.ok) return email;

  const tickets = Number(b.tickets);
  if (!Number.isInteger(tickets) || tickets < 1 || tickets > MAX_TICKETS_PER_ORDER) {
    return { ok: false, error: `Please ask for between 1 and ${MAX_TICKETS_PER_ORDER} tickets.` };
  }

  const note = typeof b.note === 'string' ? b.note.trim() : '';
  if (note.length > LIMITS.message) return { ok: false, error: 'That note is too long.' };

  return { ok: true, value: { name, email: email.value, tickets, note } };
}

/**
 * The email subject for a note. Names can carry line breaks, which have no
 * business in a header, so whitespace is collapsed.
 */
export function contactSubject(input: Pick<ContactInput, 'name' | 'topic' | 'about'>): string {
  const lead = CONTACT_TOPICS.find((t) => t.value === input.topic)?.subject ?? 'Note';
  const on = input.topic === 'feedback' && input.about ? ` on ${input.about}` : '';
  return `${lead}${on} from ${input.name}`.replace(/\s+/g, ' ').trim();
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
