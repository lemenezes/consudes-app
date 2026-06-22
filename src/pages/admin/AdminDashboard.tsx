import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  FileText,
  Images,
  Newspaper
} from "lucide-react";
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
const CARD_CLASS =
  "bg-white rounded-xl shadow-sm border border-gray-200 ring-1 ring-gray-100 flex flex-col hover:shadow-md hover:border-gray-300 transition-all duration-200";
const CARD_TITLE_CLASS = "text-base font-semibold text-[#1F2937]";
const CARD_ICON_CLASS = "w-4 h-4 text-[#0057A8]/35";
const CARD_CTA_CLASS =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057A8] hover:text-[#004a8f] transition-colors";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-10">
        {/* ── Card Notícias ── */}
        <div className={`${CARD_CLASS} xl:col-span-2`}>
          <div className="p-6 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={CARD_TITLE_CLASS}>{t.admin.nav.news}</span>
              <Newspaper className={CARD_ICON_CLASS} aria-hidden="true" />
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
            <Link to="/admin/noticias" className={CARD_CTA_CLASS}>
              Ver notícias
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Card Calendário ── */}
        <div className={`${CARD_CLASS} xl:col-span-2`}>
          <div className="p-6 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={CARD_TITLE_CLASS}>{t.admin.nav.calendar}</span>
              <CalendarDays className={CARD_ICON_CLASS} aria-hidden="true" />
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
            <Link to="/admin/calendario" className={CARD_CTA_CLASS}>
              Ver calendário
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Card Transparência ── */}
        <div className={`${CARD_CLASS} xl:col-span-2`}>
          <div className="p-6 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={CARD_TITLE_CLASS}>Transparência</span>
              <FileText className={CARD_ICON_CLASS} aria-hidden="true" />
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
            <Link to="/admin/transparencia" className={CARD_CTA_CLASS}>
              Ver transparência
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Card Federações ── */}
        <div className={`${CARD_CLASS} xl:col-span-2 xl:col-start-2`}>
          <div className="p-6 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={CARD_TITLE_CLASS}>Federações</span>
              <Building2 className={CARD_ICON_CLASS} aria-hidden="true" />
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
            <Link to="/admin/federacoes" className={CARD_CTA_CLASS}>
              Ver federações
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* ── Card Galeria ── */}
        <div className={`${CARD_CLASS} xl:col-span-2`}>
          <div className="p-6 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={CARD_TITLE_CLASS}>Galeria</span>
              <Images className={CARD_ICON_CLASS} aria-hidden="true" />
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
                : `${galleries.length} álbum${galleries.length !== 1 ? "ns" : ""} · ${galleries.reduce((acc, g) => acc + (g.photoCount || 0), 0)} fotos`}
            </p>
          </div>
          <div className="px-6 pb-5">
            <Link to="/admin/galeria" className={CARD_CTA_CLASS}>
              Ver galeria
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
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
    </div>
  );
}
