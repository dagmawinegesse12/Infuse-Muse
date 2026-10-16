import { describe, expect, it } from 'vitest';
import { bagCountLabel, bagHeading, unitNoun } from '@/lib/cart/wording';

const ticket = (quantity = 1) => ({ slug: 'tea-gathering-ticket', quantity });
const tea = (quantity = 1) => ({ slug: 'rose-vitalitea', quantity });

describe('bag wording', () => {
  it('counts a bag of tea as blends, as before', () => {
    expect(bagCountLabel([tea()])).toBe('1 blend');
    expect(bagCountLabel([tea(), tea(3)])).toBe('2 blends');
    expect(unitNoun(tea())).toBe('tin');
    expect(bagHeading([tea()])).toBe('Review your blends before checkout.');
  });

  it('counts tickets by the ticket, not as blends', () => {
    expect(bagCountLabel([ticket()])).toBe('1 ticket');
    expect(bagCountLabel([ticket(4)])).toBe('4 tickets');
    expect(unitNoun(ticket())).toBe('ticket');
    expect(bagHeading([ticket()])).toBe('Review your tickets before checkout.');
  });

  it('uses neutral words when tickets and tea share a bag', () => {
    expect(bagCountLabel([ticket(2), tea()])).toBe('2 items');
    expect(bagHeading([ticket(), tea()])).toBe('Review your bag before checkout.');
  });

  it('says empty for an empty bag and keeps the usual heading', () => {
    expect(bagCountLabel([])).toBe('Empty');
    expect(bagHeading([])).toBe('Review your blends before checkout.');
  });
});
