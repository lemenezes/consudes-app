import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import NewsCard from '../components/NewsCard';
import { usePublicNews } from '../hooks/usePublicNews';
import { useSEO } from '../hooks/useSEO';

export default function NewsPage() {
  const { t } = useLanguage();
  const { news, loading, error } = usePublicNews();

  useSEO({
    title: t.nav.news,
    description: t.news.subtitle,
    url: '/noticias',
  });

  return (
    <PageShell
     
      title={t.news.title}
      subtitle={t.news.subtitle}
      breadcrumbs={[{ label: t.news.title }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100 dark:bg-white/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 bg-gray-100 dark:bg-white/10 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 dark:bg-white/10 rounded w-4/5" />
                    <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-full" />
                    <div className="h-3 bg-gray-100 dark:bg-white/10 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Erro */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-red-500 text-sm">{t.news.loadError}</p>
            </div>
          )}

          {/* Lista */}
          {!loading && !error && news.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}

          {/* Vazio */}
          {!loading && !error && news.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-gray-200 dark:text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
              <p className="text-consudes-blue-text/40 dark:text-white/30 text-sm">
                {t.news.emptyState}
              </p>
            </div>
          )}

        </div>
      </section>
    </PageShell>
  );
}
