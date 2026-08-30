import { describe, expect, it } from 'vitest';
import { escapeHtml, validateContact, validateEmail } from '@/lib/validation';

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
