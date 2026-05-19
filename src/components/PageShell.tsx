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
  /** Eyebrow/label acima do título (ex: "Institucional"). Omitir para suprimir o eyebrow. */
  label?: string;
  title: string;
  subtitle?: string;
  /** Breadcrumbs exibidos acima do label. O "Início" é adicionado automaticamente. */
  breadcrumbs?: Breadcrumb[];
  /** Stats exibidas numa barra escura abaixo do hero. Quando presentes, substitui a wave. */
  stats?: Stat[];
  /** Quando true, mantém alinhamento centrado. Padrão: false (editorial esquerdo). */
  centered?: boolean;
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
  centered = false,
  children,
}: PageShellProps) {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative bg-consudes-navy">
        {/* Fundo arquitetônico — profundo e editorial */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,#003B73,transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* Linha dourada no topo — identidade visual */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-consudes-gold/60 to-transparent"
          aria-hidden="true"
        />

        <div className={`relative max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-16 lg:py-20${centered ? ' text-center' : ''}`}>

          {/* Breadcrumb */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Localização atual"
              className={`flex items-center gap-1.5 flex-wrap text-xs text-white/35 mb-6${centered ? ' justify-center' : ''}`}
            >
              <Link to="/" className="hover:text-white/60 transition-colors">
                Início
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight size={10} aria-hidden="true" className="text-white/20 flex-shrink-0" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-white/60 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/60">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Label / eyebrow — estilo editorial */}
          {label && (
          <div className={`mb-4 ${centered ? 'flex items-center justify-center gap-3' : 'inline-flex items-center gap-2'}`}>
            <span className="w-5 h-px bg-consudes-gold/60" aria-hidden="true" />
            <span className="text-consudes-gold text-[10px] font-bold tracking-[0.4em] uppercase">
              {label}
            </span>
            {centered && <span className="w-5 h-px bg-consudes-gold/60" aria-hidden="true" />}
          </div>
          )}

          {/* Título */}
          <h1 className={`font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight mb-4 max-w-3xl${centered ? ' mx-auto' : ''}`}>
            {title}
          </h1>

          {/* Subtítulo */}
          {subtitle && (
            <p className={`text-white/65 text-[15px] sm:text-base max-w-2xl font-light leading-relaxed${centered ? ' mx-auto' : ''}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Separador — linha dourada sutil antes da stats bar */}
        {stats && (
          <div
            className="h-[2px] bg-gradient-to-r from-transparent via-consudes-gold/40 to-transparent"
            aria-hidden="true"
          />
        )}
        {/* Overlap anti-gap subpixel (Retina/Safari) */}
        {!stats && <div className="absolute inset-x-0 -bottom-px h-1 bg-consudes-navy" aria-hidden="true" />}      </section>

      {/* ── Stats bar (opcional) ───────────────────────────────────────── */}
      {stats && (
        <div
          className="bg-consudes-dark-deep border-b border-white/8"
          role="region"
          aria-label="Resumo"
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <dl className={`grid ${COLS[stats.length] ?? 'grid-cols-3'} divide-x divide-white/8`}>
              {stats.map(({ value, label: statLabel }) => (
                <div key={statLabel} className="py-6 px-4 sm:px-8 text-center">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                    {statLabel}
                  </dt>
                  <dd className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
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
