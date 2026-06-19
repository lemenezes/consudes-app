import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { useLanguage } from "../context/LanguageContext";
import PageShell from "../components/PageShell";
import { useSEO } from "../hooks/useSEO";
import {
  getPhotoUrl,
  getDescription,
  type GalleryAlbum
} from "../data/galleryData";
import { getGalleryBySlug } from "../services/galleryService";

// ── helpers ───────────────────────────────────────────────────────────────

function AlbumHero({
  album,
  t
}: {
  album: GalleryAlbum;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = album.coverFile ? getPhotoUrl(album.slug, album.coverFile) : "";

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-consudes-navy">
      {src && !failed ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 img-shimmer" aria-hidden="true" />
          )}
          <img
            src={src}
            alt={album.title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: album.coverPosition ?? "center" }}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-consudes-blue/30 to-consudes-navy/60" />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Text on image */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
          CONSUDES · {t.nav.gallery}
        </p>
        <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
          {album.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-white/70">
          {album.year && <span>{album.year}</span>}
          {album.year && (album.city || album.country) && (
            <span aria-hidden="true">·</span>
          )}
          {album.city ? (
            <span>
              {album.city}, {album.country}
            </span>
          ) : album.country ? (
            <span>{album.country}</span>
          ) : null}
          <span aria-hidden="true">·</span>
          <span>
            {album.photoCount} {t.galleryPage.photos}
          </span>
        </div>
      </div>
    </div>
  );
}

function PhotoThumb({
  album,
  filename,
  index,
  onOpen,
  t
}: {
  album: GalleryAlbum;
  filename: string;
  index: number;
  onOpen: (i: number) => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const src = getPhotoUrl(album.slug, filename);

  return (
    <button
      onClick={() => onOpen(index)}
      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-consudes-blue-mid"
      aria-label={`${t.galleryPage.openPhoto} ${index + 1}`}>
      {!failed ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 img-shimmer" aria-hidden="true" />
          )}
          <img
            src={src}
            alt={filename}
            loading="lazy"
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-consudes-blue/10 to-consudes-navy/20">
          <svg
            className="w-6 h-6 text-white/20"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909"
            />
          </svg>
        </div>
      )}
      {/* hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803M10.5 7.5v6m3-3h-6"
          />
        </svg>
      </div>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function GalleryAlbumPage() {
  const { "*": rawSlug } = useParams();
  const { t, lang } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadAlbum = async () => {
      setLoading(true);
      const { data } = await getGalleryBySlug(rawSlug || "");
      if (active) {
        setAlbum(data || null);
        setLoading(false);
      }
    };

    loadAlbum();

    return () => {
      active = false;
    };
  }, [rawSlug]);

  useSEO({
    title: album
      ? `${album.title} · ${t.nav.gallery}`
      : t.galleryPage.albumNotFound,
    description: album ? getDescription(album, lang) : "",
    url: `/galeria/${rawSlug}`
  });

  // ── Not found ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageShell
        title=""
        breadcrumbs={[{ label: t.nav.gallery, href: "/galeria" }]}>
        <section className="bg-slate-50 dark:bg-consudes-dark-body py-20">
          <div className="max-w-lg mx-auto px-4">
            <div className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
          </div>
        </section>
      </PageShell>
    );
  }

  if (!album) {
    return (
      <PageShell
        title={t.galleryPage.albumNotFound}
        breadcrumbs={[
          { label: t.nav.gallery, href: "/galeria" },
          { label: "404" }
        ]}>
        <section className="bg-slate-50 dark:bg-consudes-dark-body py-20">
          <div className="max-w-lg mx-auto px-4 text-center">
            <p className="text-consudes-blue-text/50 dark:text-white/40 text-base mb-6">
              {t.galleryPage.albumNotFound}
            </p>
            <Link
              to="/galeria"
              className="inline-flex items-center gap-2 text-consudes-blue-mid hover:text-consudes-gold transition-colors text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              {t.galleryPage.backToGallery}
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const slides = album.photos.map(p => ({
    src: getPhotoUrl(album.slug, p.filename)
  }));

  const handleOpen = (index: number) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <PageShell
      title=""
      breadcrumbs={[
        { label: t.nav.gallery, href: "/galeria" },
        { label: album.title }
      ]}>
      <section className="bg-slate-50 dark:bg-consudes-dark-body pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Hero ── */}
          <div className="pt-8">
            <AlbumHero album={album} t={t} />
          </div>

          {/* ── Description ── */}
          {getDescription(album, lang) && (
            <p className="mt-6 text-consudes-body dark:text-white/70 text-base max-w-2xl">
              {getDescription(album, lang)}
            </p>
          )}

          {/* ── Back link ── */}
          <div className="mt-6 mb-8">
            <Link
              to="/galeria"
              className="inline-flex items-center gap-2 text-consudes-blue-mid dark:text-consudes-gold hover:underline text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              {t.galleryPage.backToGallery}
            </Link>
          </div>

          {/* ── Photos grid ── */}
          {album.photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              {album.photos.map((photo, i) => (
                <PhotoThumb
                  key={`${photo.filename}-${i}`}
                  album={album}
                  filename={photo.filename}
                  index={i}
                  onOpen={handleOpen}
                  t={t}
                />
              ))}
            </div>
          ) : (
            /* ── Coming soon state ── */
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 py-20 text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 dark:text-white/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.2}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h.008M3.75 9.75A.75.75 0 013 9V7.5A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5V9a.75.75 0 01-.75.75H3.75z"
                />
              </svg>
              <p className="text-consudes-blue-text/50 dark:text-white/40 text-sm">
                {t.galleryPage.albumPhotosComingSoon}
              </p>
              <p className="text-consudes-blue-text/30 dark:text-white/25 text-xs mt-1">
                {album.photoCount} {t.galleryPage.photos} · {album.title}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={photoIndex}
        slides={slides}
        plugins={[Zoom, Counter, Fullscreen]}
        zoom={{
          maxZoomPixelRatio: 4,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true
        }}
        carousel={{ preload: 2 }}
        animation={{ fade: 200, swipe: 250 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.97)"
          },
          slide: {
            padding: "0 56px"
          }
        }}
      />
    </PageShell>
  );
}
