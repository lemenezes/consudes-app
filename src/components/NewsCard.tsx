import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { NewsListItem } from '../services/newsPublicService';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface NewsCardProps {
  news: NewsListItem;
  /** Layout compacto para a home; layout completo para a listagem */
  compact?: boolean;
}

export default function NewsCard({ news, compact = false }: NewsCardProps) {
  const { t } = useLanguage();
  const { title, slug, cover_url, published_at, content } = news;

  return (
    <Link
      to={`/noticias/${slug}`}
      className={`
        group flex flex-col bg-white dark:bg-[#0a1e35] rounded-xl overflow-hidden
        border border-[#0057A8]/10 dark:border-[#0057A8]/20
        shadow-sm hover:shadow-md transition-shadow duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057A8]
      `}
    >
      {/* Capa */}
      <div className={`relative overflow-hidden bg-[#EAF3FB] dark:bg-[#0d2a47] shrink-0 ${compact ? 'h-40' : 'h-48'}`}>
        {cover_url ? (
          <img
            src={cover_url}
            alt={title}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Placeholder sem imagem */
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#0057A8]/20 dark:text-white/10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
        {/* Faixa dourada bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D9A441]/0 via-[#D9A441]/60 to-[#D9A441]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Corpo */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        {/* Data */}
        {published_at && (
          <div className="flex items-center gap-1.5 text-[#0057A8]/80 dark:text-white/50 text-xs">
            <Calendar className="w-3 h-3 shrink-0" />
            <time dateTime={published_at}>{formatDate(published_at)}</time>
          </div>
        )}

        {/* Título */}
        <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937] dark:text-white leading-snug group-hover:text-[#0057A8] dark:group-hover:text-[#7ab8f0] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Conteúdo truncado — texto puro, sem HTML */}
        {content && (
          <p className="text-[#1F2937]/70 dark:text-slate-400 text-sm leading-relaxed line-clamp-4 flex-1">
            {content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
          </p>
        )}

        {/* Leer más */}
        <div className="flex items-center gap-1 text-[#0057A8] dark:text-[#7ab8f0] text-xs font-semibold mt-1 group-hover:gap-2 transition-all">
          <span>{t.newsDetail.readMore}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
