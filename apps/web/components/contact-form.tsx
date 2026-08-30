'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';

type State = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState('sending');
    try {
      const response = await fetch('/api/contact', {
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
      <div className="border-t pt-8" style={{ borderColor: 'var(--rule)' }}>
        <h2 className="t-sub">Received</h2>
        <p className="t-body mt-4">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <div>
        <label htmlFor="contact-name" className="t-label">
          Your name
        </label>
        <input id="contact-name" name="name" required className="field mt-3" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-email" className="t-label">
          Email address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="field mt-3"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="t-label">
          How can we help?
        </label>
        <textarea id="contact-message" name="message" rows={5} required className="field mt-3" />
      </div>

      {state === 'error' ? (
        <p role="alert" className="t-body" style={{ color: '#c2410c' }}>
          {message}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send inquiry'}
        </Button>
      </div>
    </form>
  );
}
