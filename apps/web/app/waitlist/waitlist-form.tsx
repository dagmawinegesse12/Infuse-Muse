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
      <div className="rounded-2xl border border-[#efcb80]/20 bg-[#efcb80]/8 px-6 py-5 text-center">
        <p className="font-serif text-xl text-[#efcb80]">You&apos;re on the list.</p>
        <p className="mt-2 text-sm text-white/50">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 rounded-full border border-white/15 bg-white/8 px-5 py-3.5 text-sm text-white placeholder:text-white/35 backdrop-blur focus:border-[#efcb80]/40 focus:outline-none focus:ring-1 focus:ring-[#efcb80]/30"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-[#efcb80] px-7 py-3.5 text-sm font-semibold text-[#0a2a20] transition hover:bg-[#fad483] disabled:opacity-60"
        >
          {status === 'loading' ? 'Joining…' : 'Join waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-center text-sm text-red-400">{message}</p>
      )}
    </form>
  );
}
