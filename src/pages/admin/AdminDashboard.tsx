import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { listNews } from "../../services/newsService";
import { listCalendarEvents } from "../../services/calendarService";
import { listReports } from "../../services/reportsService";
import { listFederations } from "../../services/federationsService";
import { listGalleries } from "../../services/galleryService";
import type {
  NewsRow,
  CalendarEventRow,
  ReportRow,
  FederationRow
} from "../../lib/database.types";
import type { GalleryAlbum } from "../../data/galleryData";

const COMING_SOON: any[] = [];

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [news, setNews] = useState<NewsRow[]>([]);
  const [calEvents, setCalEvents] = useState<CalendarEventRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [federations, setFederations] = useState<FederationRow[]>([]);
  const [galleries, setGalleries] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      listNews(),
      listCalendarEvents(),
      listReports(),
      listFederations(),
      listGalleries()
    ]).then(
      ([{ data: n }, { data: c }, { data: r }, { data: f }, { data: g }]) => {
        setNews(n);
        setCalEvents(c);
        setReports(r);
        setFederations(f);
        setGalleries(g || []);
        setLoading(false);
      }
    );
  }, []);

  const total = news.length;
  const published = news.filter(n => n.status === "published").length;
  const latest = news[0];

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
          {t.admin.panelTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo,{" "}
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {profile?.display_name || ""}
          </span>
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
                ? "…"
                : published === total
                  ? `${total} ${total !== 1 ? t.admin.dashboard.publishedPlural : t.admin.dashboard.published}`
                  : `${published} ${published !== 1 ? t.admin.dashboard.publishedPlural : t.admin.dashboard.published} · ${total} ${t.admin.dashboard.total}`}
            </p>

            {!loading && latest && (
              <p className="text-xs text-gray-400 mt-4 line-clamp-1 border-t border-gray-100 pt-3">
                {t.admin.dashboard.latest}:{" "}
                <span className="text-gray-600">{latest.title}</span>
              </p>
            )}
          </div>

          <div className="px-6 pb-5">
            <Link
              to="/admin/noticias"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0057A8] text-white text-xs font-semibold hover:bg-[#004a8f] transition-colors">
              {t.admin.dashboard.manage}
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Card Calendário — ATIVO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9A441]/20 ring-1 ring-[#D9A441]/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#1F2937]">
                {t.admin.nav.calendar}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {t.admin.dashboard.active}
              </span>
            </div>
            {loading ? (
              <div className="h-9 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold font-sans text-[#1F2937] leading-none tabular-nums">
                {calEvents.length}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {loading
                ? "…"
                : `${calEvents.filter(e => e.status === "published").length} publicados · ${calEvents.length} total`}
            </p>
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/admin/calendario"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-xs font-semibold hover:bg-[#002d5a] transition-colors">
              {t.admin.dashboard.manageCalendar}
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Card Transparência — ATIVO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[#003B73]/20 ring-1 ring-[#003B73]/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#1F2937]">
                Transparência
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {t.admin.dashboard.active}
              </span>
            </div>
            {loading ? (
              <div className="h-9 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold font-sans text-[#1F2937] leading-none tabular-nums">
                {reports.length}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {loading
                ? "…"
                : `${reports.filter(r => r.status === "published").length} publicados · ${reports.length} total`}
            </p>
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/admin/transparencia"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-xs font-semibold hover:bg-[#002d5a] transition-colors">
              Gerenciar
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Card Federações — ATIVO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[#D9A441]/20 ring-1 ring-[#D9A441]/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#1F2937]">
                Federações
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {t.admin.dashboard.active}
              </span>
            </div>
            {loading ? (
              <div className="h-9 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold font-sans text-[#1F2937] leading-none tabular-nums">
                {federations.length}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {loading
                ? "…"
                : `${federations.length} filiada${federations.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/admin/federacoes"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-xs font-semibold hover:bg-[#002d5a] transition-colors">
              Gerenciar
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Card Galeria — ATIVO ── */}
        <div className="bg-white rounded-xl shadow-sm border border-[#003B73]/20 ring-1 ring-[#003B73]/10 flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-semibold text-[#1F2937]">
                Galeria
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                {t.admin.dashboard.active}
              </span>
            </div>
            {loading ? (
              <div className="h-9 w-10 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-4xl font-bold font-sans text-[#1F2937] leading-none tabular-nums">
                {galleries.length}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1.5">
              {loading
                ? "…"
                : `${galleries.length} álbum${galleries.length !== 1 ? "ns" : ""}`}
            </p>
          </div>
          <div className="px-6 pb-5">
            <Link
              to="/admin/galeria"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-xs font-semibold hover:bg-[#002d5a] transition-colors">
              Gerenciar
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Cards Em desenvolvimento ── */}
        {COMING_SOON.map(mod => (
          <div
            key={mod.label}
            className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                {mod.label}
              </span>
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
        <h2 className="text-sm font-semibold text-gray-500 mb-1">
          {t.admin.dashboard.upcomingModules}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          {t.admin.dashboard.upcomingDesc}
        </p>
      </div>
    </div>
  );
}
