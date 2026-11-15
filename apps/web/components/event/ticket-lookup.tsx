'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';

export function TicketLookup() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError('');
    setSent('');
    try {
      const res = await fetch('/api/tickets/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setSent(json.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-7" noValidate>
      <div>
        <label htmlFor="lookup-email" className="t-label">
          Email address
        </label>
        <input
          id="lookup-email"
          name="email"
          type="email"
          required
          className="field mt-3"
          autoComplete="email"
        />
      </div>
      {error ? (
        <p role="alert" className="t-body" style={{ color: '#c2410c' }}>
          {error}
        </p>
      ) : null}
      {sent ? (
        <p role="status" className="t-body">
          {sent}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Email my tickets'}
        </Button>
      </div>
    </form>
  );
}
