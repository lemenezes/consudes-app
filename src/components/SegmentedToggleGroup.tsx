import React from 'react';

interface Option<T> {
  value: T;
  label: React.ReactNode;
}

interface SegmentedToggleGroupProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedToggleGroup<T extends string | number>({
  options,
  value,
  onChange,
  className = '',
  ariaLabel,
}: SegmentedToggleGroupProps<T>) {
  return (
    <div
      className={`flex flex-wrap gap-2 rounded-lg bg-slate-100 dark:bg-white/5 p-1 ${className}`}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((opt, i) => (
        <button
          key={String(opt.value)}
          type="button"
          aria-pressed={value === opt.value}
          tabIndex={0}
          onClick={() => onChange(opt.value)}
          className={
            `px-3 py-1.5 text-sm font-semibold rounded-md border border-transparent transition-colors
            ${value === opt.value
              ? 'bg-consudes-blue text-white shadow-sm'
              : 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-consudes-blue/10'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-consudes-gold/80 focus-visible:ring-offset-2`
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
