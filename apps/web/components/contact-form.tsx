'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  CONTACT_TOPICS,
  FEEDBACK_ABOUT,
  HONEYPOT,
  type ContactTopic,
} from '@/lib/validation';

type State = 'idle' | 'sending' | 'sent' | 'error';

/**
 * One form for everything, with a choice of what the note is about at the top.
 * Feedback lives here rather than in a second form so a customer never has to
 * work out which box they were meant to use; the topic only changes the
 * subject line in the owner's inbox, and for feedback adds an optional "which
 * blend". Email stays required for feedback too, so she can reply.
 */
export function ContactForm() {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('question');
  const feedback = topic === 'feedback';

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
      {/* Real radios, so FormData carries the choice, drawn in the same
          words-and-hairline grammar as the site's other toggles. */}
      <fieldset>
        <legend className="t-label">What is this about?</legend>
        <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
          {CONTACT_TOPICS.map(({ value, label }) => {
            const active = topic === value;
            return (
              <label
                key={value}
                className="hit t-label relative cursor-pointer pb-1.5 pt-1.5 transition-opacity duration-500 ease-muse"
                style={{ color: 'var(--ink-strong)', opacity: active ? 1 : 0.45 }}
              >
                <input
                  type="radio"
                  name="topic"
                  value={value}
                  checked={active}
                  onChange={() => setTopic(value)}
                  className="sr-only"
                />
                {label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 ease-muse"
                  style={{
                    background: 'var(--accent)',
                    transform: active ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

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

      {feedback ? (
        <div>
          <label htmlFor="contact-about" className="t-label">
            Which blend? <span style={{ opacity: 0.6 }}>(optional)</span>
          </label>
          <select id="contact-about" name="about" defaultValue="" className="field mt-3">
            <option value="">Choose one</option>
            {FEEDBACK_ABOUT.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-message" className="t-label">
          {feedback ? 'Tell us what you thought' : 'How can we help?'}
        </label>
        <textarea id="contact-message" name="message" rows={5} required className="field mt-3" />
      </div>

      {/* Hidden from people and from assistive tech; see HONEYPOT. Moved off
          screen rather than display:none, which some bots know to skip. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', top: 'auto' }}>
        <label htmlFor={`contact-${HONEYPOT}`}>Leave this empty</label>
        <input
          id={`contact-${HONEYPOT}`}
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
          {state === 'sending' ? 'Sending…' : feedback ? 'Send feedback' : 'Send inquiry'}
        </Button>
      </div>
    </form>
  );
}
