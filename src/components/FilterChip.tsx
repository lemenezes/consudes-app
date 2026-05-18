import { X } from 'lucide-react';

export type FilterChipVariant = 'default' | 'gold' | 'blue' | 'green' | 'amber' | 'purple';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: FilterChipVariant;
}

const STYLES: Record<FilterChipVariant, { active: string; inactive: string }> = {
  default: {
    active:   'bg-consudes-blue text-white border-consudes-blue',
    inactive: 'bg-white text-consudes-body border-consudes-border hover:border-consudes-blue/40 dark:bg-white/5 dark:text-white/70 dark:border-white/15 dark:hover:border-white/30',
  },
  gold: {
    active:   'bg-consudes-gold text-consudes-blue border-consudes-gold font-black',
    inactive: 'bg-white text-consudes-body border-consudes-border hover:border-consudes-gold/60 dark:bg-white/5 dark:text-white/70 dark:border-white/15',
  },
  blue: {
    active:   'bg-consudes-blue-mid text-white border-consudes-blue-mid',
    inactive: 'bg-white text-consudes-blue-mid border-consudes-blue-mid/30 hover:border-consudes-blue-mid/60 dark:bg-white/5 dark:border-white/15',
  },
  green: {
    active:   'bg-green-600 text-white border-green-600',
    inactive: 'bg-white text-green-700 border-green-200 hover:border-green-400',
  },
  amber: {
    active:   'bg-amber-500 text-white border-amber-500',
    inactive: 'bg-white text-amber-700 border-amber-200 hover:border-amber-400',
  },
  purple: {
    active:   'bg-purple-600 text-white border-purple-600',
    inactive: 'bg-white text-purple-700 border-purple-200 hover:border-purple-400',
  },
};

/**
 * Pill/chip de filtro toggle — padrão de filtragem do CONSUDES.
 *
 * Uso:
 *   <FilterChip label="2025" active={activeYears.includes('2025')} onClick={() => toggleYear('2025')} />
 */
export function FilterChip({ label, active, onClick, variant = 'default' }: FilterChipProps) {
  const { active: activeClass, inactive: inactiveClass } = STYLES[variant];

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={active}
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
        'text-[11px] font-bold transition-all duration-150 cursor-pointer border select-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-consudes-gold focus-visible:ring-offset-1',
        active ? activeClass : inactiveClass,
      ].join(' ')}
    >
      {active && <X size={10} aria-hidden="true" />}
      {label}
    </button>
  );
}
