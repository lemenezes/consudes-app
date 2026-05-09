import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function ValuesPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero label="CONSUDES" title={t.nav.values} />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm">
          Conteúdo em construção
        </p>
      </section>
    </>
  );
}
