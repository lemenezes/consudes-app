import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function RankingsPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero label="CONSUDES" title={t.nav.rankings} />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm">
          {t.common.contentUnderConstruction}
        </p>
      </section>
    </>
  );
}
