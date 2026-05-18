import { useEffect, useState } from 'react';
import { LayoutGrid, List, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import FederationCard from '../components/FederationCard';
import { federationsData } from '../data/federationsData';
import { listFederations } from '../services/federationsService';
import type { FederationRow } from '../lib/database.types';
import type { Federation } from '../data/federationsData';
import { useSEO } from '../hooks/useSEO';

/* ── Ícones sociais (visualização lista) ── */
function IcoInstagram() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
}
function IcoFacebook() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function IcoYoutube() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
}
function IcoTwitter() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

const BTN_BASE = 'w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-150 shrink-0';

function ListSocialLinks({ fed }: { fed: Federation }) {
  type SL = { href: string; icon: React.ReactNode; label: string; cls: string };
  const links: SL[] = [];
  if (fed.socials.website)   links.push({ href: fed.socials.website,   icon: <Globe size={13} aria-hidden="true" />, label: `Website ${fed.acronym}`,     cls: 'border-consudes-border/50 dark:border-white/10 text-consudes-navy/60 dark:text-white/40 hover:bg-consudes-navy hover:text-white hover:border-consudes-navy dark:hover:bg-white/15 dark:hover:text-white' });
  if (fed.socials.instagram) links.push({ href: fed.socials.instagram, icon: <IcoInstagram />,                               label: `Instagram ${fed.acronym}`,   cls: 'border-consudes-border/50 dark:border-white/10 text-[#E1306C]/70 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]' });
  if (fed.socials.facebook)  links.push({ href: fed.socials.facebook,  icon: <IcoFacebook />,                                label: `Facebook ${fed.acronym}`,    cls: 'border-consudes-border/50 dark:border-white/10 text-[#1877F2]/70 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]' });
  if (fed.socials.youtube)   links.push({ href: fed.socials.youtube,   icon: <IcoYoutube />,                                 label: `YouTube ${fed.acronym}`,     cls: 'border-consudes-border/50 dark:border-white/10 text-[#FF0000]/70 hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]' });
  if (fed.socials.twitter)   links.push({ href: fed.socials.twitter,   icon: <IcoTwitter />,                                 label: `X/Twitter ${fed.acronym}`,   cls: 'border-consudes-border/50 dark:border-white/10 text-consudes-muted dark:text-white/40 hover:bg-consudes-dark hover:text-white hover:border-consudes-dark dark:hover:bg-white/15' });
  if (links.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {links.map(({ href, icon, label, cls }) => (
        <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className={`${BTN_BASE} ${cls}`}>
          {icon}
        </a>
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <li>
      <div className="hidden md:grid md:grid-cols-[3rem_10rem_5rem_minmax(0,1fr)_11.25rem] items-center gap-4 px-5 py-3 animate-pulse">
        <div className="h-7 w-7 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded" />
        <div className="h-3.5 w-10 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-3 w-48 bg-gray-100 dark:bg-white/5 rounded" />
        <div className="flex gap-1.5">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" />
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" />
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" />
        </div>
      </div>
      <div className="md:hidden flex items-start gap-3 px-4 py-3.5 animate-pulse">
        <div className="h-7 w-8 bg-gray-200 dark:bg-white/10 rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-16 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="h-3 w-40 bg-gray-100 dark:bg-white/5 rounded" />
          <div className="flex gap-1.5 pt-0.5">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" />
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      </div>
    </li>
  );
}

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
  const { t, lang } = useLanguage();
  const [federations, setFederations] = useState<Federation[]>(federationsData);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>(() => {
    try { return (localStorage.getItem('federations-view') as 'cards' | 'list') ?? 'cards'; }
    catch { return 'cards'; }
  });

  useSEO({
    title: t.nav.federations,
    description: t.federationsPage.subtitle,
    url: '/federacoes',
  });

  useEffect(() => {
    try { localStorage.setItem('federations-view', viewMode); } catch {}
  }, [viewMode]);

  useEffect(() => {
    listFederations().then(({ data, error }) => {
      if (!error && data.length > 0) {
        setFederations(data.map(rowToFederation));
      }
      setLoading(false);
    });
  }, []);

  return (
    <PageShell
     
      title={t.nav.federations}
      subtitle={t.federationsPage.subtitle}
      breadcrumbs={[{ label: t.nav.federations }]}
    >
      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-consudes-dark-body dark:bg-none py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro institucional */}
          <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-px w-6 bg-consudes-gold shrink-0" aria-hidden="true" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-consudes-gold">
                  {loading ? '…' : `${federations.length} ${t.federationsPage.affiliatedCount}`}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond'] font-semibold text-consudes-blue-text dark:text-white leading-tight">
                {t.federationsPage.introHeadline}
              </h2>
            </div>

            {/* Toggle cards / lista */}
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 border border-consudes-border dark:border-white/10 rounded-lg p-1 shrink-0" role="group" aria-label="Alternar visualização">
              <button
                onClick={() => setViewMode('cards')}
                aria-label="Visualização em cards"
                aria-pressed={viewMode === 'cards'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${viewMode === 'cards' ? 'bg-consudes-navy text-white dark:bg-white/15 dark:text-white shadow-sm' : 'text-consudes-muted dark:text-white/40 hover:text-consudes-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'}`}
              >
                <LayoutGrid size={13} aria-hidden="true" />
                {t.federationsPage.viewCards}
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="Visualização compacta"
                aria-pressed={viewMode === 'list'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors ${viewMode === 'list' ? 'bg-consudes-navy text-white dark:bg-white/15 dark:text-white shadow-sm' : 'text-consudes-muted dark:text-white/40 hover:text-consudes-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/8'}`}
              >
                <List size={13} aria-hidden="true" />
                {t.federationsPage.viewList}
              </button>
            </div>
          </div>

          {/* Cards */}
          {viewMode === 'cards' && (
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
          )}

          {/* Lista */}
          {viewMode === 'list' && (
          <div className="rounded-2xl border border-consudes-border/50 dark:border-white/8 overflow-hidden bg-white dark:bg-consudes-dark shadow-card">
            {/* Cabeçalho — desktop only */}
            <div className="hidden md:grid md:grid-cols-[3rem_10rem_5rem_minmax(0,1fr)_11.25rem] items-center gap-4 px-5 py-2.5 bg-slate-50 dark:bg-white/5 border-b border-consudes-border/40 dark:border-white/8">
              <div />
              <div className="text-[10px] font-bold uppercase tracking-widest text-consudes-muted dark:text-white/40">País</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-consudes-muted dark:text-white/40">Sigla</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-consudes-muted dark:text-white/40">Federação</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-consudes-muted dark:text-white/40">Links</div>
            </div>
            <ul className="divide-y divide-consudes-border/40 dark:divide-white/8" aria-label="Lista de federações" aria-busy={loading}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              federations.map((fed) => {
                const countryName = lang === 'es' ? (fed.countryEs ?? fed.country)
                  : lang === 'en' ? (fed.countryEn ?? fed.country)
                  : fed.country;
                const fullName =
                  lang === 'es' ? (fed.fullNameEs ?? fed.fullName) :
                  lang === 'pt' ? (fed.fullNamePt ?? fed.fullName) :
                  (fed.fullNameEn ?? fed.fullNameEs ?? fed.fullName);
                return (
                  <li key={fed.acronym} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors duration-150">

                    {/* Desktop */}
                    <div className="hidden md:grid md:grid-cols-[3rem_10rem_5rem_minmax(0,1fr)_11.25rem] items-center gap-4 px-5 py-3">
                      <span className="text-2xl leading-none" role="img" aria-label={fed.country}>{fed.flag}</span>
                      <p className="text-[13px] text-consudes-blue-text dark:text-white/70 leading-snug truncate min-w-0">{countryName}</p>
                      <span className="font-bold text-sm text-consudes-blue-text dark:text-white group-hover:text-consudes-gold transition-colors duration-150 leading-none tracking-wide">{fed.acronym}</span>
                      <p className="text-[13px] text-consudes-muted dark:text-white/50 leading-snug truncate min-w-0">{fullName}</p>
                      <ListSocialLinks fed={fed} />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden flex items-start gap-3 px-4 py-3.5">
                      <span className="text-2xl leading-none shrink-0 mt-0.5" role="img" aria-label={fed.country}>{fed.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm text-consudes-blue-text dark:text-white">{fed.acronym}</span>
                          <span className="text-[11px] text-consudes-muted dark:text-white/50">{countryName}</span>
                        </div>
                        <p className="text-xs text-consudes-muted dark:text-white/50 truncate mb-2">{fullName}</p>
                        <ListSocialLinks fed={fed} />
                      </div>
                    </div>

                  </li>
                );
              })
            )}
            </ul>
          </div>
          )}

        </div>
      </section>
    </PageShell>
  );
}
