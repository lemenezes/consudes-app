import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function SouthAmericanGamesPage() {
  const { t } = useLanguage();
  return (
    <PageShell title={t.nav.southAmericanGames} breadcrumbs={[{ label: t.nav.southAmericanGames }]}>
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <p className="text-center text-consudes-blue-text/40 dark:text-white/30 text-sm">
          {t.common.contentUnderConstruction}
        </p>
      </section>
    </PageShell>
  );
}
