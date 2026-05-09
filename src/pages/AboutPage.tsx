import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.about}
        subtitle={t.about.title}
      />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-[#1F2937]/80 dark:text-white/70 text-base sm:text-lg leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>
      </section>
    </>
  );
}
