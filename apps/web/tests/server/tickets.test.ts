import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signOrder, signTicket, verifyOrder, verifyTicket } from '@/lib/ticket-token';
import { ticketTokenFromScan } from '@/lib/ticket-scan';
import { publicName, toTicketOrder, type AdminOrderNode } from '@/lib/tickets';

beforeEach(() => vi.stubEnv('TICKET_SECRET', 'test-secret-one'));
afterEach(() => vi.unstubAllEnvs());

const ORDER = '7246079099120';

describe('ticket tokens', () => {
  it('round-trips a ticket and an order', () => {
    expect(verifyTicket(signTicket(ORDER, 2))).toEqual({ orderId: ORDER, position: 2 });
    expect(verifyOrder(signOrder(ORDER))).toEqual({ orderId: ORDER });
  });

  it('rejects an edited position, order id or signature', () => {
    const t = signTicket(ORDER, 2);
    expect(verifyTicket(t.replace('-2-', '-3-'))).toBeNull();
    expect(verifyTicket(t.replace(ORDER, '7246079099121'))).toBeNull();
    expect(verifyTicket(t.slice(0, -1) + (t.endsWith('0') ? '1' : '0'))).toBeNull();
    expect(verifyOrder(signOrder(ORDER).replace(ORDER, '1111111'))).toBeNull();
  });

  it('keeps ticket and order signatures apart', () => {
    const sig = signOrder(ORDER).split('.')[1];
    expect(verifyTicket(`${ORDER}-1-${sig}`)).toBeNull();
  });

  it('rejects tokens made with a different secret', () => {
    const t = signTicket(ORDER, 1);
    vi.stubEnv('TICKET_SECRET', 'a-different-secret');
    expect(verifyTicket(t)).toBeNull();
  });

  it('rejects junk without throwing', () => {
    for (const junk of ['', 'abc', `${ORDER}-0-${'a'.repeat(20)}`, `${ORDER}-1`, `${ORDER}-1-zzz`, '../etc']) {
      expect(verifyTicket(junk)).toBeNull();
    }
  });

  it('reads a ticket out of a scanned URL or a bare token', () => {
    const t = signTicket(ORDER, 3);
    expect(ticketTokenFromScan(`https://www.infuseandmuse.com/t/${t}`)).toBe(t);
    expect(ticketTokenFromScan(`https://infuseandmuse.com/t/${t}?x=1`)).toBe(t);
    expect(ticketTokenFromScan(t)).toBe(t);
    expect(ticketTokenFromScan('https://example.com/other')).toBeNull();
    expect(ticketTokenFromScan('hello')).toBeNull();
  });
});

const node = (over: Partial<AdminOrderNode> = {}, qty = 2, type = 'Event ticket'): AdminOrderNode => ({
  id: `gid://shopify/Order/${ORDER}`,
  name: '#1042',
  email: 'jane@example.com',
  cancelledAt: null,
  displayFinancialStatus: 'PAID',
  tags: [],
  billingAddress: { name: 'Jane Doe' },
  lineItems: { nodes: [{ currentQuantity: qty, product: { productType: type } }] },
  ...over,
});

describe('toTicketOrder', () => {
  it('reads a paid order as that many tickets', () => {
    expect(toTicketOrder(node())).toMatchObject({ orderId: ORDER, name: '#1042', total: 2, status: 'ok', holder: 'Jane Doe' });
  });

  it('adds up several ticket lines and ignores tea', () => {
    const n = node();
    n.lineItems.nodes.push({ currentQuantity: 1, product: { productType: 'Event ticket' } });
    n.lineItems.nodes.push({ currentQuantity: 5, product: { productType: '' } });
    expect(toTicketOrder(n).total).toBe(3);
  });

  it('is "none" for an order with no tickets', () => {
    expect(toTicketOrder(node({}, 1, '')).status).toBe('none');
  });

  it.each([
    [{ cancelledAt: '2026-10-16T22:00:00Z' }, 'cancelled'],
    [{ displayFinancialStatus: 'REFUNDED' }, 'refunded'],
    [{ displayFinancialStatus: 'PENDING' }, 'unpaid'],
    [{ displayFinancialStatus: 'VOIDED' }, 'unpaid'],
  ])('flags %j as %s', (over, status) => {
    expect(toTicketOrder(node(over as Partial<AdminOrderNode>)).status).toBe(status);
  });

  it('treats a fully refunded quantity as refunded, and a partial refund as the remainder', () => {
    expect(toTicketOrder(node({ displayFinancialStatus: 'PARTIALLY_REFUNDED' }, 0)).status).toBe('refunded');
    expect(toTicketOrder(node({ displayFinancialStatus: 'PARTIALLY_REFUNDED' }, 1))).toMatchObject({ status: 'ok', total: 1 });
  });

  it('reads who is already in from the order tags', () => {
    expect(toTicketOrder(node({ tags: ['checked-in-2', 'vip', 'checked-in-1', 'checked-in-x'] })).admitted).toEqual([1, 2]);
  });

  it('falls back to the start of the email when there is no billing name', () => {
    expect(toTicketOrder(node({ billingAddress: null })).holder).toBe('jane');
    expect(toTicketOrder(node({ billingAddress: { name: '  ' } })).holder).toBe('jane');
  });
});

describe('publicName', () => {
  it('shortens a guest name for shareable pages', () => {
    expect(publicName('Jane Doe')).toBe('Jane D.');
    expect(publicName('Mary Anne van der Berg')).toBe('Mary B.');
    expect(publicName('Cher')).toBe('Cher');
  });
});
