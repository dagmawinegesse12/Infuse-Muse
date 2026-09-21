import { describe, expect, it } from 'vitest';
import {
  FEEDBACK_ABOUT,
  contactSubject,
  escapeHtml,
  validateContact,
  validateEmail,
} from '@/lib/validation';

describe('validateEmail', () => {
  it.each(['a@b.co', 'First.Last@example.co.uk', ' PADDED@example.com '])(
    'accepts %s',
    (input) => expect(validateEmail(input).ok).toBe(true)
  );

  it('normalises case and whitespace', () => {
    const result = validateEmail('  Hello@Example.COM ');
    expect(result.ok && result.value).toBe('hello@example.com');
  });

  it.each([
    ['empty', ''],
    ['no at sign', 'nope'],
    ['no domain dot', 'a@b'],
    ['spaces inside', 'a b@c.com'],
    ['not a string', 42],
    ['null', null],
  ])('rejects %s', (_label, input) => expect(validateEmail(input).ok).toBe(false));

  it('rejects an address past the RFC length limit', () => {
    expect(validateEmail(`${'a'.repeat(250)}@example.com`).ok).toBe(false);
  });
});

describe('validateContact', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', message: 'I would like to ask about gifting.' };

  it('accepts a complete note', () => {
    const result = validateContact(valid);
    expect(result.ok).toBe(true);
  });

  it('trims the fields it returns', () => {
    const result = validateContact({ ...valid, name: '  Ada  ' });
    expect(result.ok && result.value.name).toBe('Ada');
  });

  it.each([
    ['a missing name', { ...valid, name: '' }],
    ['a whitespace-only name', { ...valid, name: '   ' }],
    ['a bad email', { ...valid, email: 'nope' }],
    ['a too-short message', { ...valid, message: 'hi' }],
    ['no body at all', null],
  ])('rejects %s', (_label, input) => expect(validateContact(input).ok).toBe(false));

  it('rejects an over-long message rather than truncating silently', () => {
    expect(validateContact({ ...valid, message: 'x'.repeat(5000) }).ok).toBe(false);
  });

  it('returns a message the sender can act on', () => {
    const result = validateContact({ ...valid, message: 'hi' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/detail/i);
  });
});

describe('escapeHtml', () => {
  it('neutralises a script tag so it cannot execute in an email client', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapes quotes and ampersands', () => {
    expect(escapeHtml(`Tom & "Jerry" 's`)).toBe('Tom &amp; &quot;Jerry&quot; &#39;s');
  });

  it('leaves ordinary prose untouched', () => {
    expect(escapeHtml('Just a normal question about tea.')).toBe(
      'Just a normal question about tea.'
    );
  });
});

describe('contact topics', () => {
  const base = { name: 'Ada', email: 'ada@example.com', message: 'The lavender was lovely at night.' };

  it('treats a note without a topic as a question, as the form did before topics', () => {
    const result = validateContact(base);
    expect(result.ok && result.value.topic).toBe('question');
  });

  it('rejects a topic that is not on the list', () => {
    expect(validateContact({ ...base, topic: 'complaint' }).ok).toBe(false);
  });

  it('keeps the blend on feedback', () => {
    const result = validateContact({ ...base, topic: 'feedback', about: 'Lavender Lullaby' });
    expect(result.ok && result.value.about).toBe('Lavender Lullaby');
  });

  it('allows feedback without a blend, because that field is optional', () => {
    const result = validateContact({ ...base, topic: 'feedback', about: '' });
    expect(result.ok && result.value.about).toBeUndefined();
  });

  it('rejects a blend that is not one of ours', () => {
    expect(validateContact({ ...base, topic: 'feedback', about: 'Earl Grey' }).ok).toBe(false);
  });

  it('ignores a blend sent with anything but feedback', () => {
    const result = validateContact({ ...base, topic: 'gifting', about: 'Lavender Lullaby' });
    expect(result.ok && result.value.about).toBeUndefined();
  });

  it('still requires an email for feedback, so it can be answered', () => {
    expect(validateContact({ ...base, topic: 'feedback', email: '' }).ok).toBe(false);
  });

  it('offers every blend, the full set, and a way out', () => {
    expect(FEEDBACK_ABOUT).toContain('Classic Thyme');
    expect(FEEDBACK_ABOUT).toContain('The full set');
    expect(FEEDBACK_ABOUT[FEEDBACK_ABOUT.length - 1]).toBe('Something else');
  });
});

describe('contactSubject', () => {
  it.each([
    [{ name: 'Ada', topic: 'question' as const }, 'Question from Ada'],
    [{ name: 'Ada', topic: 'gifting' as const }, 'Gifting enquiry from Ada'],
    [{ name: 'Ada', topic: 'partnership' as const }, 'Partnership enquiry from Ada'],
    [{ name: 'Ada', topic: 'feedback' as const }, 'Feedback from Ada'],
    [{ name: 'Ada', topic: 'feedback' as const, about: 'Coco Breeze' }, 'Feedback on Coco Breeze from Ada'],
  ])('%j reads "%s"', (input, expected) => {
    expect(contactSubject(input)).toBe(expected);
  });

  it('keeps line breaks in a name out of the header', () => {
    expect(contactSubject({ name: 'Ada\r\nBcc: x@y.z', topic: 'question' })).not.toMatch(/[\r\n]/);
  });

  it('never uses an em dash, which the site does not', () => {
    expect(contactSubject({ name: 'Ada', topic: 'feedback', about: 'The full set' })).not.toContain('\u2014');
  });
});
