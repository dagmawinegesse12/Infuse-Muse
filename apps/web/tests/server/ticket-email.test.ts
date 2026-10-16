import { createHmac } from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TicketOrder } from '@/lib/tickets';
import { ticketEmail } from '@/lib/ticket-email';
import { verifyShopifyWebhook } from '@/lib/shopify-webhook';

const sign = (body: string, secret: string) => createHmac('sha256', secret).update(body).digest('base64');

describe('verifyShopifyWebhook', () => {
  const body = '{"id":123}';
  it('accepts a body signed with the app secret', () => {
    expect(verifyShopifyWebhook(body, sign(body, 'shpss_x'), 'shpss_x')).toBe(true);
  });
  it('rejects a changed body, a wrong secret, and a missing header or secret', () => {
    expect(verifyShopifyWebhook('{"id":124}', sign(body, 'shpss_x'), 'shpss_x')).toBe(false);
    expect(verifyShopifyWebhook(body, sign(body, 'other'), 'shpss_x')).toBe(false);
    expect(verifyShopifyWebhook(body, null, 'shpss_x')).toBe(false);
    expect(verifyShopifyWebhook(body, sign(body, 'shpss_x'), undefined)).toBe(false);
    expect(verifyShopifyWebhook(body, 'not-base64!!', 'shpss_x')).toBe(false);
  });
});

describe('ticketEmail', () => {
  const base = { holder: 'Jane Doe', orderName: '#1042', tickets: 2, link: 'https://www.infuseandmuse.com/tickets/123.abc', findUrl: 'https://www.infuseandmuse.com/tickets' };

  it('greets by first name, counts the tickets and carries the personal link in both versions', () => {
    const m = ticketEmail(base);
    expect(m.subject).toBe('Your Opening Pour tickets');
    for (const body of [m.html, m.text]) {
      expect(body).toContain('Jane');
      expect(body).toContain('Your 2 tickets');
      expect(body).toContain(base.link);
      expect(body).toContain('#1042');
      expect(body).toContain('Downtown Toronto');
    }
    expect(m.html).toContain('href="https://www.infuseandmuse.com/tickets/123.abc"');
  });

  it('says ticket, not tickets, for one', () => {
    const m = ticketEmail({ ...base, tickets: 1 });
    expect(m.subject).toBe('Your Opening Pour ticket');
    expect(m.text).toContain('Your ticket for Opening Pour is ready.');
  });

  it('never prints the street address and uses no em dashes', () => {
    const m = ticketEmail(base);
    expect(m.html + m.text).not.toMatch(/Wade|M6H|—/);
  });

  it('escapes what a guest typed as their name', () => {
    const m = ticketEmail({ ...base, holder: '<script>alert(1)</script> Doe' });
    expect(m.html).not.toContain('<script>');
    expect(m.html).toContain('&lt;script&gt;');
  });
});

describe('POST /api/webhooks/orders-paid', () => {
  const send = vi.fn();
  const fetchTicketOrder = vi.fn();
  const addOrderTag = vi.fn();
  const SECRET = 'shpss_test';

  const order = (over: Partial<TicketOrder> = {}): TicketOrder => ({
    orderId: '7246120386800', name: '#1017', holder: 'Jane Doe', email: 'jane@example.com',
    total: 2, admitted: [], emailed: false, status: 'ok', ...over,
  });

  async function post(body: string, signature = sign(body, SECRET)) {
    const { POST } = await import('@/app/api/webhooks/orders-paid/route');
    return POST(new Request('http://localhost/api/webhooks/orders-paid', {
      method: 'POST', body, headers: { 'x-shopify-hmac-sha256': signature },
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
    vi.stubEnv('SHOPIFY_ADMIN_CLIENT_SECRET', SECRET);
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

  it('emails the guest their personal link and tags the order', async () => {
    const res = await post('{"id":7246120386800}');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ sent: true });
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe('jane@example.com');
    expect(mail.html).toContain('https://www.infuseandmuse.com/tickets/7246120386800.');
    expect(addOrderTag).toHaveBeenCalledWith('7246120386800', 'tickets-emailed');
  });

  it('does nothing for a delivery with a bad signature', async () => {
    const res = await post('{"id":7246120386800}', 'AAAA');
    expect(res.status).toBe(401);
    expect(send).not.toHaveBeenCalled();
    expect(fetchTicketOrder).not.toHaveBeenCalled();
  });

  it('sends only once, even if Shopify delivers twice', async () => {
    fetchTicketOrder.mockResolvedValue(order({ emailed: true }));
    expect(await (await post('{"id":1}')).json()).toMatchObject({ sent: false, reason: 'already emailed' });
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ['an order with no tickets', order({ status: 'none' })],
    ['a cancelled order', order({ status: 'cancelled' })],
    ['an order with no email', order({ email: null })],
  ])('sends nothing for %s, and still answers 200 so Shopify does not retry', async (_n, o) => {
    fetchTicketOrder.mockResolvedValue(o);
    expect((await post('{"id":1}')).status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('asks Shopify to retry when the email fails, and does not tag', async () => {
    send.mockResolvedValue({ error: { message: 'down' } });
    expect((await post('{"id":1}')).status).toBe(500);
    expect(addOrderTag).not.toHaveBeenCalled();
  });

  it('does not ask for a retry when only the tagging fails', async () => {
    addOrderTag.mockRejectedValue(new Error('tag failed'));
    expect((await post('{"id":1}')).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('asks Shopify to retry when the site is not configured yet', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await post('{"id":1}')).status).toBe(503);
  });

  it('rejects a payload with no order id', async () => {
    expect((await post('{"nope":true}')).status).toBe(400);
  });
});
