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
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="flex overflow-hidden rounded-full border border-[#efcb80]/20 bg-[#f5efe6] shadow-lg">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 bg-transparent px-5 py-3.5 text-sm text-[#0a2a20] placeholder:text-[#0a2a20]/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="shrink-0 rounded-full bg-[#b8915a] px-6 py-3.5 text-sm font-medium text-[#f5efe6] transition hover:bg-[#c9a066] disabled:opacity-60 my-1 mr-1"
        >
          {status === 'loading' ? '…' : 'Join'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-center text-xs text-red-400/80">{message}</p>
      )}
    </form>
  );
}
