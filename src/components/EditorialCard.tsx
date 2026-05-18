import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface EditorialCardProps {
  title: string;
  description?: string;
  /** Ícone opcional exibido à esquerda em container azul suave */
  icon?: ReactNode;
  /** Se fornecido, o card vira um <Link to={href}> */
  href?: string;
  /** Faixa de cor no topo do card (gradiente azul→dourado) */
  topAccent?: boolean;
  className?: string;
}

/**
 * Card editorial reutilizável — padrão visual do CONSUDES.
 * Comportamento de hover: border azul sutil + shadow raise + lift.
 *
 * Uso:
 *   <EditorialCard title="Federações" description="20 filiadas" icon={<Globe />} href="/federacoes" />
 */
export function EditorialCard({
  title,
  description,
  icon,
  href,
  topAccent = false,
  className = '',
}: EditorialCardProps) {
  const baseClass = [
    'group relative flex flex-col bg-white dark:bg-white/5',
    'rounded-xl border border-consudes-border dark:border-white/10',
    'hover:border-consudes-blue-mid/30 hover:shadow-[var(--shadow-raise)] hover:-translate-y-0.5',
    'transition-all duration-200 overflow-hidden',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      {topAccent && (
        <div
          className="h-[3px] w-full bg-gradient-to-r from-consudes-navy via-consudes-blue-mid to-consudes-gold flex-shrink-0"
          aria-hidden="true"
        />
      )}
      <div className="flex items-start gap-4 p-5 flex-1">
        {icon && (
          <div
            className="flex-shrink-0 w-11 h-11 rounded-lg bg-consudes-blue/8 group-hover:bg-consudes-blue-mid/14 flex items-center justify-center text-consudes-blue-mid transition-colors"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-bold text-consudes-blue-text group-hover:text-consudes-blue-mid text-sm mb-0.5 transition-colors">
            {title}
          </p>
          {description && (
            <p className="text-consudes-muted text-xs leading-relaxed">{description}</p>
          )}
        </div>
        {href && (
          <ChevronRight
            size={14}
            className="flex-shrink-0 mt-1 self-center text-consudes-muted/30 group-hover:text-consudes-blue-mid group-hover:translate-x-0.5 transition-all"
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}
