import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import FederationCard from '../components/FederationCard';
import { federationsData } from '../data/federationsData';
import { listFederations } from '../services/federationsService';
import type { FederationRow } from '../lib/database.types';
import type { Federation } from '../data/federationsData';
import { useSEO } from '../hooks/useSEO';

/** Converte FederationRow do Supabase para o shape que FederationCard espera */
function rowToFederation(row: FederationRow): Federation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = row as any;
  return {
    country:     r.country_es ?? r.country ?? '',
    countryEs:   r.country_es ?? r.country ?? '',
    countryEn:   r.country_en ?? r.country_es ?? r.country ?? '',
    acronym:     r.acronym ?? '',
    fullName:    r.name_es ?? r.name ?? '',
    fullNameEs:  r.name_es ?? r.name ?? undefined,
    fullNamePt:  r.name_pt ?? undefined,
    fullNameEn:  r.name_en ?? undefined,
    flag:        r.flag ?? '',
    logo:        r.logo_url ?? null,
    socials: {
      website:   r.website_url   ?? undefined,
      instagram: r.instagram_url ?? undefined,
      facebook:  r.facebook_url  ?? undefined,
      youtube:   r.youtube_url   ?? undefined,
      twitter:   r.twitter_url   ?? undefined,
      linkedin:  r.linkedin_url  ?? undefined,
      tiktok:    r.tiktok_url    ?? undefined,
      flickr:    r.flickr_url    ?? undefined,
    },
  };
}

export default function FederationsPage() {
  const { t } = useLanguage();
  const [federations, setFederations] = useState<Federation[]>(federationsData);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: t.nav.federations,
    description: t.federationsPage.subtitle,
    url: '/federacoes',
  });

  useEffect(() => {
    listFederations().then(({ data, error }) => {
      if (!error && data.length > 0) {
        setFederations(data.map(rowToFederation));
      }
      setLoading(false);
    });
  }, []);

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
              {loading ? '…' : `${federations.length} ${t.federationsPage.affiliatedCount}`}
            </p>
            <p className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] dark:text-white leading-snug max-w-lg">
              {t.federationsPage.introHeadline}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
              ))
            ) : (
              federations.map((fed) => (
                <FederationCard key={fed.acronym} federation={fed} />
              ))
            )}
          </div>

        </div>
      </section>
    </>
  );
}
