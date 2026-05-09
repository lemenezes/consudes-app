import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function NewsPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.news.title}
        subtitle={t.news.subtitle}
      />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100 dark:bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-gray-100 dark:bg-white/10 rounded w-4/5" />
                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm mt-12">
          Conteúdo em construção
        </p>
      </section>
    </>
  );
}
