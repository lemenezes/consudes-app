import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Stat {
  value: string;
  label: string;
}

interface PageShellProps {
  /** Eyebrow/label acima do título (ex: "CONSUDES · Institucional") */
  label: string;
  title: string;
  subtitle?: string;
  /** Breadcrumbs exibidos acima do label. O "Início" é adicionado automaticamente. */
  breadcrumbs?: Breadcrumb[];
  /** Stats exibidas numa barra escura abaixo do hero. Quando presentes, substitui a wave. */
  stats?: Stat[];
  children: ReactNode;
}

const COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

export default function PageShell({
  label,
  title,
  subtitle,
  breadcrumbs,
  stats,
  children,
}: PageShellProps) {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative bg-consudes-navy overflow-hidden">
        {/* Fundo com gradiente */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-consudes-blue via-consudes-blue-mid to-consudes-blue-light opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-consudes-blue-light/20 rounded-full blur-3xl" />
        </div>

        {/* Acento dourado lateral direito */}
        <div
          className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-consudes-gold/60 via-consudes-gold/20 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">

          {/* Breadcrumb */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Localização atual"
              className="flex items-center justify-center gap-1.5 flex-wrap text-xs text-white/40 mb-6"
            >
              <Link to="/" className="hover:text-white/65 transition-colors">
                Início
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight size={11} aria-hidden="true" className="text-white/25 flex-shrink-0" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-white/65 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/65">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Label / eyebrow */}
          <span className="inline-block text-consudes-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
            {label}
          </span>

          {/* Título */}
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-4">
            {title}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-light text-balance">
              {subtitle}
            </p>
          )}
        </div>

        {/* Transição — wave (sem stats) ou divisor gradiente (com stats) */}
        {stats ? (
          <div
            className="h-[2px] bg-gradient-to-r from-transparent via-consudes-gold/50 to-transparent"
            aria-hidden="true"
          />
        ) : (
          <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]" aria-hidden="true">
            <svg
              viewBox="0 0 1440 40"
              className="w-full text-white dark:text-consudes-dark-body"
              preserveAspectRatio="none"
            >
              <path fill="currentColor" d="M0,40 C480,0 960,40 1440,0 L1440,40 Z" />
            </svg>
          </div>
        )}
      </section>

      {/* ── Stats bar (opcional) ───────────────────────────────────────── */}
      {stats && (
        <div
          className="bg-consudes-blue border-b border-white/10"
          role="region"
          aria-label="Resumo"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <dl className={`grid ${COLS[stats.length] ?? 'grid-cols-3'} divide-x divide-white/10`}>
              {stats.map(({ value, label: statLabel }) => (
                <div key={statLabel} className="py-5 px-4 sm:px-8 text-center">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
                    {statLabel}
                  </dt>
                  <dd className="text-xl sm:text-3xl font-black text-white tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
