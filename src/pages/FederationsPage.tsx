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
        subtitle="Federações filiadas à Confederação Sul-Americana Desportiva de Surdos"
      />

      <section className="bg-[#F5F7FA] dark:bg-[#0d1624] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contador */}
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-8">
            {federationsData.length} federações afiliadas
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {federationsData.map((fed) => (
              <FederationCard key={fed.acronym} federation={fed} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
