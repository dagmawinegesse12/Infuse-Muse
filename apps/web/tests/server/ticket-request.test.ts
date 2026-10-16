import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateTicketRequest, HONEYPOT } from '@/lib/validation';

const send = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

const valid = { name: 'Jane Doe', email: 'Jane@Example.com', tickets: '2', note: 'A friend is coming.' };

describe('validateTicketRequest', () => {
  it('accepts a request and normalises the email and count', () => {
    const r = validateTicketRequest(valid);
    expect(r).toEqual({
      ok: true,
      value: { name: 'Jane Doe', email: 'jane@example.com', tickets: 2, note: 'A friend is coming.' },
    });
  });

  it('allows an empty note', () => {
    expect(validateTicketRequest({ ...valid, note: '' }).ok).toBe(true);
  });

  it.each([
    [{ ...valid, name: '  ' }, /name/i],
    [{ ...valid, email: 'nope' }, /email/i],
    [{ ...valid, tickets: '0' }, /between 1 and 6/],
    [{ ...valid, tickets: '7' }, /between 1 and 6/],
    [{ ...valid, tickets: '1.5' }, /between 1 and 6/],
    [{ ...valid, tickets: 'abc' }, /between 1 and 6/],
    [{ ...valid, note: 'x'.repeat(4001) }, /too long/i],
  ])('rejects %#', (input, message) => {
    const r = validateTicketRequest(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(message);
  });
});

describe('POST /api/ticket-request', () => {
  async function post(body: unknown) {
    const { POST } = await import('@/app/api/ticket-request/route');
    return POST(new Request('http://localhost/api/ticket-request', { method: 'POST', body: JSON.stringify(body) }));
  }

  beforeEach(() => {
    vi.resetModules();
    send.mockReset().mockResolvedValue({});
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('CONTACT_INBOX', 'owner@example.com');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('emails the owner with the guest as reply-to', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe('owner@example.com');
    expect(mail.replyTo).toBe('jane@example.com');
    expect(mail.subject).toBe('Ticket request: Jane Doe, 2 for Opening Pour');
    expect(mail.html).toContain('<strong>Tickets:</strong> 2');
  });

  it('escapes what guests type', async () => {
    await post({ ...valid, name: '<b>Eve</b>', note: '<script>x</script>' });
    const html = send.mock.calls[0][0].html as string;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('rejects bad input without sending', async () => {
    const res = await post({ ...valid, tickets: '99' });
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('thanks a bot but sends nothing', async () => {
    const res = await post({ ...valid, [HONEYPOT]: 'spam' });
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it('says so plainly when email is not configured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const res = await post(valid);
    expect(res.status).toBe(503);
  });

  it('reports a send failure instead of claiming success', async () => {
    send.mockRejectedValue(new Error('down'));
    const res = await post(valid);
    expect(res.status).toBe(502);
  });
});
