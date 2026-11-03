import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { maskEmail, type TicketOrder } from '@/lib/tickets';

describe('maskEmail', () => {
  it('hides most of the address but keeps the domain', () => {
    expect(maskEmail('jane@example.com')).toBe('ja***@example.com');
    expect(maskEmail('a@b.co')).toBe('a***@b.co');
    expect(maskEmail('nonsense')).toBe('***');
  });
});

describe('POST /api/checkin/email', () => {
  const send = vi.fn();
  const fetchTicketOrder = vi.fn();
  const addOrderTag = vi.fn();
  const PIN = 'door1234';

  const order = (over: Partial<TicketOrder> = {}): TicketOrder => ({
    orderId: '7246120386800', name: '#1026', holder: 'Jane Doe', email: 'jane@example.com',
    total: 1, admitted: [], emailed: false, status: 'ok', ...over,
  });

  async function post(body: unknown, pin: string | null = PIN) {
    const { POST } = await import('@/app/api/checkin/email/route');
    return POST(new Request('http://localhost/api/checkin/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(pin ? { 'x-checkin-pin': pin } : {}) },
      body: JSON.stringify(body),
    }));
  }

  beforeEach(() => {
    vi.resetModules();
    send.mockReset().mockResolvedValue({ error: null });
    fetchTicketOrder.mockReset().mockResolvedValue(order());
    addOrderTag.mockReset().mockResolvedValue(undefined);
    vi.doMock('resend', () => ({ Resend: class { emails = { send }; } }));
    vi.doMock('@/lib/shopify-admin', () => ({
      adminConfigured: () => true,
      fetchTicketOrder: (...a: unknown[]) => fetchTicketOrder(...a),
      addOrderTag: (...a: unknown[]) => addOrderTag(...a),
    }));
    vi.stubEnv('CHECKIN_PIN', PIN);
    vi.stubEnv('TICKET_SECRET', 'ticket-secret');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://www.infuseandmuse.com');
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.doUnmock('resend');
    vi.doUnmock('@/lib/shopify-admin');
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('emails the guest their personal link, tags the order, and reports where it went (masked)', async () => {
    const res = await post({ orderId: '7246120386800' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, to: 'ja***@example.com' });
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe('jane@example.com');
    expect(mail.html).toContain('https://www.infuseandmuse.com/tickets/7246120386800.');
    expect(addOrderTag).toHaveBeenCalledWith('7246120386800', 'tickets-emailed');
  });

  it('sends again on request when the guest was already emailed, without tagging twice', async () => {
    fetchTicketOrder.mockResolvedValue(order({ emailed: true }));
    expect((await post({ orderId: '7246120386800' })).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
    expect(addOrderTag).not.toHaveBeenCalled();
  });

  it('needs the staff PIN', async () => {
    expect((await post({ orderId: '7246120386800' }, null)).status).toBe(401);
    expect((await post({ orderId: '7246120386800' }, 'wrong')).status).toBe(401);
    expect(send).not.toHaveBeenCalled();
    expect(fetchTicketOrder).not.toHaveBeenCalled();
  });

  it('says plainly when the order has no email, and sends nothing', async () => {
    fetchTicketOrder.mockResolvedValue(order({ email: null }));
    const res = await post({ orderId: '7246120386800' });
    expect(res.status).toBe(409);
    expect((await res.json()).message).toMatch(/no email address/i);
    expect(send).not.toHaveBeenCalled();
  });

  it.each(['cancelled', 'refunded', 'unpaid'] as const)('refuses a %s order', async (status) => {
    fetchTicketOrder.mockResolvedValue(order({ status }));
    expect((await post({ orderId: '7246120386800' })).status).toBe(409);
    expect(send).not.toHaveBeenCalled();
  });

  it('refuses an order with no tickets, an unknown order and a malformed request', async () => {
    fetchTicketOrder.mockResolvedValue(order({ status: 'none' }));
    expect((await post({ orderId: '7246120386800' })).status).toBe(409);
    fetchTicketOrder.mockResolvedValue(null);
    expect((await post({ orderId: '7246120386800' })).status).toBe(404);
    expect((await post({ orderId: 'abc' })).status).toBe(400);
    expect((await post({})).status).toBe(400);
  });

  it('reports a failed send without tagging the order', async () => {
    send.mockResolvedValue({ error: { message: 'down' } });
    const res = await post({ orderId: '7246120386800' });
    expect(res.status).toBe(502);
    expect((await res.json()).message).toMatch(/could not send/i);
    expect(addOrderTag).not.toHaveBeenCalled();
  });

  it('is not available when email is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await post({ orderId: '7246120386800' })).status).toBe(503);
  });
});
