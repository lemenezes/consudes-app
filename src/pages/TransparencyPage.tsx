import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import PageHero from '../components/PageHero';
import { listPublishedReports } from '../services/reportsPublicService';
import { categoryLabel, REPORT_CATEGORIES } from '../services/reportsService';
import type { ReportPublicItem } from '../services/reportsPublicService';
import type { ReportCategory } from '../lib/database.types';

const CATEGORY_COLORS: Record<ReportCategory, string> = {
  relatorio:         'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  estatuto:          'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  regulamento:       'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ata:               'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  prestacao_contas:  'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  documento_oficial: 'bg-slate-50 text-slate-600 dark:bg-slate-700/30 dark:text-slate-300',
};

function IconFile() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-white/5 rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#003B73]/6 dark:bg-white/5 mb-5">
        <IconFile />
      </div>
      <p className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1F2937] dark:text-white mb-2">
        Nenhum documento encontrado
      </p>
      <p className="text-[#1F2937]/55 dark:text-white/40 text-sm">
        Tente ajustar os filtros ou consulte novamente em breve.
      </p>
    </div>
  );
}

function PdfModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Timeout de 15s — Google Docs Viewer pode travar no primeiro load
  useEffect(() => {
    if (!iframeLoading) return;
    const t = setTimeout(() => setTimedOut(true), 15000);
    return () => clearTimeout(t);
  }, [iframeLoading]);

  // Google Docs Viewer — contorna Content-Disposition: attachment
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizar ${title}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Barra topo */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#002D5E] shrink-0">
        <p className="text-white text-sm font-semibold truncate max-w-[calc(100%-3rem)]">{title}</p>
        <button
          onClick={onClose}
          aria-label="Fechar visualizador"
          className="text-white/60 hover:text-white transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Viewer */}
      <div className="relative flex-1 w-full">
        {iframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-4 z-10">
            {!timedOut ? (
              <>
                <svg className="w-8 h-8 text-[#003B73] animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">A carregar o documento…</p>
                  <p className="text-xs text-gray-400 mt-1">A primeira abertura pode levar alguns segundos.</p>
                </div>
              </>
            ) : (
              <div className="text-center px-6 max-w-sm">
                <svg className="w-10 h-10 text-amber-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-medium text-gray-700 mb-1">O documento está a demorar</p>
                <p className="text-xs text-gray-500 mb-4">O visualizador não conseguiu carregar a tempo. Pode baixar o arquivo diretamente.</p>
                <a
                  href={url}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-sm font-semibold hover:bg-[#0057A8] transition-colors"
                >
                  <IconDownload />
                  Baixar documento
                </a>
              </div>
            )}
          </div>
        )}
        <iframe
          src={viewerUrl}
          title={title}
          className="w-full h-full border-0"
          allow="fullscreen"
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
}

