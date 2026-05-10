import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import FederationCard from '../components/FederationCard';
import { federationsData } from '../data/federationsData';

export default function FederationsPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.federations}
        subtitle={t.federationsPage.subtitle}
      />

      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-[#0d1624] dark:bg-none py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro institucional */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#D9A441] mb-2">
              {federationsData.length} {t.federationsPage.affiliatedCount}
            </p>
            <p className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] dark:text-white leading-snug max-w-lg">
              {t.federationsPage.introHeadline}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {federationsData.map((fed) => (
              <FederationCard key={fed.acronym} federation={fed} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
