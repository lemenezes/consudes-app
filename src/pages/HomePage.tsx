import { ArrowRight, Users, BookOpen, HeartHandshake, Globe, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePublicNews } from '../hooks/usePublicNews';
import { useSEO } from '../hooks/useSEO';
import NewsCard from '../components/NewsCard';

const STAT_VALUES = ['60+', '20', '15', '100k+'];

const PROGRAM_ICONS = [
  <Users className="w-6 h-6" />,
  <BookOpen className="w-6 h-6" />,
  <HeartHandshake className="w-6 h-6" />,
  <Globe className="w-6 h-6" />,
];

export default function HomePage() {
  const { t } = useLanguage();
  const { news, loading: newsLoading } = usePublicNews({ limit: 3 });

  useSEO({
    url: '/',
    description: 'Confederación Sudamericana Deportiva de Sordos (CONSUDES). Organización oficial que representa y conecta a las federaciones deportivas de sordos en Sudamérica.',
  });

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#003B73] overflow-hidden">
        {/* Camadas de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Gradiente principal */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#002d5a] via-[#0057A8] to-[#0076C8] opacity-80" />
          {/* Blob central topo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-[#0076C8]/25 rounded-full blur-3xl" />
          {/* Blob inferior direito */}
          <div className="absolute bottom-0 right-0 w-[480px] h-[280px] bg-[#002d5a]/50 rounded-full blur-3xl" />
          {/* Blob esquerdo suave */}
          <div className="absolute top-1/3 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>
        {/* Acento dourado vertical direito */}
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#D9A441]/60 via-[#D9A441]/20 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">

          {/* Assinatura institucional */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="hidden sm:block w-8 h-px bg-[#D9A441]/50 shrink-0" />
            <p className="font-['Cormorant_Garamond'] text-white/95 text-sm sm:text-xl lg:text-2xl font-light tracking-[0.08em] uppercase italic text-center" aria-hidden="true">
              {t.hero.fullName.split('Deportiva').length === 2 ? (
                <>
                  {t.hero.fullName.split('Deportiva')[0]}
                  <span className="sm:hidden"><br /></span>
                  {'Deportiva'}
                  {t.hero.fullName.split('Deportiva')[1]}
                </>
              ) : t.hero.fullName}
            </p>
            <span className="hidden sm:block w-8 h-px bg-[#D9A441]/50 shrink-0" />
          </div>

          {/* Headline */}
          <h1 data-testid="hero-title" className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
            {t.hero.headline1}<br/>
            <span className="text-[#7FD6E8] italic">{t.hero.headline2}</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto font-light tracking-wide">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 bg-white text-[#0057A8] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#f0f8ff] transition-colors shadow-lg text-sm sm:text-base"
            >
              {t.hero.cta1}
              <ArrowRight size={16} />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-14"
            aria-label={t.stats.map((s, i) => `${STAT_VALUES[i]} ${s.label}`).join(', ')}
          >
            {t.stats.map(({ label }, i) => (
              <div key={i} className="text-center" aria-hidden="true">
                <span className="block text-2xl sm:text-3xl font-bold text-white tabular-nums">{STAT_VALUES[i]}</span>
                <span className="block text-white/70 text-xs mt-0.5 tracking-wider uppercase">{label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 56" className="w-full text-[#F5F7FA] dark:text-[#0d1624]" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,56 C360,0 720,56 1080,28 C1260,14 1380,0 1440,0 L1440,56 Z" />
          </svg>
        </div>
      </section>

      {/* ─── Sobre ────────────────────────────────────────────────────────── */}
      <section id="sobre" className="bg-[#F5F7FA] dark:bg-[#0d1624] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0057A8] dark:text-[#7ab8f0] text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-5 h-0.5 bg-[#D9A441] inline-block" />
              {t.about.label}
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1F2937] dark:text-white mb-6 leading-tight">
              {t.about.title}
            </h2>
            <p className="text-[#1F2937]/70 dark:text-slate-400 text-base leading-relaxed mb-4">
              {t.about.p1}
            </p>
            <p className="text-[#1F2937]/70 dark:text-slate-400 text-base leading-relaxed mb-8">
              {t.about.p2}
            </p>
            <a
              href="#programas"
              className="inline-flex items-center gap-2 text-[#0057A8] dark:text-[#7ab8f0] font-bold text-sm hover:text-[#003B73] dark:hover:text-white transition-colors hover:underline"
            >
              {t.about.link}
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Stats grid */}
          <div
            className="grid grid-cols-2 gap-4"
            aria-label={t.stats.map((s, i) => `${STAT_VALUES[i]} ${s.label}`).join(', ')}
          >
            {t.stats.map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="bg-white dark:bg-[#0d1624] border-l-4 border-[#0057A8] dark:border-[#0057A8] rounded-r-lg p-6"
              >
                <span className="block text-3xl font-extrabold text-[#003B73] dark:text-white tabular-nums">{STAT_VALUES[i]}</span>
                <span className="block text-[#1F2937]/65 dark:text-slate-400 text-xs mt-1 leading-tight tracking-wide">{t.stats[i].label}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ─── Programas ────────────────────────────────────────────────────── */}
      <section id="programas" className="bg-[#003B73] dark:bg-[#001f42] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px bg-[#D9A441]" />
              <span className="text-[#D9A441] text-xs font-bold tracking-widest uppercase">{t.programs.label}</span>
              <span className="w-8 h-px bg-[#D9A441]" />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-white mb-3">
              {t.programs.title}
            </h2>
            <p className="text-white/65 text-sm max-w-md mx-auto">
              {t.programs.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.programs.items.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/15 rounded-lg p-6 hover:bg-white/15 hover:border-[#D9A441]/50 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#D9A441]/20 text-[#D9A441] flex items-center justify-center mb-4 group-hover:bg-[#D9A441] group-hover:text-[#003B73] transition-colors duration-200">
                  {PROGRAM_ICONS[i]}
                </div>
                <h3 className="font-bold text-white text-sm mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-white/55 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Notícias ─────────────────────────────────────────────────── */}
      <section id="noticias" className="bg-[#F5F7FA] dark:bg-[#0d1624] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="w-8 h-px bg-[#D9A441]" />
              <span className="text-[#0057A8] dark:text-[#7ab8f0] text-xs font-bold tracking-widest uppercase">{t.news.label}</span>
              <span className="w-8 h-px bg-[#D9A441]" />
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-[#1F2937] dark:text-white mb-3">
              {t.news.title}
            </h2>
            <p className="text-[#1F2937]/65 dark:text-slate-500 text-sm">
              {t.news.subtitle}
            </p>
          </div>

          {/* Skeletons durante carregamento */}
          {newsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-[#0a1e35] rounded-xl overflow-hidden border border-[#0057A8]/10 dark:border-[#0057A8]/20 shadow-sm animate-pulse">
                  <div className="h-40 bg-[#EAF3FB] dark:bg-[#0d2a47]" />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 bg-[#EAF3FB] dark:bg-[#0d2a47] rounded w-1/3" />
                    <div className="h-4 bg-[#EAF3FB] dark:bg-[#0d2a47] rounded w-full" />
                    <div className="h-3 bg-[#EAF3FB] dark:bg-[#0d2a47] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lista de notícias reais */}
          {!newsLoading && news.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} compact />
              ))}
            </div>
          )}

          {/* Estado vazio */}
          {!newsLoading && news.length === 0 && (
            <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm py-8">
              {t.news.emptyState}
            </p>
          )}

          {/* Ver todas */}
          {!newsLoading && news.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/noticias"
                className="inline-flex items-center gap-2 border border-[#0057A8]/30 text-[#0057A8] dark:text-[#7ab8f0] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#0057A8]/5 transition-colors text-sm"
              >
                {t.news.viewAll}
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── Contato ──────────────────────────────────────────────────────── */}
      <section id="contato" className="bg-[#0057A8] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-1 bg-[#D9A441] mx-auto mb-8 rounded" />
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-white mb-4">
            {t.contact.title}
          </h2>
          <p className="text-white/70 mb-10 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {t.contact.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:contato@consudes.org.br"
              className="inline-flex items-center gap-2 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-7 py-3 rounded text-sm transition-colors"
            >
              <Mail size={16} />
              contato@consudes.org.br
            </a>
            <a
              href="tel:+551100000000"
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold px-7 py-3 rounded transition-colors text-sm"
            >
              <Phone size={16} />
              (11) 0000-0000
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
