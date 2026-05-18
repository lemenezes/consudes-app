import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function EventsPage() {
  const { t } = useLanguage();
  return (
    <PageShell
     
      title={t.nav.championships}
      subtitle="Calendário oficial de competições e eventos da confederação."
      breadcrumbs={[{ label: t.nav.championships }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-6 border border-gray-200 dark:border-white/10 rounded-xl p-5 animate-pulse">
              <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-100 dark:bg-white/10" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-100 dark:bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-consudes-blue-text/40 dark:text-white/30 text-sm mt-12">
          {t.common.contentUnderConstruction}
        </p>
      </section>
    </PageShell>
  );
}
