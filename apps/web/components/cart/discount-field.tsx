'use client';

import { useState, type FormEvent } from 'react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';

/**
 * "Have a code?" for the bag. Applied codes show as a line with the saving
 * and a Remove; the field itself stays out of the way until asked for.
 */
export function DiscountField() {
  const { state, applyDiscount, removeDiscount } = useCart();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim() || state.pending) return;
    await applyDiscount(code);
    setCode('');
    setOpen(false);
  }

  if (state.discountCode) {
    return (
      <div
        className="flex items-baseline justify-between gap-6 border-t py-4"
        style={{ borderColor: 'var(--rule)' }}
      >
        <div>
          <p className="t-body">
            Code <span className="t-price">{state.discountCode}</span>
          </p>
          <button
            type="button"
            onClick={removeDiscount}
            disabled={state.pending}
            className="hit t-label wipe-link mt-1"
          >
            Remove
          </button>
        </div>
        <p className="t-price">−{formatPrice(state.discount, state.currency)}</p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="border-t py-4" style={{ borderColor: 'var(--rule)' }}>
        <button type="button" onClick={() => setOpen(true)} className="hit t-label wipe-link">
          Have a code?
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-t py-4" style={{ borderColor: 'var(--rule)' }}>
      <label htmlFor="discount-code" className="t-label">
        Discount code
      </label>
      <div className="mt-3 flex gap-3">
        <input
          id="discount-code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="t-body min-w-0 flex-1 border bg-transparent px-4 py-3 outline-none focus-visible:border-current"
          style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-strong)' }}
        />
        <button
          type="submit"
          disabled={!code.trim() || state.pending}
          className="hit t-label border px-5 disabled:opacity-40"
          style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-strong)' }}
        >
          Apply
        </button>
      </div>
    </form>
  );
}
