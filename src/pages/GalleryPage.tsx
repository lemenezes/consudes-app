import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function GalleryPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.gallery}
        subtitle="Registros fotográficos de eventos, competições e a história da confederação."
      />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-white/10 animate-pulse" />
          ))}
        </div>
        <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm mt-12">
          Conteúdo em construção
        </p>
      </section>
    </>
  );
}
