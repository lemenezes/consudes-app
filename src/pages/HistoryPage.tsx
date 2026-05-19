import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import { useSEO } from '../hooks/useSEO';

export default function HistoryPage() {
  const { t } = useLanguage();
  const h = t.historyPage;
  useSEO({ title: t.nav.history, url: '/historia' });

  return (
    <PageShell label={h.label} title={t.nav.history} subtitle={h.heroSubtitle} breadcrumbs={[{ label: t.nav.institutional, href: '/institucional' }, { label: t.nav.history }]}>

      <section className="bg-white dark:bg-consudes-dark-body py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8">

          {/* Fundação */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-consudes-gold shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-consudes-gold">
              {h.foundingTitle}
            </span>
          </div>
          <p className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl font-semibold text-consudes-navy dark:text-white leading-none mb-5">
            {h.foundingDate}
          </p>
          <p className="text-[15px] text-consudes-muted dark:text-white/65 leading-relaxed">
            {h.foundingText}
          </p>

          {/* Trajetória */}
          <div className="mt-10 pt-10 border-t border-consudes-border/40 dark:border-white/8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-consudes-gold shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-consudes-gold">
                {h.timelineLabel}
              </span>
            </div>
            <div className="relative">
              {/* Linha vertical guia */}
              <div
                className="absolute left-[7px] top-[10px] bottom-0 w-[2px] bg-gradient-to-b from-consudes-gold/60 via-consudes-gold/40 to-transparent"
                aria-hidden="true"
              />
              <ol className="space-y-10" aria-label={h.timelineLabel}>
                {h.timeline.map((item, index) => (
                  <li key={item.year} className="relative pl-9 sm:pl-10">
                    {/* Marcador */}
                    <div
                      className={`absolute left-0 top-[3px] w-3.5 h-3.5 rounded-full z-10 ${
                        index === 0
                          ? 'bg-consudes-gold ring-[3px] ring-consudes-gold/25'
                          : 'bg-white dark:bg-consudes-dark-body border-2 border-consudes-gold/70'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-black text-consudes-gold tracking-[0.2em] uppercase block mb-1.5 leading-none">
                      {item.year}
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-semibold text-consudes-navy dark:text-white mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-consudes-muted dark:text-white/55 leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

        </div>
      </section>

    </PageShell>
  );
}

