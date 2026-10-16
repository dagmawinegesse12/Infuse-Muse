import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TicketOrder } from '@/lib/tickets';

const fetchTicketOrder = vi.fn();
const setAdmitted = vi.fn();
vi.mock('@/lib/shopify-admin', () => ({
  fetchTicketOrder: (...a: unknown[]) => fetchTicketOrder(...a),
  setAdmitted: (...a: unknown[]) => setAdmitted(...a),
  adminConfigured: () => true,
}));

import { isStaff, scanTicket, setTicketAdmitted } from '@/lib/checkin';
import { signTicket } from '@/lib/ticket-token';

const ORDER = '7246079099120';
const order = (over: Partial<TicketOrder> = {}): TicketOrder => ({
  orderId: ORDER,
  name: '#1042',
  holder: 'Jane Doe',
  email: 'jane@example.com',
  total: 2,
  admitted: [],
  emailed: false,
  status: 'ok',
  ...over,
});

beforeEach(() => {
  vi.stubEnv('TICKET_SECRET', 'test-secret-one');
  vi.stubEnv('CHECKIN_PIN', 'door1234');
  fetchTicketOrder.mockReset();
  setAdmitted.mockReset().mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());

describe('isStaff', () => {
  it('accepts only the exact PIN', () => {
    expect(isStaff('door1234')).toBe(true);
    for (const wrong of ['door123', 'door12345', 'DOOR1234', '', null]) expect(isStaff(wrong)).toBe(false);
  });

  it('admits nobody when no PIN is configured', () => {
    vi.stubEnv('CHECKIN_PIN', '');
    expect(isStaff('')).toBe(false);
    expect(isStaff('anything')).toBe(false);
  });
});

describe('scanTicket', () => {
  it('lets in a good, unused ticket and records it', async () => {
    fetchTicketOrder.mockResolvedValue(order());
    const r = await scanTicket(signTicket(ORDER, 2));
    expect(r).toMatchObject({ result: 'admitted', holder: 'Jane Doe', position: 2, total: 2, admittedCount: 1 });
    expect(setAdmitted).toHaveBeenCalledWith(ORDER, 2, true);
  });

  it('refuses a ticket that was already used, and records nothing', async () => {
    fetchTicketOrder.mockResolvedValue(order({ admitted: [2] }));
    const r = await scanTicket(signTicket(ORDER, 2));
    expect(r.result).toBe('already');
    expect(setAdmitted).not.toHaveBeenCalled();
  });

  it('does not use up the other tickets on an order', async () => {
    fetchTicketOrder.mockResolvedValue(order({ admitted: [2] }));
    expect((await scanTicket(signTicket(ORDER, 1))).result).toBe('admitted');
  });

  it.each(['cancelled', 'refunded', 'unpaid'] as const)('refuses a %s order', async (status) => {
    fetchTicketOrder.mockResolvedValue(order({ status }));
    const r = await scanTicket(signTicket(ORDER, 1));
    expect(r.result).toBe(status);
    expect(setAdmitted).not.toHaveBeenCalled();
  });

  it('refuses a position beyond what is left after a refund', async () => {
    fetchTicketOrder.mockResolvedValue(order({ total: 1 }));
    expect((await scanTicket(signTicket(ORDER, 2))).result).toBe('invalid');
    expect(setAdmitted).not.toHaveBeenCalled();
  });

  it('refuses a forged code without asking Shopify', async () => {
    const r = await scanTicket(`${ORDER}-1-${'0'.repeat(20)}`);
    expect(r.result).toBe('invalid');
    expect(fetchTicketOrder).not.toHaveBeenCalled();
  });

  it('refuses a good signature for an order that does not exist', async () => {
    fetchTicketOrder.mockResolvedValue(null);
    expect((await scanTicket(signTicket(ORDER, 1))).result).toBe('invalid');
  });
});

describe('setTicketAdmitted (guest list)', () => {
  it('admits, undoes, and does nothing when asked for the state it is already in', async () => {
    fetchTicketOrder.mockResolvedValue(order({ admitted: [1] }));
    expect(await setTicketAdmitted(ORDER, 2, true)).toMatchObject({ ok: true, order: { admitted: [1, 2] } });
    expect(setAdmitted).toHaveBeenLastCalledWith(ORDER, 2, true);

    expect(await setTicketAdmitted(ORDER, 1, false)).toMatchObject({ ok: true, order: { admitted: [] } });
    expect(setAdmitted).toHaveBeenLastCalledWith(ORDER, 1, false);

    setAdmitted.mockClear();
    await setTicketAdmitted(ORDER, 1, true);
    expect(setAdmitted).not.toHaveBeenCalled();
  });

  it('refuses a position that is not on the order or an order that is not paid', async () => {
    fetchTicketOrder.mockResolvedValue(order());
    expect((await setTicketAdmitted(ORDER, 3, true)).ok).toBe(false);
    fetchTicketOrder.mockResolvedValue(order({ status: 'cancelled' }));
    expect((await setTicketAdmitted(ORDER, 1, true)).ok).toBe(false);
  });
});
