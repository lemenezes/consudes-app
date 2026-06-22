import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Eye, EyeOff, Search, SlidersHorizontal,
  X, ChevronDown, ChevronUp, ChevronsUpDown,
} from 'lucide-react';
import {
  listCalendarEvents,
  setCalendarEventStatus,
  deleteCalendarEvent,
} from '../../services/calendarService';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useLanguage } from '../../context/LanguageContext';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import type { CalendarEventRow, PublishStatus, CalendarEventCategory } from '../../lib/database.aliases';

// ── Cores de status ──────────────────────────────────────────────────────
const STATUS_COLORS: Record<PublishStatus, string> = {
  draft:     'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  archived:  'bg-yellow-100 text-yellow-700',
};

// ── Ordenação ────────────────────────────────────────────────────────────
type SortKey = 'start_date' | 'title' | 'status';
type SortDir = 'asc' | 'desc';

function sortEvents(list: CalendarEventRow[], key: SortKey, dir: SortDir): CalendarEventRow[] {
  return [...list].sort((a, b) => {
    let cmp = 0;
    if (key === 'title')      cmp = a.title.localeCompare(b.title);
    else if (key === 'status') cmp = a.status.localeCompare(b.status);
    else                      cmp = (a.start_date ?? '').localeCompare(b.start_date ?? '');
    return dir === 'asc' ? cmp : -cmp;
  });
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-gray-300 ml-1 shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp   size={13} className="text-[#0057A8] ml-1 shrink-0" />
    : <ChevronDown size={13} className="text-[#0057A8] ml-1 shrink-0" />;
}

// ── Formatação de datas ──────────────────────────────────────────────────
function formatSingleDate(date: string | null, precision: string): string {
  if (!date) return '—';
  if (precision === 'year') return date.slice(0, 4);
  const [y, m, d] = date.split('-');
  if (precision === 'month') return `${m}/${y}`;
  return `${d}/${m}/${y}`;
}

function formatEventDate(ev: CalendarEventRow): string {
  const s = formatSingleDate(ev.start_date, ev.date_precision);
  const e = ev.end_date && ev.end_date !== ev.start_date
    ? formatSingleDate(ev.end_date, ev.date_precision)
    : null;
  return e ? `${s} – ${e}` : s;
}

