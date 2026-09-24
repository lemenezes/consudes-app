import { ArrowRight, Dumbbell, Trophy } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import PageShell from "../components/PageShell";
import { useSEO } from "../hooks/useSEO";

export default function InterclubsHomePage() {
  const { t } = useLanguage();
  const p = t.interclubsHomePage;

  useSEO({ title: p.title, url: "/interclubes" });

  const sports = [
    { name: p.futsal, description: p.futsalDescription },
    { name: p.chess, description: p.chessDescription },
    { name: p.tableTennis, description: p.tableTennisDescription }
  ];

  return (
    <PageShell
      title={p.title}
      subtitle={p.subtitle}
      breadcrumbs={[
        { label: t.nav.sports, href: "/esportes" },
        { label: t.nav.interclubs }
      ]}>
      <section className="bg-slate-50 dark:bg-consudes-dark-body py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Dumbbell size={20} className="text-[#D9A441]" aria-hidden="true" />
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#003B73] dark:text-white">
              {p.sportsTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {sports.map(sport => (
              <article
                key={sport.name}
                className="flex flex-col rounded-2xl bg-white dark:bg-[#0d1624] border border-[#003B73]/8 dark:border-white/8 p-6 hover:border-[#D9A441]/50 dark:hover:border-[#D9A441]/40 hover:shadow-[0_4px_20px_rgba(0,57,115,0.10)] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-[#0057A8]/8 dark:bg-white/5 flex items-center justify-center mb-5">
                  <Trophy
                    size={20}
                    className="text-[#0057A8] dark:text-white/65"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#003B73] dark:text-white mb-3">
                  {sport.name}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-[#1F2937]/60 dark:text-white/50">
                  {sport.description}
                </p>
                <span className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-[#0057A8] dark:text-white/80">
                  {p.access}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
