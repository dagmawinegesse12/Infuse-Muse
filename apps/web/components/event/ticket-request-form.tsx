'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { MAX_TICKETS_PER_ORDER } from '@/lib/event';
import { HONEYPOT } from '@/lib/validation';

type State = 'idle' | 'sending' | 'sent' | 'error';

export function TicketRequestForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState('sending');
    try {
      const response = await fetch('/api/ticket-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? 'Something went wrong.');
      setMessage(json.message);
      setState('sent');
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div role="status">
        <h2 className="t-sub">Received</h2>
        <p className="t-body mt-4">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-7" noValidate>
      <div>
        <p className="t-label">Tickets</p>
        <p className="t-body mt-3">Tickets are by request.</p>
      </div>

      <div>
        <label htmlFor="ticket-name" className="t-label">
          Your name
        </label>
        <input id="ticket-name" name="name" required className="field mt-3" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="ticket-email" className="t-label">
          Email address
        </label>
        <input
          id="ticket-email"
          name="email"
          type="email"
          required
          className="field mt-3"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="ticket-count" className="t-label">
          How many tickets?
        </label>
        <select id="ticket-count" name="tickets" defaultValue="1" className="field mt-3">
          {Array.from({ length: MAX_TICKETS_PER_ORDER }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="ticket-note" className="t-label">
          Anything we should know? <span style={{ opacity: 0.6 }}>(optional)</span>
        </label>
        <textarea id="ticket-note" name="note" rows={3} className="field mt-3" />
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto' }}>
        <label htmlFor={`ticket-${HONEYPOT}`}>Leave this empty</label>
        <input
          id={`ticket-${HONEYPOT}`}
          name={HONEYPOT}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {state === 'error' ? (
        <p role="alert" className="t-body" style={{ color: '#c2410c' }}>
          {message}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Request access'}
        </Button>
      </div>
    </form>
  );
}
