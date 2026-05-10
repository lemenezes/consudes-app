import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Globe } from 'lucide-react';
import { getPublishedNewsBySlug } from '../services/newsPublicService';
import { useLanguage } from '../context/LanguageContext';
import type { NewsRow } from '../lib/database.types';

const LANG_LABEL: Record<string, string> = {
  es: 'Español',
  pt: 'Português',
  en: 'English',
};

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '';
  const s = new Date(iso).toLocaleDateString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function NewsDetailPage() {
  const { t, lang } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    getPublishedNewsBySlug(slug).then(({ data, error: err }) => {
      if (err || !data) {
        setError(err ?? 'Noticia no encontrada');
      } else {
        setNews(data);
        document.title = `${data.title} — CONSUDES`;
      }
      setLoading(false);
    });

    return () => { document.title = 'CONSUDES'; };
  }, [slug]);

  // ── Carregando ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0d1624]">
        {/* Hero igual ao PageHero */}
        <div className="relative bg-[#003B73] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#002d5a] via-[#0057A8] to-[#0076C8] opacity-80" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-15 sm:py-16 text-center space-y-3">
            <div className="h-3 bg-white/10 rounded w-20 mx-auto animate-pulse" />
            <div className="h-10 bg-white/10 rounded w-40 mx-auto animate-pulse" />
            <div className="h-3 bg-white/10 rounded w-56 mx-auto animate-pulse" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
            <svg viewBox="0 0 1440 40" className="w-full text-[#F5F7FA] dark:text-[#0d1624]" preserveAspectRatio="none">
              <path fill="currentColor" d="M0,40 C480,0 960,40 1440,0 L1440,40 Z" />
            </svg>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
          <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded w-48 animate-pulse" />
          <div className="h-2.5 bg-gray-200 dark:bg-white/10 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full animate-pulse" />
          <div className="h-56 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse mt-4" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full animate-pulse mt-2" />
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Erro / não encontrada ──────────────────────────────────────────────────
  if (error || !news) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0d1624] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <svg className="w-14 h-14 text-gray-200 dark:text-white/10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
        <p className="text-[#1F2937]/50 dark:text-white/40 text-sm">
          {t.newsDetail.notFound}
        </p>
        <button
          onClick={() => navigate('/noticias')}
          className="inline-flex items-center gap-2 text-[#0057A8] dark:text-[#7ab8f0] text-sm font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.newsDetail.backLink}
        </button>
      </div>
    );
  }

  // ── Conteúdo ──────────────────────────────────────────────────────────────
  return (
    <article className="min-h-screen bg-[#F5F7FA] dark:bg-[#0d1624]">

      {/* ── Hero institucional da seção (igual PageHero) ───────────────────── */}
      <section className="relative bg-[#003B73] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#002d5a] via-[#0057A8] to-[#0076C8] opacity-80" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0076C8]/20 rounded-full blur-3xl" />
        </div>
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#D9A441]/60 via-[#D9A441]/20 to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-4">
            Noticias
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto font-light">
            Comunicados, eventos y novedades oficiales de la CONSUDES
          </p>
        </div>

        {/* Onda na base — igual às outras páginas */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 40" className="w-full text-[#F5F7FA] dark:text-[#0d1624]" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,40 C480,0 960,40 1440,0 L1440,40 Z" />
          </svg>
        </div>
      </section>

      {/* ── Corpo da matéria ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-14 sm:pb-20">

        {/* 1. Breadcrumb */}
        <nav className="flex items-center gap-1 text-[#1F2937]/35 dark:text-white/25 text-[11px] mb-5 flex-wrap" aria-label="Navegación">
          <Link to="/" className="hover:text-[#0057A8] dark:hover:text-white/70 transition-colors">{t.newsDetail.home}</Link>
          <span>/</span>
          <Link to="/noticias" className="hover:text-[#0057A8] dark:hover:text-white/70 transition-colors">{t.nav.news}</Link>
          <span>/</span>
          <span className="text-[#1F2937]/60 dark:text-white/50 truncate max-w-[200px]">{news.title}</span>
        </nav>

        {/* 2. Data + idioma */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {news.published_at && (
            <div className="flex items-center gap-1.5 text-[#0057A8] dark:text-[#7ab8f0] text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <time dateTime={news.published_at}>
                {formatDate(news.published_at, lang)}
              </time>
            </div>
          )}
          {news.lang && news.lang !== 'es' && (
            <div className="flex items-center gap-1 text-[#1F2937]/40 dark:text-white/30 text-xs">
              <Globe className="w-3.5 h-3.5 shrink-0" />
              {LANG_LABEL[news.lang] ?? news.lang}
            </div>
          )}
        </div>

        {/* 3. Título da notícia */}
        <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-[#1F2937] dark:text-white leading-[1.15] tracking-tight mb-4">
          {news.title}
        </h2>

        {/* 5. Imagem de capa — uma única vez */}
        {news.cover_url && (
          <figure className="rounded-xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/5 mt-6 mb-8">
            <img
              src={news.cover_url}
              alt={news.title}
              className="w-full object-cover max-h-[480px]"
            />
          </figure>
        )}
        {/* 6. Conteúdo */}
        {news.content ? (
          <div
            className="
              prose prose-slate dark:prose-invert max-w-none
              prose-headings:font-['Cormorant_Garamond'] prose-headings:font-semibold
              prose-h2:text-2xl prose-h3:text-xl
              prose-a:text-[#0057A8] dark:prose-a:text-[#7ab8f0] prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-sm
              prose-p:text-[#1F2937]/80 dark:prose-p:text-slate-300 prose-p:leading-relaxed
              prose-li:text-[#1F2937]/80 dark:prose-li:text-slate-300
              text-base
            "
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        ) : (
          <p className="text-[#1F2937]/40 dark:text-white/30 text-sm italic">
            {t.newsDetail.noContent}
          </p>
        )}

        {/* Rodapé */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-[#0057A8] dark:text-[#7ab8f0] text-sm font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.newsDetail.backLink}
          </Link>
          <div className="flex items-center gap-2 text-[#1F2937]/25 dark:text-white/15 text-xs">
            <span className="w-5 h-px bg-[#D9A441]/40" />
            CONSUDES
            <span className="w-5 h-px bg-[#D9A441]/40" />
          </div>
        </div>

      </div>
    </article>
  );
}
