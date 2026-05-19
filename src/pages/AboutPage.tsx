import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <PageShell
     
      title={t.nav.institutional}
      subtitle={t.about.title}
      breadcrumbs={[{ label: t.nav.institutional, href: '/institucional' }, { label: t.about.title }]}
    >
      <section className="bg-slate-50 dark:bg-consudes-dark-body py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-consudes-blue-text/80 dark:text-white/70 text-base sm:text-lg leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>
      </section>
    </PageShell>
  );
}
