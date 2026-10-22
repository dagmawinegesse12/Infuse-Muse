import { describe, expect, it } from 'vitest';
import { whereFor } from '@/lib/event-where';

describe('whereFor', () => {
  it('says only the area to the public', () => {
    expect(whereFor(false)).toEqual({ text: 'Downtown Toronto', maps: null });
  });

  it('gives an invited guest the street address and both map links', () => {
    const w = whereFor(true);
    expect(w.text).toBe('87 Wade Ave, Toronto, ON M6H 1P5');
    expect(w.maps?.google).toContain('google.com/maps');
    expect(w.maps?.apple).toContain('maps.apple.com');
  });
});
