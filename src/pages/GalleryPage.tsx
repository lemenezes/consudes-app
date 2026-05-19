import { useState, useRef } from 'react';
import { SegmentedToggleGroup } from '../components/SegmentedToggleGroup';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import { useSEO } from '../hooks/useSEO';
import {
  galleryAlbums,
  getPhotoUrl,
  getDescription,
  GALLERY_CATEGORIES,
  type GalleryAlbum,
  type GalleryCategory,
} from '../data/galleryData';

// ── helpers ──────────────────────────────────────────────────────────────

function categoryLabel(cat: GalleryCategory, t: ReturnType<typeof useLanguage>['t']): string {
  const map: Record<GalleryCategory, string> = {
    'interclubes':          t.galleryPage.catInterclubes,
    'juegos-sudamericanos': t.galleryPage.catJuegos,
    'assembleias':          t.galleryPage.catAsambleas,
    'panamdes':             t.galleryPage.catPanamdes,
    'capacitacao':          t.galleryPage.catCapacitacion,
    'futsal-feminino':      t.galleryPage.catFutsal,
    'historico':            t.galleryPage.catHistorico,
  };
  return map[cat];
}

// ── Filter pill ─────────────────────────────────────────────────────────

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-0.5 text-[10px] md:px-3 md:py-1 md:text-[11px] rounded-full font-semibold tracking-wide border transition-all whitespace-nowrap ${
        active
          ? 'bg-consudes-blue text-white border-consudes-blue shadow-sm'
          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-consudes-blue/40 hover:text-consudes-blue dark:hover:text-blue-300'
      }`}
    >
      {children}
    </button>
  );
}

// ── Album cover ───────────────────────────────────────────────────────────

function AlbumCover({ album, className = '', t }: { album: GalleryAlbum; className?: string; t: ReturnType<typeof useLanguage>['t'] }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = album.coverFile ? getPhotoUrl(album.slug, album.coverFile) : '';

  if (!src || failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-consudes-blue/20 to-consudes-navy/40 dark:from-consudes-blue/25 dark:to-consudes-dark/70 ${className}`}>
        <svg className="w-10 h-10 text-white/25 mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h.008M3.75 9.75A.75.75 0 013 9V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5V9a.75.75 0 01-.75.75H3.75z" />
        </svg>
        <span className="text-white/25 text-[10px] font-medium uppercase tracking-widest">
          {album.photoCount} {t.galleryPage.photos}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 img-shimmer" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={album.title}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ objectPosition: album.coverPosition ?? 'center' }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}

// ── Album card ────────────────────────────────────────────────────────────

