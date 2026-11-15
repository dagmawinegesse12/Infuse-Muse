import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TicketOrder } from '@/lib/tickets';

const order = (name: string, email = 'jane@example.com'): TicketOrder => ({
  orderId: name.replace('#', ''),
  name,
  holder: 'Jane Doe',
  email,
  total: 1,
  admitted: [],
  emailed: true,
  status: 'ok',
});

const find = vi.fn<(email: string) => Promise<TicketOrder[]>>();
const send = vi.fn<(o: TicketOrder) => Promise<void>>();

vi.mock('@/lib/shopify-admin', () => ({
  adminConfigured: () => true,
  findTicketOrdersByEmail: (email: string) => find(email),
}));
vi.mock('@/lib/send-ticket-email', () => ({ sendTicketEmail: (o: TicketOrder) => send(o) }));

async function post(body: unknown) {
  const { POST } = await import('@/app/api/tickets/lookup/route');
  const res = await POST(new Request('http://localhost/api/tickets/lookup', { method: 'POST', body: JSON.stringify(body) }));
  return { status: res.status, json: await res.json() };
}

describe('POST /api/tickets/lookup', () => {
  beforeEach(() => {
    vi.resetModules();
    find.mockReset();
    send.mockReset().mockResolvedValue(undefined);
    vi.stubEnv('TICKET_SECRET', 'secret');
    vi.stubEnv('RESEND_API_KEY', 're_test');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('emails every ticket order for the email and never returns a ticket link', async () => {
    find.mockResolvedValue([order('#1040'), order('#1020')]);
    const { status, json } = await post({ email: ' Jane@Example.com ' });

    expect(status).toBe(200);
    expect(find).toHaveBeenCalledWith('jane@example.com');
    expect(send.mock.calls.map(([o]) => o.name)).toEqual(['#1040', '#1020']);
    expect(JSON.stringify(json)).not.toMatch(/tickets\//);
  });

  it('answers the same for an email with no tickets, and sends nothing', async () => {
    find.mockResolvedValue([order('#1040')]);
    const hit = await post({ email: 'jane@example.com' });
    find.mockResolvedValue([]);
    const miss = await post({ email: 'nobody@example.com' });

    expect(miss).toEqual(hit);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('sends at most once a minute to the same email', async () => {
    find.mockResolvedValue([order('#1040')]);
    const { POST } = await import('@/app/api/tickets/lookup/route');
    const req = () => new Request('http://localhost/x', { method: 'POST', body: JSON.stringify({ email: 'jane@example.com' }) });
    expect((await POST(req())).status).toBe(200);
    expect((await POST(req())).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('rejects a missing or malformed email without looking anything up', async () => {
    expect((await post({ email: 'not-an-email' })).status).toBe(400);
    expect((await post({ order: '1042' })).status).toBe(400);
    expect(find).not.toHaveBeenCalled();
  });

  it('says so when sending fails, and lets the guest try again straight away', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    find.mockResolvedValue([order('#1040')]);
    send.mockRejectedValueOnce(new Error('Resend: down'));
    const { POST } = await import('@/app/api/tickets/lookup/route');
    const req = () => new Request('http://localhost/x', { method: 'POST', body: JSON.stringify({ email: 'jane@example.com' }) });
    expect((await POST(req())).status).toBe(502);
    expect((await POST(req())).status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
  });

  it('is unavailable without email sending configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await post({ email: 'jane@example.com' })).status).toBe(503);
  });
});
