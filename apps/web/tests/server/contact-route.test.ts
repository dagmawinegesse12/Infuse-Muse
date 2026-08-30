import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({
  Resend: class { emails = { send }; },
}));

const post = async (body: unknown) => {
  const { POST } = await import('@/app/api/contact/route');
  return POST(new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }));
};

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Could you tell me about gift wrapping for six pouches?',
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.resetModules();
    send.mockReset().mockResolvedValue({ id: 'email_1' });
    process.env.RESEND_API_KEY = 'test_key';
    process.env.CONTACT_INBOX = 'hello@infuseandmuse.ca';
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it('sends a valid enquiry', async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it('sets reply-to so the owner can just hit reply', async () => {
    await post(valid);
    expect(send.mock.calls[0][0].replyTo).toBe('ada@example.com');
  });

  it('escapes HTML in the message body', async () => {
    await post({ ...valid, message: 'Hello <script>alert(1)</script> please advise' });
    const html = send.mock.calls[0][0].html;
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes HTML in the sender name too', async () => {
    await post({ ...valid, name: '<img onerror=alert(1)>' });
    expect(send.mock.calls[0][0].html).not.toContain('<img');
  });

  it.each([
    ['a missing name', { ...valid, name: '' }],
    ['a bad email', { ...valid, email: 'not-an-email' }],
    ['a too-short message', { ...valid, message: 'hi' }],
  ])('rejects %s without sending', async (_l, body) => {
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON', async () => {
    const res = await post('{oops');
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it('reports unavailability rather than pretending to send when unconfigured', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect(send).not.toHaveBeenCalled();
    expect((await res.json()).error).toMatch(/unavailable/i);
  });

  it('surfaces a provider failure instead of claiming success', async () => {
    send.mockRejectedValue(new Error('resend down'));
    const res = await post(valid);
    expect(res.status).toBe(502);
    expect((await res.json()).error).not.toContain('resend down');
  });
});
