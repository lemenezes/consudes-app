import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function GalleryPage() {
  const { t } = useLanguage();
  return (
    <PageShell
      label="CONSUDES"
      title={t.nav.gallery}
      subtitle={t.galleryPage.subtitle}
      breadcrumbs={[{ label: t.nav.gallery }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse" />
          ))}
        </div>
        <p className="text-center text-consudes-blue-text/40 dark:text-white/30 text-sm mt-12">
          {t.common.contentUnderConstruction}
        </p>
      </section>
    </PageShell>
  );
}