export default function TransparencyPage() {
  const { t } = useLanguage();

  useSEO({
    title: t.nav.transparency,
    description: 'Documentos oficiais, relatórios, estatutos e prestação de contas da CONSUDES.',
    url: '/transparencia',
  });

  const [reports, setReports] = useState<ReportPublicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<number | ''>('');
  const [filterCat, setFilterCat] = useState<ReportCategory | ''>('');
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    listPublishedReports({
      year: filterYear !== '' ? filterYear : undefined,
      category: filterCat !== '' ? filterCat : undefined,
    }).then(({ data, error }) => {
      if (error) setFetchError(error);
      setReports(data);
      setLoading(false);
    });
  }, [filterYear, filterCat]);

  const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a);

  const filtered = search.trim()
    ? reports.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : reports;

  const grouped = filtered.reduce<Record<number, ReportPublicItem[]>>((acc, r) => {
    if (!acc[r.year]) acc[r.year] = [];
    acc[r.year].push(r);
    return acc;
  }, {});
  const sortedYears = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      {previewDoc && (
        <PdfModal
          url={previewDoc.url}
          title={previewDoc.title}
          onClose={() => setPreviewDoc(null)}
        />
      )}
      <PageHero
        label="CONSUDES"
        title={t.nav.transparency}
        subtitle="Documentos oficiais, relatórios e prestação de contas da confederação."
      />

      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Intro ────────────────────────────────────────────── */}
          <div className="mb-10">
            <p className="text-[11px] font-bold tracking-[0.5em] uppercase text-[#D9A441] mb-3" aria-hidden="true">
              CONSUDES
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-semibold text-[#1F2937] dark:text-white leading-tight tracking-tight mb-3">
              Acesso à informação
            </h2>
            <p className="text-sm sm:text-[15px] text-[#1F2937]/70 dark:text-white/55 max-w-xl">
              Documentos institucionais disponibilizados pela CONSUDES em cumprimento aos
              princípios de transparência e acesso público à informação.
            </p>
          </div>

          {/* ── Filtros ──────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1F2937]/35 dark:text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar documento…"
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#1F2937] dark:text-white placeholder:text-[#1F2937]/35 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#003B73]/30"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as ReportCategory | '')}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#1F2937] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003B73]/30"
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as categorias</option>
              {REPORT_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : '')}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#1F2937] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#003B73]/30"
              aria-label="Filtrar por ano"
            >
              <option value="">Todos os anos</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* ── Lista ────────────────────────────────────────────── */}
          {fetchError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              Erro ao carregar documentos: {fetchError}
            </div>
          )}
          {loading ? (
            <Skeleton />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-10">
              {sortedYears.map((year) => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-['Cormorant_Garamond'] text-4xl font-bold text-[#003B73]/10 dark:text-white/10 leading-none select-none" aria-hidden="true">
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#003B73]/10 via-[#D9A441]/25 to-transparent dark:from-white/8 dark:via-[#D9A441]/15" aria-hidden="true" />
                  </div>

                  <ul className="space-y-3" aria-label={`Documentos de ${year}`}>
                    {grouped[year].map((doc) => (
                      <li
                        key={doc.id}
                        className="group flex items-center gap-4 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.06] hover:border-[#D9A441]/40 dark:hover:border-[#D9A441]/20 shadow-[0_1px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,59,115,0.08)] transition-all duration-200 p-5"
                      >
                        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#003B73]/6 dark:bg-white/8 text-[#003B73] dark:text-white/70 shrink-0 group-hover:bg-[#D9A441]/10 transition-colors" aria-hidden="true">
                          <IconFile />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${CATEGORY_COLORS[doc.category]}`}>
                              {categoryLabel(doc.category)}
                            </span>
                            {doc.doc_date && (
                              <time dateTime={doc.doc_date} className="text-[11px] text-[#1F2937]/45 dark:text-white/35">
                                {new Date(doc.doc_date + 'T12:00:00').toLocaleDateString('pt-BR', {
                                  day: '2-digit', month: 'short', year: 'numeric',
                                })}
                              </time>
                            )}
                          </div>
                          <p className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1F2937] dark:text-white leading-snug">
                            {doc.title}
                          </p>
                          {doc.description && (
                            <p className="text-sm text-[#1F2937]/55 dark:text-white/40 mt-0.5 line-clamp-1">
                              {doc.description}
                            </p>
                          )}
                        </div>

                        {doc.file_url ? (
                          <div className="shrink-0 flex items-center gap-2">
                            <button
                              onClick={() => setPreviewDoc({ url: doc.file_url!, title: doc.title })}
                              aria-label={`Visualizar ${doc.title}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#003B73] hover:bg-[#0057A8] text-white text-[12px] font-semibold tracking-wide transition-colors duration-150"
                            >
                              <IconEye />
                              <span className="hidden sm:inline">Visualizar</span>
                            </button>
                            <a
                              href={doc.file_url}
                              download
                              aria-label={`Baixar ${doc.title}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#003B73]/20 hover:border-[#003B73]/50 text-[#003B73] hover:bg-[#003B73]/5 dark:border-white/20 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/5 text-[12px] font-semibold tracking-wide transition-colors duration-150"
                            >
                              <IconDownload />
                              <span className="hidden sm:inline">Baixar</span>
                            </a>
                          </div>
                        ) : (
                          <span className="shrink-0 text-[11px] text-[#1F2937]/35 dark:text-white/25 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg">
                            Em breve
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
