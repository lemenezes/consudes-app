import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Languages } from 'lucide-react';
import { getPublishedNewsBySlug } from '../services/newsPublicService';
import { useLanguage } from '../context/LanguageContext';
import { translatePlain, translateHTML } from '../utils/translateContent';
import type { NewsRow } from '../lib/database.types';

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

  // ── Tradução automática ────────────────────────────────────────────────────
  const [displayTitle, setDisplayTitle] = useState('');
  const [displayContent, setDisplayContent] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  // Cache: chave "newsId:lang" → { title, content }
  const translationCache = useRef<Map<string, { title: string; content: string }>>(new Map());

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

  useEffect(() => {
    if (!news) return;

    // Espanhol: exibe original diretamente
    if (lang === 'es') {
      setDisplayTitle(news.title);
      setDisplayContent(news.content ?? '');
      setIsTranslating(false);
      return;
    }

    const cacheKey = `${news.id}:${lang}`;
    const cached = translationCache.current.get(cacheKey);
    if (cached) {
      setDisplayTitle(cached.title);
      setDisplayContent(cached.content);
      return;
    }

    // Exibe o original enquanto traduz
    setDisplayTitle(news.title);
    setDisplayContent(news.content ?? '');
    setIsTranslating(true);

    let cancelled = false;
    (async () => {
      const [title, content] = await Promise.all([
        translatePlain(news.title, lang),
        translateHTML(news.content ?? '', lang),
      ]);
      if (cancelled) return;
      translationCache.current.set(cacheKey, { title, content });
      setDisplayTitle(title);
      setDisplayContent(content);
      setIsTranslating(false);
    })();

    return () => { cancelled = true; };
  }, [news, lang]);

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
            {t.nav.news}
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto font-light">
            {t.newsDetail.heroSubtitle}
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[#1F2937]/30 dark:text-white/20 text-[11px] mb-8 flex-wrap" aria-label="Navegación">
          <Link to="/" className="hover:text-[#0057A8] dark:hover:text-white/60 transition-colors">{t.newsDetail.home}</Link>
          <span>/</span>
          <Link to="/noticias" className="hover:text-[#0057A8] dark:hover:text-white/60 transition-colors">{t.nav.news}</Link>
          <span>/</span>
          <span className="text-[#1F2937]/50 dark:text-white/40 truncate max-w-[200px]">{news.title}</span>
        </nav>

        {/* ── Bloco editorial: título + meta + imagem ── */}
        <header className="mb-10">
          {/* Título */}
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#1F2937] dark:text-white leading-[1.12] tracking-tight mb-5">
            {displayTitle || news.title}
          </h2>

          {/* Meta: data + banner de tradução */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {news.published_at && (
              <div className="flex items-center gap-1.5 text-[#0057A8] dark:text-[#7ab8f0] text-xs font-medium">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <time dateTime={news.published_at}>
                  {formatDate(news.published_at, lang)}
                </time>
              </div>
            )}
            {lang !== 'es' && (
              <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                isTranslating
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-[#0057A8]/5 dark:bg-[#0057A8]/10 text-[#0057A8]/60 dark:text-[#7ab8f0]/50 border-[#0057A8]/10 dark:border-[#7ab8f0]/10'
              }`}>
                <Languages className={`w-3 h-3 shrink-0 ${isTranslating ? 'animate-pulse' : ''}`} />
                {isTranslating
                  ? (lang === 'pt' ? 'Traduzindo…' : 'Translating…')
                  : (lang === 'pt' ? 'Tradução automática' : 'Auto-translated')
                }
              </div>
            )}
          </div>

          {/* Imagem de capa — parte do cabeçalho editorial */}
          {news.cover_url && (
            <figure className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/5">
              <img
                src={news.cover_url}
                alt={displayTitle || news.title}
                className="w-full object-cover max-h-[500px]"
              />
            </figure>
          )}
        </header>

        {/* Linha divisória sutil antes do conteúdo */}
        <div className="w-12 h-0.5 bg-[#D9A441]/50 mb-10" />

        {/* ── Conteúdo da matéria ── */}
        {displayContent ? (
          <div className="
            [&_p]:text-[#374151] dark:[&_p]:text-slate-300
              [&_p]:text-[1.0625rem] [&_p]:leading-[1.9] [&_p]:mb-5 [&_p]:last:mb-0
            [&_p.para-small]:text-[0.875rem] [&_p.para-small]:text-[#6B7280] dark:[&_p.para-small]:text-slate-400 [&_p.para-small]:leading-[1.7]
            [&_p.para-lead]:text-[1.2rem] [&_p.para-lead]:font-medium [&_p.para-lead]:leading-[1.8] [&_p.para-lead]:text-[#1F2937] dark:[&_p.para-lead]:text-slate-100
            [&_h2]:font-['Cormorant_Garamond'] [&_h2]:font-semibold
              [&_h2]:text-[1.65rem] sm:[&_h2]:text-[1.85rem] [&_h2]:leading-tight
              [&_h2]:text-[#1F2937] dark:[&_h2]:text-white
              [&_h2]:mt-9 [&_h2]:mb-4
              [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-[#0057A8]/15 dark:[&_h2]:border-white/10
            [&_h3]:font-['Cormorant_Garamond'] [&_h3]:font-semibold
              [&_h3]:text-[1.3rem] sm:[&_h3]:text-[1.45rem] [&_h3]:leading-snug
              [&_h3]:text-[#1F2937] dark:[&_h3]:text-white
              [&_h3]:mt-7 [&_h3]:mb-3
            [&_strong]:font-bold [&_strong]:text-[#1F2937] dark:[&_strong]:text-white
            [&_em]:italic [&_em]:text-[#374151]/80 dark:[&_em]:text-slate-400
            [&_a]:text-[#0057A8] dark:[&_a]:text-[#7ab8f0]
              [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2
              [&_a]:decoration-[#0057A8]/30 dark:[&_a]:decoration-[#7ab8f0]/30
              hover:[&_a]:decoration-[#0057A8] dark:hover:[&_a]:decoration-[#7ab8f0]
              [&_a]:transition-colors
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
            [&_li]:text-[#374151] dark:[&_li]:text-slate-300
              [&_li]:text-[1.0625rem] [&_li]:leading-[1.75]
            [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:my-6 [&_img]:w-full
          ">
            <div dangerouslySetInnerHTML={{ __html: displayContent }} />
          </div>
        ) : (
          <p className="text-[#1F2937]/40 dark:text-white/30 text-sm italic">
            {t.newsDetail.noContent}
          </p>
        )}

        {/* ── Rodapé da matéria ── */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-4">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-[#0057A8] dark:text-[#7ab8f0] text-sm font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.newsDetail.backLink}
          </Link>
          <div className="flex items-center gap-2 text-[#1F2937]/20 dark:text-white/10 text-xs">
            <span className="w-6 h-px bg-[#D9A441]/50" />
            CONSUDES
            <span className="w-6 h-px bg-[#D9A441]/50" />
          </div>
        </div>

      </div>
    </article>
  );
}