function AlbumCard({ album, featured = false, t, lang }: {
  album: GalleryAlbum;
  featured?: boolean;
  t: ReturnType<typeof useLanguage>['t'];
  lang: ReturnType<typeof useLanguage>['lang'];
}) {
  const tierColors: Record<string, string> = {
    T1: 'bg-consudes-gold text-white',
    T2: 'bg-consudes-blue-mid/90 text-white',
    T3: 'bg-gray-500/70 text-white',
  };

  return (
    <Link
      to={`/galeria/${album.slug}`}
      className={`group relative rounded-2xl overflow-hidden block bg-gray-100 dark:bg-white/5 shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
        featured ? 'col-span-full lg:col-span-2 row-span-2' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[4/3]'}`}>
        <AlbumCover
          album={album}
          className="group-hover:scale-105 transition-transform duration-500 ease-out"
          t={t}
        />
        {/* Gradient overlay always */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {album.tier === 'T1' && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tierColors.T1}`}>
              {t.galleryPage.featured}
            </span>
          )}
          <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
            {categoryLabel(album.category, t)}
          </span>
        </div>

        {/* Photo count top-right */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
            {album.photoCount} {t.galleryPage.photos}
          </span>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={`text-white leading-tight tracking-tight font-['Cormorant_Garamond'] ${featured ? 'text-xl sm:text-3xl font-bold' : 'text-base sm:text-xl font-semibold'}`}>
            {album.title}
          </h3>
          {(album.year || album.city || album.country) && (
            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
              {album.year && <span>{album.year}</span>}
              {(album.year && (album.city || album.country)) && <span>·</span>}
              {album.city ? `${album.city}, ${album.country}` : album.country}
            </p>
          )}
          {featured && getDescription(album, lang) && (
            <p className="text-white/60 text-sm mt-2 line-clamp-2 hidden sm:block">{getDescription(album, lang)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | null>(null);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersButtonRef = useRef<HTMLButtonElement>(null);

  useSEO({ title: t.nav.gallery, description: t.galleryPage.subtitle, url: '/galeria' });

  const availableYears = [...new Set(galleryAlbums.map((a) => a.year).filter(Boolean))].sort() as number[];
  const availableCountries = [...new Set(galleryAlbums.map((a) => a.country).filter(Boolean))].sort() as string[];

  const isFiltered = activeCategory !== null || activeYear !== null || activeCountry !== null;
  const activeCount = [activeCategory, activeYear, activeCountry].filter(Boolean).length;
  const gridAlbums = galleryAlbums.filter((a) => {
    if (activeCategory && a.category !== activeCategory) return false;
    if (activeYear && a.year !== activeYear) return false;
    if (activeCountry && a.country !== activeCountry) return false;
    return true;
  });

  return (
    <PageShell
      title={t.nav.gallery}
      subtitle={t.galleryPage.subtitle}
      breadcrumbs={[{ label: t.nav.gallery }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body pt-8 sm:pt-12">

        {/* ── Filtros ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MOBILE: Botão Filtros */}
          <div className="md:hidden flex justify-end mb-2">
            <button
              ref={filtersButtonRef}
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm text-sm font-semibold text-consudes-blue hover:bg-consudes-blue/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-consudes-gold/80 focus-visible:ring-offset-2 transition-all"
              aria-label={t.galleryPage.filters}
              aria-expanded={filtersOpen}
              aria-controls="gallery-mobile-filters"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M6 12h12M9 18h6" /></svg>
              {t.galleryPage.filters}
              {activeCount > 0 && <span className="ml-1 text-xs font-bold text-consudes-gold">({activeCount})</span>}
            </button>
          </div>
          {/* MOBILE: Painel expansível de filtros */}
          <div
            id="gallery-mobile-filters"
            className={`md:hidden overflow-hidden transition-all duration-300 ${filtersOpen ? 'max-h-[900px] opacity-100 mt-2 mb-3' : 'max-h-0 opacity-0 pointer-events-none'}`}
            aria-hidden={!filtersOpen}
          >
            <div className="flex flex-col gap-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm p-4">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.galleryPage.filterCategory}
                </span>
                <SegmentedToggleGroup
                  options={[
                    { value: null, label: t.galleryPage.allAlbums },
                    ...GALLERY_CATEGORIES.map((cat) => ({ value: cat, label: categoryLabel(cat, t) })),
                  ]}
                  value={activeCategory}
                  onChange={setActiveCategory}
                  ariaLabel={t.galleryPage.filterCategory}
                />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.galleryPage.filterYear}
                </span>
                <SegmentedToggleGroup
                  options={[
                    { value: null, label: t.galleryPage.allYears },
                    ...availableYears.map((year) => ({ value: year, label: year })),
                  ]}
                  value={activeYear}
                  onChange={setActiveYear}
                  ariaLabel={t.galleryPage.filterYear}
                />
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  {t.galleryPage.filterCountry}
                </span>
                <SegmentedToggleGroup
                  options={[
                    { value: null, label: t.galleryPage.allCountries },
                    ...availableCountries.map((country) => ({ value: country, label: country })),
                  ]}
                  value={activeCountry}
                  onChange={setActiveCountry}
                  ariaLabel={t.galleryPage.filterCountry}
                />
              </div>
              <div className="flex items-center mt-2 gap-2">
                {isFiltered && (
                  <button
                    type="button"
                    onClick={() => { setActiveCategory(null); setActiveYear(null); setActiveCountry(null); }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-consudes-blue bg-consudes-gold/10 hover:bg-consudes-gold/20 transition-all"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                    {t.galleryPage.clearFilters}
                  </button>
                )}
                <div className="flex-1" />
                {/* Botão Aplicar removido: filtragem é automática ao selecionar */}
              </div>
            </div>
          </div>
          {/* DESKTOP: Toolbar editorial */}
          <div className="hidden md:block bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl mb-3 md:mb-6 shadow-sm">
            <div className="flex flex-col gap-2 md:gap-3 px-2 py-2 md:px-4 md:py-3">
              {/* Categoria */}
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 md:text-[10px] md:font-bold md:tracking-[0.2em] md:shrink-0 md:w-[5.5rem]">
                  {t.galleryPage.filterCategory}
                </span>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeCategory === null} onClick={() => setActiveCategory(null)}>
                    {t.galleryPage.allAlbums}
                  </FilterPill>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <FilterPill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                      {categoryLabel(cat, t)}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {/* Ano */}
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 md:text-[10px] md:font-bold md:tracking-[0.2em] md:shrink-0 md:w-[5.5rem]">
                  {t.galleryPage.filterYear}
                </span>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeYear === null} onClick={() => setActiveYear(null)}>
                    {t.galleryPage.allYears}
                  </FilterPill>
                  {availableYears.map((year) => (
                    <FilterPill key={year} active={activeYear === year} onClick={() => setActiveYear(year)}>
                      {year}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {/* País */}
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <span className="text-[9px] font-medium tracking-[0.15em] uppercase text-slate-400 dark:text-slate-500 md:text-[10px] md:font-bold md:tracking-[0.2em] md:shrink-0 md:w-[5.5rem]">
                  {t.galleryPage.filterCountry}
                </span>
                <div className="flex flex-wrap gap-2 md:flex-1">
                  <FilterPill active={activeCountry === null} onClick={() => setActiveCountry(null)}>
                    {t.galleryPage.allCountries}
                  </FilterPill>
                  {availableCountries.map((country) => (
                    <FilterPill key={country} active={activeCountry === country} onClick={() => setActiveCountry(country)}>
                      {country}
                    </FilterPill>
                  ))}
                </div>
                {/* Count + Limpar: inline à direita do País — apenas desktop */}
                {isFiltered && (
                  <div className="hidden md:flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {gridAlbums.length} {gridAlbums.length === 1 ? t.galleryPage.albumSingular : t.galleryPage.albumPlural}
                    </span>
                    <span className="text-slate-300 dark:text-white/15" aria-hidden="true">•</span>
                    <button
                      onClick={() => { setActiveCategory(null); setActiveYear(null); setActiveCountry(null); }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#003B73] dark:text-blue-400 hover:underline transition-all whitespace-nowrap"
                    >
                      <X className="w-3 h-3" aria-hidden="true" />
                      {t.galleryPage.clearFilters}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Grid de álbuns ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
          {gridAlbums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {gridAlbums.map((album) => (
                <AlbumCard key={album.slug} album={album} t={t} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-consudes-gold/10 border border-consudes-gold/30 text-consudes-gold text-base font-semibold shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.462 2.063-2.92A17.944 17.944 0 0012 4a17.944 17.944 0 00-7.98 12.08c-.439 1.458.523 2.92 2.062 2.92z" /></svg>
                {t.galleryPage.noAlbumsFound}
              </div>
            </div>
          )}
        </div>

      </section>
    </PageShell>
  );
}
