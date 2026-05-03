'use client';

import { useState } from 'react';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? "You're on the list — we'll reach out before launch.");
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-5 text-center" role="status" aria-live="polite">
        <p className="wl-success-headline">
          You are on the list.
        </p>
        <p className="wl-success-body">
          We will be in touch soon.
        </p>
        <p className="wl-success-note">
          Don&apos;t see our email? Check your spam or promotions folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="mb-2 wl-form-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Email address
        </label>
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-describedby={status === 'error' ? 'waitlist-error' : undefined}
          aria-invalid={status === 'error'}
          className="wl-input"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="wl-btn"
        >
          {status === 'loading' ? 'Joining…' : 'Enter the circle'}
        </button>
      </div>
      {status === 'error' && (
        <p id="waitlist-error" role="alert" className="wl-error-msg">
          {message}
        </p>
      )}
    </form>
  );
}
