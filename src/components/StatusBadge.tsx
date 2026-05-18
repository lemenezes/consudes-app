export type StatusVariant =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'completed'
  | 'draft'
  | 'upcoming'
  | 'open'
  | 'closed';

interface StatusConfig {
  label: string;
  badge: string;
  dot: string;
}

const CONFIG: Record<StatusVariant, StatusConfig> = {
  active: {
    label: 'Ativo',
    badge: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800',
    dot:   'bg-green-500',
  },
  inactive: {
    label: 'Inativo',
    badge: 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10',
    dot:   'bg-gray-400',
  },
  pending: {
    label: 'Pendente',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    dot:   'bg-amber-500',
  },
  completed: {
    label: 'Concluído',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    dot:   'bg-blue-500',
  },
  draft: {
    label: 'Rascunho',
    badge: 'bg-gray-50 text-gray-500 border border-gray-200',
    dot:   'bg-gray-300',
  },
  upcoming: {
    label: 'Em breve',
    badge: 'bg-consudes-blue/8 text-consudes-blue-text border border-consudes-navy/20 dark:bg-white/8 dark:text-white/70 dark:border-white/15',
    dot:   'bg-consudes-blue-mid',
  },
  open: {
    label: 'Aberto',
    badge: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800',
    dot:   'bg-orange-400',
  },
  closed: {
    label: 'Encerrado',
    badge: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot:   'bg-gray-400',
  },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  /** Override do label padrão da variante */
  label?: string;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

/**
 * Badge de status com ponto colorido — padrão de listagens do CONSUDES.
 *
 * Uso:
 *   <StatusBadge variant="active" />
 *   <StatusBadge variant="pending" label="Aguardando aprovação" />
 */
export function StatusBadge({ variant, label, showDot = true, size = 'sm' }: StatusBadgeProps) {
  const { label: defaultLabel, badge, dot } = CONFIG[variant];
  const text = label ?? defaultLabel;
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold',
        textSize,
        badge,
      ].join(' ')}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} aria-hidden="true" />
      )}
      {text}
    </span>
  );
}
