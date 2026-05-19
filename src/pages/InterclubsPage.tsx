import { useState } from 'react';
import { FileText, Trophy, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import { useSEO } from '../hooks/useSEO';
import { editions, championsM, championsF } from '../data/interclubsData';

const COUNTRY_FLAGS: Record<string, string> = {
  Paraguay: '🇵🇾', Uruguay: '🇺🇾', Brasil: '🇧🇷', Chile: '🇨🇱',
  Ecuador: '🇪🇨', Argentina: '🇦🇷', Bolivia: '🇧🇴', Colombia: '🇨🇴',
  Perú: '🇵🇪', Venezuela: '🇻🇪',
};
const flag = (c: string) => COUNTRY_FLAGS[c] ?? '';

const MEDAL = ['🥇', '🥈', '🥉'];

export default function InterclubsPage() {
  const { t } = useLanguage();
  const p = t.interclubsPage;
  useSEO({ title: t.nav.interclubs, url: '/interclubes' });

  const tabs = [...editions.map((e) => String(e.year)), 'champions'];
  const [active, setActive] = useState('2005');

  const edition = editions.find((e) => String(e.year) === active);

  return (
    <PageShell
      label={p.label}
      title={t.nav.interclubs}
      subtitle={p.heroSubtitle}
      breadcrumbs={[{ label: t.nav.sports, href: '/esportes' }, { label: t.nav.interclubs }]}
    >

      {/* Tab navigation */}
      <div className="sticky top-[60px] z-30 bg-[#0057A8] dark:bg-[#002D5E] shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
            {tabs.map((tab) => {
              const label = tab === 'champions' ? p.championsTab : tab;
              const isActive = active === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#D9A441] text-[#002D5E]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edition content */}
      {edition && active !== 'champions' && (
        <section className="bg-slate-50 dark:bg-consudes-dark-body py-14">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">

            {/* Edition header */}
            <div className="flex items-start gap-5 mb-10">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#0057A8] flex items-center justify-center shadow-md">
                <span className="text-white font-['Cormorant_Garamond'] font-bold text-xl leading-none">
                  {edition.roman}
                </span>
              </div>
              <div>
                <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase block mb-1">
                  {edition.flag} {edition.hostCountry}
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#003B73] dark:text-white leading-tight">
                  {edition.title}
                </h2>
                {edition.dateText && (
                  <p className="text-sm text-[#1F2937]/60 dark:text-white/50 mt-1">{edition.dateText}</p>
                )}
                {edition.cityText && !edition.dateText && (
                  <p className="text-sm text-[#1F2937]/60 dark:text-white/50 mt-1">{edition.cityText}</p>
                )}
              </div>
            </div>

            {/* Pending state */}
            {edition.pending && (
              <div className="rounded-2xl border border-[#003B73]/10 dark:border-white/10 bg-[#F5F7FA] dark:bg-[#080e1a] p-8 text-center">
                <p className="text-[#1F2937]/50 dark:text-white/40 text-sm">{p.pendingNote}</p>
              </div>
            )}

            {/* 2020 special: info block */}
            {edition.year === 2020 && (
              <div className="rounded-2xl border border-[#003B73]/10 dark:border-white/10 bg-[#F5F7FA] dark:bg-[#080e1a] p-6 mb-8">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.25em] uppercase block mb-1">Fecha</span>
                    <p className="text-[#1F2937] dark:text-white/80">21 al 31 de octubre de 2020</p>
                  </div>
                  <div>
                    <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.25em] uppercase block mb-1">Ciudad</span>
                    <p className="text-[#1F2937] dark:text-white/80">San Juan, Argentina</p>
                  </div>
                </div>
                {edition.note && (
                  <p className="text-xs text-[#1F2937]/40 dark:text-white/30 mt-4 pt-4 border-t border-[#003B73]/10 dark:border-white/10 italic">
                    {edition.note}
                  </p>
                )}
              </div>
            )}

            {/* PDF / Video links (2012) */}
            {(edition.pdfRelato || edition.pdfFixture) && (
              <div className="flex flex-wrap gap-3 mb-8">
                {edition.pdfRelato && (
                  <a
                    href={edition.pdfRelato}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0057A8]/30 dark:border-white/15 text-[#0057A8] dark:text-white/80 text-sm font-medium hover:bg-[#0057A8]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <FileText size={15} />
                    {p.relato}
                  </a>
                )}
                {edition.pdfFixture && (
                  <a
                    href={edition.pdfFixture}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0057A8]/30 dark:border-white/15 text-[#0057A8] dark:text-white/80 text-sm font-medium hover:bg-[#0057A8]/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <FileText size={15} />
                    {p.fixture}
                  </a>
                )}
              </div>
            )}

            {/* Sports results */}
            {edition.sports.length > 0 && (
              <div className="space-y-8">
                {edition.sports.map((sport) => (
                  <div key={sport.sport} className="rounded-2xl border border-[#003B73]/8 dark:border-white/8 overflow-hidden">
                    <div className="bg-[#F5F7FA] dark:bg-[#080e1a] px-5 py-3 border-b border-[#003B73]/8 dark:border-white/8">
                      <h3 className="font-semibold text-[#003B73] dark:text-white/90 text-sm tracking-wide">
                        {sport.sport}
                      </h3>
                    </div>
                    {sport.note || sport.standings.length === 0 ? (
                      <div className="px-5 py-4">
                        <p className="text-sm text-[#1F2937]/50 dark:text-white/40 italic">
                          {sport.note ?? p.noData}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#003B73]/6 dark:divide-white/6">
                        {sport.standings.map((s, i) => (
                          <div key={i} className="flex items-center gap-3 px-5 py-3">
                            <span className="text-base w-7 flex-shrink-0 text-center">
                              {s.place ? MEDAL[s.place - 1] ?? `${s.place}°` : ''}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-[#003B73] dark:text-white/90 text-sm">
                                {s.club}
                              </span>
                              {s.note && (
                                <span className="text-[#1F2937]/50 dark:text-white/40 text-xs ml-2">
                                  ({s.note})
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#1F2937]/55 dark:text-white/45 flex-shrink-0">
                              {flag(s.country)} {s.country}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Teams list */}
            {edition.teams && edition.teams.length > 0 && (
              <div className="mt-8 rounded-2xl border border-[#003B73]/8 dark:border-white/8 overflow-hidden">
                <div className="bg-[#F5F7FA] dark:bg-[#080e1a] px-5 py-3 border-b border-[#003B73]/8 dark:border-white/8 flex items-center gap-2">
                  <Users size={14} className="text-[#D9A441]" />
                  <h3 className="font-semibold text-[#003B73] dark:text-white/90 text-sm tracking-wide">
                    {p.teams}
                  </h3>
                </div>
                <div className="p-5 flex flex-wrap gap-2">
                  {edition.teams.map((team) => (
                    <span
                      key={team.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F7FA] dark:bg-white/5 border border-[#003B73]/10 dark:border-white/10 text-xs text-[#003B73] dark:text-white/80 font-medium"
                    >
                      {flag(team.country)} {team.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Relator */}
            {edition.relator && (
              <p className="mt-8 text-xs text-[#1F2937]/45 dark:text-white/35 italic">
                {p.relatorBy}: {edition.relator}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Champions tab */}
      {active === 'champions' && (
        <section className="bg-slate-50 dark:bg-consudes-dark-body py-14">
          <div className="max-w-5xl mx-auto px-6 sm:px-8">

            {/* Section header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-xl bg-[#D9A441] flex items-center justify-center shadow">
                <Trophy size={22} className="text-white" />
              </div>
              <div>
                <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase block mb-0.5">
                  {p.label}
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#003B73] dark:text-white">
                  {p.championsTab}
                </h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Masculino */}
              <ChampionsTable title={p.masculino} records={championsM} labels={p} />
              {/* Femenino */}
              <ChampionsTable title={p.femenino} records={championsF} labels={p} />
            </div>

            <p className="mt-8 text-xs text-[#1F2937]/40 dark:text-white/30 italic">
              {p.sourceNote}
            </p>
          </div>
        </section>
      )}
    </PageShell>
  );
}

function ChampionsTable({
  title,
  records,
  labels,
}: {
  title: string;
  records: import('../data/interclubsData').ChampionRecord[];
  labels: { edition: string; year: string; champion: string; runnerUp: string; thirdPlace: string };
}) {
  return (
    <div className="rounded-2xl border border-[#003B73]/8 dark:border-white/8 overflow-hidden">
      <div className="bg-[#F5F7FA] dark:bg-[#080e1a] px-5 py-3 border-b border-[#003B73]/8 dark:border-white/8">
        <h3 className="font-semibold text-[#003B73] dark:text-white/90 text-sm tracking-wide">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#003B73]/6 dark:border-white/6">
              <th className="text-left px-4 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/40 dark:text-white/35 w-14">
                {labels.edition}
              </th>
              <th className="text-left px-3 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/40 dark:text-white/35">
                🥇 {labels.champion}
              </th>
              <th className="text-left px-3 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/40 dark:text-white/35 hidden sm:table-cell">
                🥈 {labels.runnerUp}
              </th>
              <th className="text-left px-3 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F2937]/40 dark:text-white/35 hidden sm:table-cell">
                🥉 {labels.thirdPlace}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#003B73]/5 dark:divide-white/5">
            {records.map((r) => (
              <tr key={r.roman} className="hover:bg-[#F5F7FA] dark:hover:bg-white/3 transition-colors">
                <td className="px-4 py-3 font-['Cormorant_Garamond'] font-bold text-[#003B73] dark:text-white/80 text-base w-14">
                  {r.roman}
                  <span className="block text-[10px] font-sans font-normal text-[#1F2937]/40 dark:text-white/35">
                    {r.year}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="font-semibold text-[#003B73] dark:text-white/90 block">{r.first.club}</span>
                  <span className="text-xs text-[#1F2937]/50 dark:text-white/40">
                    {COUNTRY_FLAGS[r.first.country] ?? ''} {r.first.country}
                  </span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="font-medium text-[#1F2937]/80 dark:text-white/70 block">{r.second.club}</span>
                  <span className="text-xs text-[#1F2937]/50 dark:text-white/40">
                    {COUNTRY_FLAGS[r.second.country] ?? ''} {r.second.country}
                  </span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="font-medium text-[#1F2937]/80 dark:text-white/70 block">{r.third.club}</span>
                  <span className="text-xs text-[#1F2937]/50 dark:text-white/40">
                    {COUNTRY_FLAGS[r.third.country] ?? ''} {r.third.country}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

