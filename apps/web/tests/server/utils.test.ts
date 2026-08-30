import { describe, expect, it } from 'vitest';
import { cn, formatPrice } from '@/lib/utils';

describe('formatPrice', () => {
  it('renders cents as CAD currency', () => {
    //   — Intl uses a non-breaking space after the symbol in en-CA.
    expect(formatPrice(1800).replace(/ /g, ' ')).toBe('$18.00');
  });

  it('keeps sub-dollar amounts exact', () => {
    expect(formatPrice(5).replace(/ /g, ' ')).toBe('$0.05');
  });

  it('does not round away half cents from integer input', () => {
    expect(formatPrice(1999).replace(/ /g, ' ')).toBe('$19.99');
  });

  it('handles zero', () => {
    expect(formatPrice(0).replace(/ /g, ' ')).toBe('$0.00');
  });

  it('honours a non-default currency', () => {
    expect(formatPrice(1800, 'USD')).toContain('18.00');
  });
});

describe('cn', () => {
  it('joins truthy class names and drops the rest', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('returns an empty string when nothing is truthy', () => {
    expect(cn(false, null, undefined)).toBe('');
  });
});
