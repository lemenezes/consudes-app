import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function FederationsPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.federations}
        subtitle="Em breve: listagem completa das federações filiadas à CONSUDES."
      />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-white/10 rounded-xl p-6 flex flex-col gap-3 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10" />
                <div className="h-4 bg-gray-100 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-1/2" />
              </div>
            ))}
          </div>
          <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm mt-12">
            Conteúdo em construção
          </p>
        </div>
      </section>
    </>
  );
}
