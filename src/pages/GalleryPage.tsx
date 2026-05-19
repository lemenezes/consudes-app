import { useState } from 'react';
import { Link } from 'react-router-dom';
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

// ── Album cover ───────────────────────────────────────────────────────────

function AlbumCover({ album, className = '', t }: { album: GalleryAlbum; className?: string; t: ReturnType<typeof useLanguage>['t'] }) {
  const [failed, setFailed] = useState(false);
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
    <img
      src={src}
      alt={album.title}
      className={`w-full h-full object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
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
      className={`group relative rounded-2xl overflow-hidden block bg-gray-100 dark:bg-white/5 shadow-card hover:shadow-raise transition-shadow duration-300 ${
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

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
          <h3 className={`font-bold text-white leading-tight ${featured ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>
            {album.title}
          </h3>
          {(album.year || album.city || album.country) && (
            <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
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

  useSEO({ title: t.nav.gallery, description: t.galleryPage.subtitle, url: '/galeria' });

  const featured = galleryAlbums.find((a) => a.featured);
  const filtered = activeCategory
    ? galleryAlbums.filter((a) => a.category === activeCategory)
    : galleryAlbums;
  const gridAlbums = filtered.filter((a) => !a.featured || activeCategory !== null);

  return (
    <PageShell
      title={t.nav.gallery}
      subtitle={t.galleryPage.subtitle}
      breadcrumbs={[{ label: t.nav.gallery }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Category filter ── */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-consudes-blue text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-consudes-blue-text dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15'
              }`}
            >
              {t.galleryPage.allAlbums}
            </button>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-consudes-blue text-white'
                    : 'bg-gray-100 dark:bg-white/10 text-consudes-blue-text dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15'
                }`}
              >
                {categoryLabel(cat, t)}
              </button>
            ))}
          </div>

          {/* ── Featured album (only when no filter active) ── */}
          {!activeCategory && featured && (
            <div className="mb-6">
              <AlbumCard album={featured} featured t={t} lang={lang} />
            </div>
          )}

          {/* ── Albums grid ── */}
          {gridAlbums.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gridAlbums.map((album) => (
                <AlbumCard key={album.slug} album={album} t={t} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-consudes-blue-text/40 dark:text-white/30 text-sm">
                {t.common.contentUnderConstruction}
              </p>
            </div>
          )}

        </div>
      </section>
    </PageShell>
  );
}
