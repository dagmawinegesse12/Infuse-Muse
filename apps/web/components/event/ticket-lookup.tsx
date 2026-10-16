'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function TicketLookup() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/tickets/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      router.push(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-7" noValidate>
      <div>
        <label htmlFor="lookup-order" className="t-label">
          Order number
        </label>
        <input
          id="lookup-order"
          name="order"
          inputMode="numeric"
          placeholder="For example 1042"
          required
          className="field mt-3"
        />
      </div>
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
      <div>
        <Button type="submit" disabled={busy}>
          {busy ? 'Looking…' : 'Find my tickets'}
        </Button>
      </div>
    </form>
  );
}
