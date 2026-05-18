import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import { useSEO } from '../hooks/useSEO';

export default function MissionPage() {
  const { t } = useLanguage();
  const m = t.missionPage;
  useSEO({ title: t.nav.mission, url: '/missao' });

  const blocks = [
    {
      label: m.missionTitle,
      text: m.missionText,
      accent: 'bg-[#0057A8]',
    },
    {
      label: m.visionTitle,
      text: m.visionText,
      accent: 'bg-[#D9A441]',
    },
    {
      label: m.purposeTitle,
      text: m.purposeText,
      accent: 'bg-[#003B73]',
    },
  ];

  return (
    <PageShell
      label={m.label}
      title={t.nav.mission}
      subtitle={m.heroSubtitle}
      breadcrumbs={[{ label: t.nav.institutional, href: '/institucional' }, { label: t.nav.mission }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 flex flex-col gap-6">
          {blocks.map((block) => (
            <div
              key={block.label}
              className="relative bg-[#F5F7FA] dark:bg-white/[0.03] rounded-2xl border border-[#003B73]/6 dark:border-white/8 overflow-hidden hover:border-[#D9A441]/30 transition-colors duration-200"
            >
              {/* barra lateral colorida */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${block.accent}`} />

              <div className="px-8 sm:px-10 py-8 sm:py-10 pl-10 sm:pl-12">
                <span className="text-[#D9A441] text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">
                  {block.label}
                </span>
                <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl lg:text-3xl font-medium text-[#1F2937] dark:text-white/90 leading-relaxed">
                  {block.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

