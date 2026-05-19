import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function RankingsPage() {
  const { t } = useLanguage();
  return (
    <PageShell title={t.nav.rankings} breadcrumbs={[{ label: t.nav.rankings }]}>
      <section className="bg-slate-50 dark:bg-consudes-dark-body py-20">
        <p className="text-center text-consudes-blue-text/40 dark:text-white/30 text-sm">
          {t.common.contentUnderConstruction}
        </p>
      </section>
    </PageShell>
  );
}
