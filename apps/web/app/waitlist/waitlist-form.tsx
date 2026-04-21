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
      <div className="py-4 text-center">
        <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '1.1rem', fontStyle: 'italic', color: '#d4b87a', letterSpacing: '0.04em', marginBottom: '10px' }}>
          You are on the list. We will be in touch.
        </p>
        <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: '0.82rem', color: 'rgba(200,190,158,0.6)', letterSpacing: '0.04em', fontStyle: 'italic' }}>
          Don't see our email? Check your spam or promotions folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="mb-2 flex transition-colors"
        style={{ border: '1px solid rgba(184,154,90,0.45)', background: 'rgba(255,255,255,0.04)' }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '13px 14px',
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            color: '#f0ead8',
            letterSpacing: '0.02em',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            background: '#b89a5a',
            border: 'none',
            padding: '13px 16px',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: 'clamp(0.62rem, 1.6vw, 0.72rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#0a1509',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            opacity: status === 'loading' ? 0.6 : 1,
          }}
        >
          {status === 'loading' ? '…' : 'Enter the circle'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-center text-xs" style={{ color: 'rgba(255,100,100,0.7)', fontStyle: 'italic' }}>{message}</p>
      )}
    </form>
  );
}
