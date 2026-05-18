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
            <div className="border-t border-consudes-border/40 dark:border-white/8">
              {h.timeline.map((item) => (
                <div
                  key={item.year}
                  className="grid sm:grid-cols-[8rem_1fr] gap-3 sm:gap-8 py-5 border-b border-consudes-border/40 dark:border-white/8"
                >
                  <div className="pt-0.5 shrink-0">
                    <span className="text-[11px] font-black text-consudes-gold tracking-wider uppercase">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-semibold text-consudes-navy dark:text-white mb-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-consudes-muted dark:text-white/55 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </PageShell>
  );
}

