import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import PageHero from '../components/PageHero';
import { formerPresidents, FLAG } from '../data/formerPresidentsData';
import type { FormerPresident } from '../data/formerPresidentsData';

/* ── Portrait retrato ────────────────────────────────────────────── */
function Portrait({ p }: { p: FormerPresident }) {
  const [failed, setFailed] = useState(false);
  const initials = p.name.split(' ').slice(0, 2).map((w) => w[0]).join('');

  return (
    <div className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl ring-1 ring-[#D9A441]/30 overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#003B73] to-[#0057A8] flex items-center justify-center shadow-md">
      {p.photo && !failed ? (
        <img
          src={p.photo}
          alt={p.name}
          className="w-full h-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-['Cormorant_Garamond'] font-semibold text-white/90 text-2xl">
          {initials}
        </span>
      )}
    </div>
  );
}

/* ── Países traduzidos (igual teamPage) ──────────────────────────── */
const COUNTRY_PT: Record<string, string> = {
  BR: 'Brasil', AR: 'Argentina', UY: 'Uruguai', PY: 'Paraguai', CL: 'Chile',
};
const COUNTRY_ES: Record<string, string> = {
  BR: 'Brasil', AR: 'Argentina', UY: 'Uruguay', PY: 'Paraguay', CL: 'Chile',
};
const COUNTRY_EN: Record<string, string> = {
  BR: 'Brazil', AR: 'Argentina', UY: 'Uruguay', PY: 'Paraguay', CL: 'Chile',
};

/* ── Página ──────────────────────────────────────────────────────── */
export default function FormerPresidentsPage() {
  const { t, lang } = useLanguage();
  const fp = (t as any).formerPresidentsPage as {
    subtitle: string;
    historyTitle: string;
    historySubtitle: string;
    mandatesLabel: string;
    countriesLabel: string;
    yearsLabel: string;
    mandate: string;
  };

  useSEO({
    title: t.nav.formerPresidents,
    description: fp.subtitle,
    url: '/ex-presidentes',
  });

  const countryMap =
    lang === 'pt' ? COUNTRY_PT : lang === 'en' ? COUNTRY_EN : COUNTRY_ES;

  const uniqueCountries = [...new Set(formerPresidents.map((p) => p.countryCode))].length;
  const yearsOfHistory = new Date().getFullYear() - 1985;

  return (
    <>
      <PageHero label="CONSUDES" title={t.nav.formerPresidents} subtitle={fp.subtitle} />

      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Intro ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#D9A441] mb-4">
                CONSUDES
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-[1.85rem] sm:text-5xl font-semibold text-[#1F2937] dark:text-white leading-tight tracking-tight mb-3 whitespace-nowrap">
                {fp.historyTitle}
              </h2>
              <p className="text-sm sm:text-[15px] text-[#1F2937]/70 dark:text-white/55">
                {fp.historySubtitle}
              </p>
            </div>

            {/* Stats */}
              <div
                className="flex items-center flex-shrink-0 divide-x divide-gray-100 dark:divide-white/10 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden self-start sm:self-auto"
                aria-label={`${formerPresidents.length} ${fp.mandatesLabel}, ${uniqueCountries} ${fp.countriesLabel}, ${yearsOfHistory} ${fp.yearsLabel}`}
              >
              <div className="text-center px-6 py-4">
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white leading-none" aria-hidden="true">
                  {formerPresidents.length}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#1F2937]/70 dark:text-white/55 mt-1" aria-hidden="true">
                  {fp.mandatesLabel}
                </p>
              </div>
              <div className="text-center px-6 py-4">
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white leading-none" aria-hidden="true">
                  {uniqueCountries}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#1F2937]/70 dark:text-white/55 mt-1" aria-hidden="true">
                  {fp.countriesLabel}
                </p>
              </div>
              <div className="text-center px-6 py-4">
                <p className="text-3xl font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white leading-none" aria-hidden="true">
                  {yearsOfHistory}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#1F2937]/70 dark:text-white/55 mt-1" aria-hidden="true">
                  {fp.yearsLabel}
                </p>
              </div>
            </div>
          </div>

          {/* ── Divisor dourado ───────────────────────────────── */}
          <div className="h-px w-full bg-gradient-to-r from-[#D9A441]/70 via-[#D9A441]/30 to-transparent mb-0" />

          {/* ── Timeline ──────────────────────────────────────── */}
          <ol>
            {formerPresidents.map((p, i) => (
              <li
                key={p.id}
                className="relative grid grid-cols-[3px_1fr] sm:grid-cols-[3px_auto_1fr_auto] gap-x-6 sm:gap-x-8 group"
              >
                {/* Linha vertical contínua */}
                <div className="row-span-1 flex flex-col items-center">
                  <div
                    className={`w-[3px] flex-1 ${
                      i === 0
                        ? 'bg-gradient-to-b from-[#D9A441] to-[#D9A441]/60'
                        : i === formerPresidents.length - 1
                        ? 'bg-gradient-to-b from-[#D9A441]/60 to-[#D9A441]/10'
                        : 'bg-[#D9A441]/40'
                    }`}
                  />
                </div>

                {/* Conteúdo da linha */}
                <div className="col-start-2 col-span-3 sm:col-span-1 sm:col-start-auto flex items-center sm:contents">
                  {/* Coluna período */}
                  <div className="hidden sm:flex flex-col justify-center w-32 py-10 flex-shrink-0">
                    <p className="font-['Cormorant_Garamond'] text-[#D9A441] text-[2.75rem] font-semibold leading-none tabular-nums">
                      {p.mandateStart}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-px flex-1 bg-gradient-to-r from-[#D9A441]/60 to-transparent max-w-[24px]" />
                      <p className="font-['Cormorant_Garamond'] text-[#D9A441]/65 text-2xl font-semibold leading-none tabular-nums">
                        {p.mandateEnd}
                      </p>
                    </div>
                  </div>

                  {/* Linha separadora + info + foto */}
                  <div
                    className={`flex flex-1 items-center gap-5 sm:gap-8 py-10 min-w-0 ${
                      i < formerPresidents.length - 1
                        ? 'border-b border-[#D9A441]/12 dark:border-white/[0.06]'
                        : ''
                    }`}
                  >
                    {/* Período mobile */}
                    <div className="sm:hidden flex flex-col justify-center w-20 flex-shrink-0">
                      <p className="font-['Cormorant_Garamond'] text-[#D9A441] text-3xl font-semibold leading-none tabular-nums">
                        {p.mandateStart}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-px w-3 bg-[#D9A441]/50" />
                        <p className="font-['Cormorant_Garamond'] text-[#D9A441]/65 text-xl font-semibold leading-none tabular-nums">
                          {p.mandateEnd}
                        </p>
                      </div>
                    </div>

                    {/* Nome + cargo + país */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#003B73]/70 dark:text-white/40 mb-1.5">
                        {fp.mandate}
                      </p>
                      <h3 className="font-['Cormorant_Garamond'] text-[1.6rem] sm:text-[2rem] font-semibold text-[#1F2937] dark:text-white leading-tight">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className="text-lg leading-none">{FLAG[p.countryCode]}</span>
                        <span className="text-sm text-[#1F2937]/70 dark:text-white/55 tracking-wide">
                          {countryMap[p.countryCode] ?? p.countryCode}
                        </span>
                      </div>
                    </div>

                    {/* Retrato */}
                    <div className="flex-shrink-0 opacity-85 group-hover:opacity-100 transition-opacity duration-200">
                      <Portrait p={p} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

