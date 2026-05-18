/**
 * @legacy ORPHAN — não está no roteador (App.tsx)
 *
 * Conceito "Programas" foi descartado para a CONSUDES.
 * Futura rota planejada: /atividade-esportiva
 * Futuro arquivo: ActivitiesPage.tsx ou SportsActivityPage.tsx
 *
 * Conteúdo atual: repete os 4 cards de t.programs.items
 * já exibidos na seção #programas da HomePage.
 * Não deletar antes de revisar e criar a substituta.
 */
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function ProgramsPage() {
  const { t } = useLanguage();
  return (
    <PageShell
      label="CONSUDES"
      title={t.programs.title}
      subtitle={t.programs.subtitle}
      breadcrumbs={[{ label: t.programs.title }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {t.programs.items.map((item, i) => (
            <div key={i} className="border border-gray-200 dark:border-white/10 rounded-xl p-8">
              <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#003B73] dark:text-white mb-3">
                {item.title}
              </h2>
              <p className="text-[#1F2937]/70 dark:text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
