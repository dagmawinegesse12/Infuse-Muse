'use client';

import { useState, type FormEvent } from 'react';

/** Closing band. A hairline field and a word — the same grammar as every CTA. */
export function Invitation() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Something went wrong.');
      setMessage(data.message);
      setState('done');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
      setState('error');
    }
  }

  return (
    <section
      className="bleed border-t py-[clamp(4rem,9vw,8rem)]"
      style={{ borderColor: 'var(--rule)' }}
    >
      <div className="shell mx-auto max-w-measure text-center">
        <p className="t-label t-label--accent">The list</p>
        <h2 className="t-head mt-6">Be told first, and quietly.</h2>
        <p className="t-body mt-6">
          New blends are made in small numbers. The list hears before the shop does —
          a few times a year, never more.
        </p>

        {state === 'done' ? (
          <p className="t-body t-body--lead mt-12">{message}</p>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-sm">
            <label htmlFor="invitation-email" className="sr-only">
              Email address
            </label>
            <input
              id="invitation-email"
              type="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field text-center"
            />
            <button type="submit" disabled={state === 'sending'} className="quiet-link mt-8">
              {state === 'sending' ? 'Sending' : 'Request an invitation'}
            </button>
            {state === 'error' ? (
              <p role="alert" className="t-body mt-4" style={{ color: '#e08a7a' }}>
                {message}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
