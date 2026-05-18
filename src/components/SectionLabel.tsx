import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Label de seção com border-left dourado.
 * Aplica a classe CSS `.section-label` definida no index.css.
 *
 * Uso:
 *   <SectionLabel>Institucional</SectionLabel>
 */
export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return <span className={`section-label ${className}`.trim()}>{children}</span>;
}
