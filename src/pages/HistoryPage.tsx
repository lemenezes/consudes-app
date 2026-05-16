import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile',
  'Colombia', 'Ecuador', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela',
];

export default function HistoryPage() {
  const { t } = useLanguage();
  const h = t.historyPage;

  return (
    <>
      <PageHero label={h.label} title={t.nav.history} subtitle={h.heroSubtitle} />

      {/* ── Fundação ── */}
      <section className="bg-white dark:bg-[#0d1624] py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase">
                {h.foundingTitle}
              </span>
              <p className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl font-semibold text-[#003B73] dark:text-white mt-3 mb-6 leading-[1]">
                {h.foundingDate}
              </p>
              <p className="text-[#1F2937]/70 dark:text-white/60 text-[15px] leading-relaxed">
                {h.foundingText}
              </p>
            </div>
            <div className="relative">
              <div className="bg-[#F5F7FA] dark:bg-white/[0.04] rounded-2xl p-8 border border-[#003B73]/6 dark:border-white/8">
                <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-medium text-[#003B73] dark:text-white leading-snug italic">
                  "{h.quoteText}"
                </p>
                <div className="mt-6 pt-6 border-t border-[#003B73]/8 dark:border-white/10 flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-[#D9A441]" />
                  <span className="text-[#D9A441] text-[11px] font-bold tracking-[0.2em] uppercase">CONSUDES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-[#F5F7FA] dark:bg-[#080e1a] py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase block mb-10">
            {h.timelineLabel}
          </span>
          <div className="relative">
            {/* linha vertical */}
            <div className="absolute left-[19px] sm:left-1/2 top-0 bottom-0 w-px bg-[#003B73]/10 dark:bg-white/10 -translate-x-px hidden sm:block" />

            <div className="flex flex-col gap-0">
              {h.timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-10 pb-12 ${
                    i % 2 === 0 ? 'sm:pr-[calc(50%+2.5rem)]' : 'sm:pl-[calc(50%+2.5rem)] sm:flex-row-reverse'
                  }`}
                >
                  {/* dot */}
                  <div className="hidden sm:flex absolute left-1/2 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D9A441] border-4 border-white dark:border-[#080e1a] z-10" />
                  <div className="bg-white dark:bg-white/[0.04] rounded-xl p-6 border border-[#003B73]/8 dark:border-white/8 hover:border-[#D9A441]/30 transition-colors duration-200 flex-1">
                    <span className="inline-block text-[#D9A441] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                      {item.year}
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-semibold text-[#003B73] dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#1F2937]/65 dark:text-white/55 text-[13px] leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Países afiliados ── */}
      <section className="bg-white dark:bg-[#0d1624] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase block mb-8">
            {h.countriesLabel}
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {COUNTRIES.map((country) => (
              <span
                key={country}
                className="px-4 py-2 rounded-full border border-[#003B73]/15 dark:border-white/10 text-[#003B73] dark:text-white/70 text-[13px] font-medium tracking-wide bg-[#F5F7FA] dark:bg-white/[0.03]"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

