'use client';

/** Hairline stepper. Squared, no pill, and labelled for screen readers. */
export function QuantityStepper({
  value,
  label,
  onChange,
  compact = false,
}: {
  value: number;
  label: string;
  onChange: (next: number) => void;
  compact?: boolean;
}) {
  // Steppers are tapped repeatedly; keep them comfortably large on touch.
  const pad = compact ? 'px-4 py-3' : 'px-5 py-3.5';

  return (
    <div
      className="inline-flex items-center border"
      style={{ borderColor: 'var(--rule-strong)' }}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease quantity of ${label}`}
        className={`${pad} text-ink-strong transition-opacity duration-300 hover:opacity-60`}
      >
        −
      </button>
      <span className="t-price min-w-10 text-center" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Increase quantity of ${label}`}
        className={`${pad} text-ink-strong transition-opacity duration-300 hover:opacity-60`}
      >
        +
      </button>
    </div>
  );
}
