interface Stat {
  value: string;
  label: string;
}

interface StatBarProps {
  stats: Stat[];
  ariaLabel?: string;
}

const COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

/**
 * Barra de stats escura — padrão institucional do CONSUDES.
 * Pode ser usada abaixo do PageShell ou como bloco independente em seções.
 *
 * Uso:
 *   <StatBar stats={[{ value: '20', label: 'Federações' }, { value: '1986', label: 'Fundação' }]} />
 */
export function StatBar({ stats, ariaLabel = 'Resumo' }: StatBarProps) {
  return (
    <div
      className="bg-consudes-blue border-b border-white/10"
      role="region"
      aria-label={ariaLabel}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className={`grid ${COLS[stats.length] ?? 'grid-cols-3'} divide-x divide-white/10`}>
          {stats.map(({ value, label }) => (
            <div key={label} className="py-5 px-4 sm:px-8 text-center">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                {label}
              </dt>
              <dd className="text-xl sm:text-3xl font-black text-white tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
