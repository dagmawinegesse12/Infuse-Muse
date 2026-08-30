'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

/** Hairline query box. Submits to /products?q= so results stay linkable. */
export function SearchField({
  defaultValue = '',
  category,
}: {
  defaultValue?: string;
  category?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = new URLSearchParams(params.toString());
    const q = value.trim();
    if (q) next.set('q', q);
    else next.delete('q');
    if (category) next.set('category', category);
    router.push(`/products${next.toString() ? `?${next}` : ''}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="flex max-w-md items-end gap-6">
      <div className="flex-1">
        <label htmlFor="product-search" className="t-label">
          Search the blends
        </label>
        <input
          id="product-search"
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="rose, mint, evening…"
          className="field mt-3"
        />
      </div>
      <button type="submit" className="quiet-link mb-4">
        Search
      </button>
    </form>
  );
}