// ── Toggle Eye/EyeOff ────────────────────────────────────────────────────
function VisibilityToggle({
  item,
  loading,
  onToggle,
}: {
  item: CalendarEventRow;
  loading: boolean;
  onToggle: (item: CalendarEventRow) => void;
}) {
  const published = item.status === 'published';
  return (
    <button
      onClick={() => onToggle(item)}
      disabled={loading}
      title={published ? 'Despublicar' : 'Publicar'}
      aria-label={published ? 'Despublicar evento' : 'Publicar evento'}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        published
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      } ${loading ? 'animate-pulse' : ''}`}
    >
      {published ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
  );
}

export default function AdminCalendarListPage() {
  const { log } = useAuditLog();
  const { t } = useLanguage();
  const ac = t.admin.calendar;

  const [events, setEvents]         = useState<CalendarEventRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [toDelete, setToDelete]     = useState<CalendarEventRow | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Filtros e ordenação ──────────────────────────────────────────────
  const [busca, setBusca]                 = useState('');
  const [filterStatus, setFilterStatus]   = useState<PublishStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CalendarEventCategory | 'all'>('all');
  const [sortKey, setSortKey]             = useState<SortKey>('start_date');
  const [sortDir, setSortDir]             = useState<SortDir>('asc');
  const [filtersOpen, setFiltersOpen]     = useState(false);

  const activeFilterCount = [
    filterStatus !== 'all',
    filterCategory !== 'all',
  ].filter(Boolean).length;

  const hasActiveFilters = busca.trim() !== '' || activeFilterCount > 0;

  function clearFilters() {
    setBusca('');
    setFilterStatus('all');
    setFilterCategory('all');
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const load = async () => {
    setLoading(true);
    const { data, error } = await listCalendarEvents();
    if (error) setError(error);
    else setEvents(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Dados derivados ──────────────────────────────────────────────────
  const filteredAndSorted = useMemo(() => {
    let list = events;
    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        (e.country ?? '').toLowerCase().includes(q) ||
        (e.city ?? '').toLowerCase().includes(q) ||
        (e.sport ?? '').toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all')   list = list.filter((e) => e.status === filterStatus);
    if (filterCategory !== 'all') list = list.filter((e) => e.category === filterCategory);
    return sortEvents(list, sortKey, sortDir);
  }, [events, busca, filterStatus, filterCategory, sortKey, sortDir]);

  const published = events.filter((e) => e.status === 'published').length;
  const drafts    = events.filter((e) => e.status === 'draft').length;

  // ── Ações ────────────────────────────────────────────────────────────
  const handleTogglePublish = async (item: CalendarEventRow) => {
    const next: PublishStatus = item.status === 'published' ? 'draft' : 'published';
    setActionLoading(item.id);
    const { error } = await setCalendarEventStatus(item.id, next);
    if (error) { setError(error); setActionLoading(null); return; }
    await log({
      action: next === 'published' ? 'publish_calendar_event' : 'unpublish_calendar_event',
      entity_type: 'calendar_event',
      entity_id: item.id,
      entity_title: item.title,
    });
    setEvents((prev) => prev.map((e) => e.id === item.id ? { ...e, status: next } : e));
    setActionLoading(null);
  };

  const handleDeleteConfirm = async (reason: string) => {
    if (!toDelete) return;
    const { error } = await deleteCalendarEvent(toDelete.id);
    if (error) { setError(error); setToDelete(null); return; }
    await log({
      action: 'delete_calendar_event',
      entity_type: 'calendar_event',
      entity_id: toDelete.id,
      entity_title: toDelete.title,
      reason,
    });
    setEvents((prev) => prev.filter((e) => e.id !== toDelete.id));
    setToDelete(null);
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            {t.admin.nav.calendar}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {hasActiveFilters ? (
              <>
                <span className="font-semibold text-[#1F2937]">{filteredAndSorted.length}</span>
                {' de '}{events.length}
              </>
            ) : (
              <>{events.length} total</>
            )}
            {' · '}
            <span className="text-green-600 font-medium">{published} publicado{published !== 1 ? 's' : ''}</span>
            {drafts > 0 && (
              <> · <span className="text-gray-400">{drafts} rascunho{drafts !== 1 ? 's' : ''}</span></>
            )}
          </p>
        </div>
        <Link
          to="/admin/calendario/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold hover:bg-[#c8942e] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {ac.new}
        </Link>
      </div>

      {/* Barra de busca + filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
        {/* Linha de busca */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar evento, país, cidade, esporte…"
            className="flex-1 bg-transparent text-sm text-[#1F2937] placeholder:text-gray-300 focus:outline-none"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca('')}
              className="shrink-0 p-0.5 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-[#003B73]/8 text-[#003B73] border-[#003B73]/20'
                : 'text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal size={12} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0057A8] text-white text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Painel de filtros colapsável */}
        {filtersOpen && (
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gray-50/50 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
                {t.admin.statusLabel}
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as PublishStatus | 'all')}
                className={`appearance-none text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0057A8]/20 transition-colors cursor-pointer ${
                  filterStatus !== 'all'
                    ? 'border-[#0057A8]/40 text-[#003B73] font-semibold bg-blue-50'
                    : 'border-gray-200 text-gray-600 bg-white'
                }`}
              >
                <option value="all">{ac.filterAll}</option>
                <option value="draft">{t.admin.status.draft}</option>
                <option value="published">{t.admin.status.published}</option>
                <option value="archived">{t.admin.status.archived}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
                {ac.categoryLabel}
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as CalendarEventCategory | 'all')}
                className={`appearance-none text-xs border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0057A8]/20 transition-colors cursor-pointer ${
                  filterCategory !== 'all'
                    ? 'border-[#0057A8]/40 text-[#003B73] font-semibold bg-blue-50'
                    : 'border-gray-200 text-gray-600 bg-white'
                }`}
              >
                <option value="all">{ac.filterAll}</option>
                {(['interclubes','sub21','adulto','institucional','outro'] as CalendarEventCategory[]).map((c) => (
                  <option key={c} value={c}>{ac.categories[c]}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={11} />
                {ac.clearFilters}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {hasActiveFilters ? (
            <div className="flex flex-col items-center gap-3">
              <Search size={28} className="text-gray-200" />
              <p>{ac.noEventsFiltered}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#0057A8] hover:underline"
              >
                {ac.clearFilters}
              </button>
            </div>
          ) : (
            ac.noEvents
          )}
        </div>
      ) : (
        <>
          {/* ── Mobile: cards ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filteredAndSorted.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Barra de status */}
                <div className={`h-0.5 ${item.status === 'published' ? 'bg-green-400' : item.status === 'archived' ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1F2937] leading-snug line-clamp-2">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.city ? `${item.city}, ` : ''}{item.country || '—'}
                      </p>
                    </div>
                    <VisibilityToggle item={item} loading={actionLoading === item.id} onToggle={handleTogglePublish} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      <span>{formatEventDate(item)}</span>
                    </div>
                    <span>·</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[item.status]}`}>
                      {t.admin.status[item.status]}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-[#003B73] border border-blue-100">
                      {ac.categories[item.category]}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                    <Link
                      to={`/admin/calendario/${item.id}/editar`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0057A8] bg-[#0057A8]/5 hover:bg-[#0057A8]/10 border border-[#0057A8]/15 transition-colors"
                    >
                      {t.admin.edit}
                    </Link>
                    <button
                      onClick={() => setToDelete(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                    >
                      {ac.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Desktop: tabela ───────────────────────────────────────────── */}
          <div className="hidden sm:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left bg-gray-50/50">
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    <button
                      className="flex items-center hover:text-[#0057A8] transition-colors"
                      onClick={() => handleSort('title')}
                    >
                      {t.admin.titleLabel}
                      <SortIcon col="title" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden md:table-cell">
                    <button
                      className="flex items-center hover:text-[#0057A8] transition-colors"
                      onClick={() => handleSort('start_date')}
                    >
                      {ac.startDateLabel}
                      <SortIcon col="start_date" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide hidden lg:table-cell">{ac.categoryLabel}</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    <button
                      className="flex items-center hover:text-[#0057A8] transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      {t.admin.statusLabel}
                      <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
                    </button>
                  </th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide text-center">{t.admin.visibleOnSite}</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSorted.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#1F2937] leading-snug line-clamp-1 group-hover:text-[#0057A8] transition-colors">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[item.city, item.country].filter(Boolean).join(', ') || '—'}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs tabular-nums">
                      {formatEventDate(item)}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#003B73] border border-blue-100">
                        {ac.categories[item.category]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                        {t.admin.status[item.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <VisibilityToggle item={item} loading={actionLoading === item.id} onToggle={handleTogglePublish} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/calendario/${item.id}/editar`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0057A8] bg-[#0057A8]/5 hover:bg-[#0057A8]/10 border border-[#0057A8]/15 hover:border-[#0057A8]/30 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                          </svg>
                          {t.admin.edit}
                        </Link>
                        <button
                          onClick={() => setToDelete(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          {ac.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de confirmação */}
      {toDelete && (
        <DeleteConfirmModal
          title={toDelete.title ?? ''}
          itemLabel={toDelete.title ?? ''}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
