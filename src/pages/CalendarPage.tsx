import { useState, useMemo, useEffect, useRef } from 'react';
import {
  MapPin,
  HelpCircle,
  ExternalLink,
  CalendarDays,
  Trophy,
  Users,
  Filter,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { listPublishedCalendarEvents } from '../services/calendarService';
import { calendarEvents as mockEvents } from '../data/calendarData';
import type { CalendarEventRow, CalendarEventType, CalendarEventStatus, CalendarEventCategory } from '../lib/database.types';

/* ── Conversão: dado mock → CalendarEventRow ─────────────────────── */
function mockToRow(m: (typeof mockEvents)[number]): CalendarEventRow {
  const statusMap: Record<string, CalendarEventStatus> = {
    upcoming: 'upcoming',
    registrationsOpen: 'registrations_open',
    confirmed: 'confirmed',
    finished: 'finished',
  };
  const catMap: Record<string, CalendarEventCategory> = {
    Interclubes: 'interclubes',
    'Sub-21': 'sub21',
    Adulto: 'adulto',
    Institucional: 'institucional',
  };
  return {
    id: m.id,
    title: m.title,
    slug: m.id,
    description: m.description ?? null,
    full_description: null,
    start_date: m.startDate,
    end_date: m.endDate !== m.startDate ? m.endDate : null,
    date_precision: m.datePrecision,
    country: m.country,
    city: m.city ?? null,
    venue: null,
    location_open: m.locationOpen ?? false,
    sport: m.sport,
    category: (m.category ? (catMap[m.category] ?? 'outro') : 'outro') as CalendarEventCategory,
    event_type: m.type as CalendarEventType,
    event_status: statusMap[m.status] ?? 'upcoming',
    federation: m.federation ?? null,
    link: m.link ?? null,
    cover_url: null,
    status: 'published',
    featured: false,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  };
}

/* ── Helpers de locale ───────────────────────────────────────────── */
function getLocale(lang: string) {
  return lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
}

/* ── Bloco de data lateral ───────────────────────────────────────── */
function getDateBlock(
  startDate: string,
  endDate: string | null,
  precision: string,
  lang: string,
) {
  const locale = getLocale(lang);
  const s = new Date(startDate + 'T12:00:00');
  const e = endDate ? new Date(endDate + 'T12:00:00') : null;

  if (precision === 'full' && e) {
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    const dayPrimary = sameMonth ? `${s.getDate()}\u2013${e.getDate()}` : String(s.getDate());
    return {
      primary: dayPrimary,
      secondary: s.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
    };
  }
  if (precision === 'full') {
    return {
      primary: String(s.getDate()),
      secondary: s.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
    };
  }
  if (precision === 'month') {
    return {
      primary: s.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
      secondary: String(s.getFullYear()),
    };
  }
  return { primary: String(s.getFullYear()), secondary: null };
}

function formatDateRange(
  startDate: string,
  endDate: string | null,
  precision: string,
  lang: string,
): string {
  const locale = getLocale(lang);
  const s = new Date(startDate + 'T12:00:00');
  const e = endDate ? new Date(endDate + 'T12:00:00') : null;

  if (precision === 'year') return String(s.getFullYear());
  if (precision === 'month') return s.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  if (!e || startDate === endDate)
    return s.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  return sameMonth
    ? `${s.getDate()}\u2013${e.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`
    : `${s.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} \u2013 ${e.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

/* ── Agrupamento por período ─────────────────────────────────────── */
function getGroupKey(ev: CalendarEventRow) {
  const d = new Date(ev.start_date + 'T12:00:00');
  if (ev.date_precision === 'year') return `year:${d.getFullYear()}`;
  return `month:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getGroupLabel(key: string, lang: string): string {
  const locale = getLocale(lang);
  if (key.startsWith('year:')) return key.replace('year:', '');
  const [year, month] = key.replace('month:', '').split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

/* ── Configurações visuais ───────────────────────────────────────── */
const typeBorderColor: Record<CalendarEventType, string> = {
  championship:  'border-l-[#003B73]',
  interclubs:    'border-l-[#D9A441]',
  congress:      'border-l-indigo-600',
  assembly:      'border-l-cyan-600',
  institutional: 'border-l-emerald-600',
};

const typeIcon: Record<CalendarEventType, React.ReactNode> = {
  championship:  <Trophy className="w-3.5 h-3.5" />,
  interclubs:    <Users  className="w-3.5 h-3.5" />,
  congress:      <Trophy className="w-3.5 h-3.5" />,
  assembly:      <Trophy className="w-3.5 h-3.5" />,
  institutional: <Trophy className="w-3.5 h-3.5" />,
};

const categoryBadgeStyle: Record<CalendarEventCategory, string> = {
  interclubes:   'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  sub21:         'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  adulto:        'bg-blue-50 text-[#003B73] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  institucional: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  outro:         'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const statusBadgeStyle: Record<CalendarEventStatus, string> = {
  upcoming:           'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  registrations_open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  confirmed:          'bg-blue-100 text-[#003B73] dark:bg-blue-900/30 dark:text-blue-400',
  finished:           'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

/* ── Pill de filtro ──────────────────────────────────────────────── */
function FilterPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all whitespace-nowrap ${
        active
          ? 'bg-[#003B73] text-white border-[#003B73] shadow-sm'
          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-[#003B73]/40 hover:text-[#003B73] dark:hover:text-blue-300'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Card de evento ──────────────────────────────────────────────── */
function EventCard({ event }: { event: CalendarEventRow }) {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;
  const ac = t.admin.calendar;

  const dateBlock   = getDateBlock(event.start_date, event.end_date, event.date_precision, lang);
  const dateRange   = formatDateRange(event.start_date, event.end_date, event.date_precision, lang);
  const catLabel    = ac.categories[event.category];
  const statusLabel = ac.eventStatuses[event.event_status];

  return (
    <article
      className={`
        group flex bg-white dark:bg-white/[0.03] rounded-xl
        border border-slate-200 dark:border-white/10
        border-l-4 ${typeBorderColor[event.event_type]}
        shadow-sm hover:shadow-md dark:hover:bg-white/[0.06]
        transition-all duration-200 overflow-hidden
      `}
    >
      {/* Bloco de data */}
      <div className="hidden sm:flex flex-col items-center justify-center min-w-[80px] px-4 py-5 bg-slate-50 dark:bg-white/[0.03] border-r border-slate-100 dark:border-white/5 select-none">
        <span
          className={`font-bold text-[#003B73] dark:text-white leading-none ${
            event.date_precision === 'full'  ? 'text-2xl' :
            event.date_precision === 'month' ? 'text-lg'  : 'text-xl'
          }`}
        >
          {dateBlock.primary}
        </span>
        {dateBlock.secondary && (
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#D9A441] uppercase mt-1">
            {dateBlock.secondary}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-5 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${categoryBadgeStyle[event.category]}`}>
            {typeIcon[event.event_type]}
            {catLabel}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${statusBadgeStyle[event.event_status]}`}>
            {statusLabel}
          </span>
          {event.sport && (
            <span className="text-[10px] font-medium text-[#D9A441] tracking-widest uppercase">
              {event.sport}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-base sm:text-lg font-semibold text-[#1F2937] dark:text-white leading-snug mb-1 group-hover:text-[#003B73] dark:group-hover:text-blue-300 transition-colors">
          {event.title}
        </h3>

        {/* Data (mobile) */}
        <p className="sm:hidden text-xs font-medium text-[#D9A441] mb-2">{dateRange}</p>

        {/* Localização */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-3">
          {event.location_open ? (
            <>
              <HelpCircle className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">{cp.locationOpen}</span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{[event.city, event.country].filter(Boolean).join(', ')}</span>
            </>
          )}
          {event.federation && (
            <>
              <span className="mx-1">·</span>
              <span>{event.federation}</span>
            </>
          )}
        </div>

        {/* Descrição */}
        {event.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {event.description}
          </p>
        )}

        {/* Rodapé */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{dateRange}</span>
          </div>
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003B73] dark:text-blue-400 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver más</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Seção de mês com accordion ──────────────────────────────────── */
function MesSection({
  label,
  count,
  open,
  onToggle,
  children,
}: {
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 py-2 group/mes cursor-pointer select-none"
      >
        <CalendarDays className="w-3.5 h-3.5 text-[#D9A441] shrink-0" aria-hidden="true" />
        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400 shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />
        <span className="shrink-0 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
          {count}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="space-y-3 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────────────── */
export default function CalendarPage() {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;
  const ac = t.admin.calendar;

  useSEO({
    title: t.nav.calendar,
    description: t.calendarPage.subtitle,
    url: '/calendario',
  });

  const [events, setEvents]           = useState<CalendarEventRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch]           = useState('');
  const [activeCategory, setActiveCategory] = useState<CalendarEventCategory | 'all'>('all');
  const [activeStatus, setActiveStatus]     = useState<CalendarEventStatus | 'all'>('all');
  const [openMonths, setOpenMonths]   = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listPublishedCalendarEvents().then(({ data, error }) => {
      setEvents(error ? mockEvents.map(mockToRow) : data);
      setDataLoading(false);
    });
  }, []);

  /* Auto-open meses futuros/correntes, fechar meses encerrados */
  useEffect(() => {
    if (events.length === 0) return;
    const now = new Date();
    const initialOpen = new Set<string>();
    events.forEach((ev) => {
      const key = getGroupKey(ev);
      const d = new Date(ev.start_date + 'T12:00:00');
      if (d >= new Date(now.getFullYear(), now.getMonth(), 1)) {
        initialOpen.add(key);
      }
    });
    // Se nenhum aberto (todos no passado), abre todos
    if (initialOpen.size === 0) {
      events.forEach((ev) => initialOpen.add(getGroupKey(ev)));
    }
    setOpenMonths(initialOpen);
  }, [events]);

  const allCategories = useMemo(() => {
    const seen = new Set<CalendarEventCategory>();
    events.forEach((ev) => seen.add(ev.category));
    return Array.from(seen);
  }, [events]);

  const allStatuses: CalendarEventStatus[] = ['finished', 'confirmed', 'upcoming', 'registrations_open'];

  const hasActiveFilters = search.trim() !== '' || activeCategory !== 'all' || activeStatus !== 'all';

  function clearFilters() {
    setSearch('');
    setActiveCategory('all');
    setActiveStatus('all');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((ev) => {
      const matchCat    = activeCategory === 'all' || ev.category     === activeCategory;
      const matchStatus = activeStatus   === 'all' || ev.event_status === activeStatus;
      if (!matchCat || !matchStatus) return false;
      if (!q) return true;
      const haystack = [
        ev.title,
        ev.city,
        ev.country,
        ev.sport,
        ev.federation,
        ev.description,
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [events, activeCategory, activeStatus, search]);

  /* Ao aplicar filtro, expande todos os grupos visíveis */
  useEffect(() => {
    if (!hasActiveFilters) return;
    setOpenMonths((prev) => {
      const next = new Set(prev);
      filtered.forEach((ev) => next.add(getGroupKey(ev)));
      return next;
    });
  }, [filtered, hasActiveFilters]);

  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; events: CalendarEventRow[] }>();
    filtered.forEach((ev) => {
      const key   = getGroupKey(ev);
      const label = getGroupLabel(key, lang);
      if (!map.has(key)) map.set(key, { label, events: [] });
      map.get(key)!.events.push(ev);
    });
    return map;
  }, [filtered, lang]);

  function toggleMonth(key: string) {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <PageShell
     
      title={t.nav.calendar}
      subtitle={cp.subtitle}
      breadcrumbs={[{ label: t.nav.calendar }]}
    >
      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-consudes-dark-body dark:bg-none py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-consudes-gold mb-2">
              {dataLoading ? '\u2026' : `${events.length} ${cp.eventsLabel} \u00B7 2025\u20132027`}
            </p>
            <p className="text-lg sm:text-2xl font-['Cormorant_Garamond'] font-semibold text-consudes-blue-text dark:text-white leading-snug whitespace-nowrap">
              {cp.introHeadline}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl mb-8 shadow-sm overflow-hidden">
            {/* Busca */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/5">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={cp.searchPlaceholder}
                aria-label={cp.searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-[#1F2937] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); searchRef.current?.focus(); }}
                  className="shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pills de filtro */}
            <div className="flex flex-col gap-4 p-4">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  <Filter className="w-3 h-3" />
                  {cp.filterCategory}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>
                    {cp.all}
                  </FilterPill>
                  {allCategories.map((cat) => (
                    <FilterPill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                      {ac.categories[cat]}
                    </FilterPill>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  {cp.filterStatus}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeStatus === 'all'} onClick={() => setActiveStatus('all')}>
                    {cp.all}
                  </FilterPill>
                  {allStatuses.map((s) => (
                    <FilterPill key={s} active={activeStatus === s} onClick={() => setActiveStatus(s)}>
                      {ac.eventStatuses[s]}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="border-t border-slate-100 dark:border-white/5 pt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {filtered.length} {filtered.length === 1 ? cp.monthEvents : cp.monthEventsPlural}
                  </span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#003B73]/8 text-[#003B73] dark:bg-blue-500/10 dark:text-blue-400 border border-[#003B73]/15 dark:border-blue-500/20 hover:bg-[#003B73]/15 dark:hover:bg-blue-500/20 transition-all"
                  >
                    <X className="w-3 h-3" />
                    {cp.clearFilters}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Lista */}
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="w-7 h-7 text-slate-300 dark:text-slate-600" />}
              title={cp.noEvents}
              description={cp.noEventsDesc}
            />
          ) : (
            <div className="space-y-1">
              {Array.from(grouped.entries()).map(([key, { label, events: evs }]) => (
                <MesSection
                  key={key}
                  label={label}
                  count={evs.length}
                  open={openMonths.has(key)}
                  onToggle={() => toggleMonth(key)}
                >
                  {evs.map((ev) => <EventCard key={ev.id} event={ev} />)}
                </MesSection>
              ))}
            </div>
          )}

        </div>
      </section>
    </PageShell>
  );
}
