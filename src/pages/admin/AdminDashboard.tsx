import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { listNews } from '../../services/newsService';
import type { NewsRow } from '../../lib/database.types';

const COMING_SOON = [
  {
    label: 'Galeria',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    label: 'Relatórios',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: 'Federações',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [news, setNews] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listNews().then(({ data }) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  const total = news.length;
  const published = news.filter((n) => n.status === 'published').length;
  const latest = news[0];

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          {t.admin.panelTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo,{' '}
          <span className="font-medium text-[#0057A8]">{user?.email}</span>
        </p>
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">

        {/* ── Card Notícias — ATIVO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[#0057A8]/20 ring-1 ring-[#0057A8]/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#1F2937]">
                {t.admin.nav.news}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {t.admin.dashboard.active}
              </span>
            </div>

            {/* Número — sans-serif para evitar "1" parecer "I" */}
            {loading ? (
              <div className="h-9 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold font-sans text-[#1F2937] leading-none tabular-nums">
                {total}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {loading
                ? '…'
                : published === total
                ? `${total} ${total !== 1 ? t.admin.dashboard.publishedPlural : t.admin.dashboard.published}`
                : `${published} ${published !== 1 ? t.admin.dashboard.publishedPlural : t.admin.dashboard.published} · ${total} ${t.admin.dashboard.total}`
              }
            </p>

            {!loading && latest && (
              <p className="text-xs text-gray-400 mt-4 line-clamp-1 border-t border-gray-100 pt-3">
                {t.admin.dashboard.latest}: <span className="text-gray-600">{latest.title}</span>
              </p>
            )}
          </div>

          <div className="px-6 pb-5">
            <Link
              to="/admin/noticias"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0057A8] text-white text-xs font-semibold hover:bg-[#004a8f] transition-colors"
            >
              {t.admin.dashboard.manage}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Cards Em desenvolvimento ── */}
        {COMING_SOON.map((mod) => (
          <div
            key={mod.label}
            className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">{mod.label}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                {t.admin.dashboard.comingSoon}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-4 text-gray-300">
              {mod.icon}
              <p className="text-xs text-gray-400 mt-3 text-center leading-relaxed">
                {t.admin.dashboard.inDevelopment}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-1">{t.admin.dashboard.upcomingModules}</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t.admin.dashboard.upcomingDesc}
        </p>
      </div>
    </div>
  );
}
