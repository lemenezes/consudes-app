import { useState, useMemo, useEffect, useRef } from "react";
import {
  MapPin,
  HelpCircle,
  ExternalLink,
  CalendarDays,
  Filter,
  Search,
  X,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useSEO } from "../hooks/useSEO";
import PageShell from "../components/PageShell";
import EmptyState from "../components/EmptyState";
import { listPublishedCalendarEvents } from "../services/calendarService";
import { calendarEvents as mockEvents } from "../data/calendarData";
import { mockToRow } from "../utils/calendarMockAdapter";
import {
  getDateBlock,
  formatDateRange,
  getGroupKey,
  getGroupLabel
} from "../utils/calendarDateUtils";
import type {
  CalendarEventRow,
  CalendarEventStatus,
  CalendarEventCategory
} from "../lib/database.aliases";
import {
  typeBorderColor,
  typeIcon,
  categoryBadgeStyle,
  statusBadgeStyle
} from "../constants/calendarStyles";

// mockToRow foi movido para src/utils/calendarMockAdapter.ts

// Helpers de data movidos para src/utils/calendarDateUtils.ts

// Configurações visuais movidas para src/constants/calendarStyles.ts

/* ── Pill de filtro ──────────────────────────────────────────────── */
function FilterPill({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all whitespace-nowrap ${
        active
          ? "bg-[#003B73] text-white border-[#003B73] shadow-sm"
          : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-[#003B73]/40 hover:text-[#003B73] dark:hover:text-blue-300"
      }`}>
      {children}
    </button>
  );
}

/* ── Card de evento ──────────────────────────────────────────────── */
function EventCard({ event }: { event: CalendarEventRow }) {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;
  const ac = t.admin.calendar;

  const dateBlock = getDateBlock(
    event.start_date,
    event.end_date,
    event.date_precision,
    lang
  );
  const dateRange = formatDateRange(
    event.start_date,
    event.end_date,
    event.date_precision,
    lang
  );
  const catLabel = ac.categories[event.category];
  const statusLabel = ac.eventStatuses[event.event_status];

  return (
    <article
      className={`
        group flex bg-white dark:bg-white/[0.03] rounded-xl
        border border-slate-200 dark:border-white/10
        border-l-4 ${typeBorderColor[event.event_type]}
        shadow-sm hover:shadow-md dark:hover:bg-white/[0.06]
        transition-all duration-200 overflow-hidden
      `}>
      {/* Bloco de data */}
      <div className="hidden sm:flex flex-col items-center justify-center min-w-[80px] px-4 py-5 bg-slate-50 dark:bg-white/[0.03] border-r border-slate-100 dark:border-white/5 select-none">
        <span
          className={`font-bold text-[#003B73] dark:text-white leading-none ${
            event.date_precision === "full"
              ? "text-2xl"
              : event.date_precision === "month"
                ? "text-lg"
                : "text-xl"
          }`}>
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
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${categoryBadgeStyle[event.category]}`}>
            {typeIcon[event.event_type]}
            {catLabel}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${statusBadgeStyle[event.event_status]}`}>
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
        <p className="sm:hidden text-xs font-medium text-[#D9A441] mb-2">
          {dateRange}
        </p>

        {/* Localização */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-3">
          {event.location_open ? (
            <>
              <HelpCircle className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {cp.locationOpen}
              </span>
            </>
          ) : (
            <>
              <MapPin className="w-3 h-3 shrink-0" />
              <span>
                {[event.city, event.country].filter(Boolean).join(", ")}
              </span>
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003B73] dark:text-blue-400 hover:underline">
              <ExternalLink className="w-3 h-3" />
              <span>{cp.viewMore}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Cabeçalho estático de mês/período (dentro de um ano já aberto) ──── */

function MonthHeader({
  label,
  count,
  events
}: {
  label: string;
  count: number;
  events: Array<{ event_status: string }>;
}) {
  const { t } = useLanguage();
  const allFinished =
    events.length > 0 && events.every(ev => ev.event_status === "finished");

  return (
    <div className="flex items-center gap-3 py-2">
      <CalendarDays
        className="w-3.5 h-3.5 text-[#D9A441] shrink-0"
        aria-hidden="true"
      />
      <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 dark:text-slate-400 shrink-0">
        {label}
      </span>
      {allFinished && (
        <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold tracking-wide border border-slate-300 dark:border-slate-700">
          {t.calendarPage.finishedBadge}
        </span>
      )}
      <div
        className="flex-1 h-px bg-slate-200 dark:bg-white/10"
        aria-hidden="true"
      />
      <span className="shrink-0 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
        {count}
      </span>
    </div>
  );
}

/* ── Seção de ano com accordion ───────────────────────────────────── */

function YearSection({
  year,
  count,
  open,
  onToggle,
  children
}: {
  year: number;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={
        open
          ? ""
          : "bg-slate-50/70 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl"
      }>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-3 py-3 px-2 group/year cursor-pointer select-none">
        <span className="text-lg sm:text-xl font-bold text-[#003B73] dark:text-white tabular-nums shrink-0">
          {year}
        </span>
        <div
          className="flex-1 h-px bg-slate-200 dark:bg-white/10"
          aria-hidden="true"
        />
        <span className="shrink-0 text-xs tabular-nums text-slate-400 dark:text-slate-500">
          {count}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-slate-400 dark:text-slate-500" : "text-[#003B73] dark:text-blue-300 drop-shadow"}`}
          aria-hidden="true"
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[999999px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="space-y-5 pb-5 px-2">{children}</div>
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
    url: "/calendario"
  });

  const [events, setEvents] = useState<CalendarEventRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<
    Set<CalendarEventCategory>
  >(new Set());
  const [activeStatuses, setActiveStatuses] = useState<
    Set<CalendarEventStatus>
  >(new Set());
  const [activeYears, setActiveYears] = useState<Set<number>>(new Set());
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  function toggleInSet<T>(
    setter: React.Dispatch<React.SetStateAction<Set<T>>>,
    value: T
  ) {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  useEffect(() => {
    listPublishedCalendarEvents().then(({ data, error }) => {
      setEvents(error ? mockEvents.map(mockToRow) : data);
      setDataLoading(false);
    });
  }, []);

  /* Abre somente o ano do próximo grupo relevante */
  useEffect(() => {
    if (events.length === 0) return;

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const nextEvent = events.find(ev => {
      const d = new Date(ev.start_date + "T12:00:00");
      return d >= currentMonth;
    });

    const eventToOpen = nextEvent ?? events[events.length - 1];

    setOpenYears(
      eventToOpen
        ? new Set([
            new Date(eventToOpen.start_date + "T12:00:00").getFullYear()
          ])
        : new Set()
    );
  }, [events]);

  const allCategories = useMemo(() => {
    const seen = new Set<CalendarEventCategory>();
    events.forEach(ev => seen.add(ev.category));
    return Array.from(seen);
  }, [events]);

  const allYears = useMemo(() => {
    const seen = new Set<number>();
    events.forEach(ev =>
      seen.add(new Date(ev.start_date + "T12:00:00").getFullYear())
    );
    return Array.from(seen).sort((a, b) => a - b);
  }, [events]);

  const allStatuses: CalendarEventStatus[] = [
    "finished",
    "confirmed",
    "proposed",
    "upcoming",
    "registrations_open"
  ];

  const hasActiveFilters =
    search.trim() !== "" ||
    activeCategories.size > 0 ||
    activeStatuses.size > 0 ||
    activeYears.size > 0;

  function clearFilters() {
    setSearch("");
    setActiveCategories(new Set());
    setActiveStatuses(new Set());
    setActiveYears(new Set());
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter(ev => {
      const matchCat =
        activeCategories.size === 0 || activeCategories.has(ev.category);
      const matchStatus =
        activeStatuses.size === 0 || activeStatuses.has(ev.event_status);
      const matchYear =
        activeYears.size === 0 ||
        activeYears.has(new Date(ev.start_date + "T12:00:00").getFullYear());
      if (!matchCat || !matchStatus || !matchYear) return false;
      if (!q) return true;
      const haystack = [
        ev.title,
        ev.city,
        ev.country,
        ev.sport,
        ev.federation,
        ev.description
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [events, activeCategories, activeStatuses, activeYears, search]);

  /* Chips compactos representando cada seleção ativa (exceto busca) */
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    allYears.forEach(year => {
      if (activeYears.has(year)) {
        chips.push({
          key: `year-${year}`,
          label: String(year),
          onRemove: () => toggleInSet(setActiveYears, year)
        });
      }
    });
    allCategories.forEach(cat => {
      if (activeCategories.has(cat)) {
        chips.push({
          key: `cat-${cat}`,
          label: ac.categories[cat],
          onRemove: () => toggleInSet(setActiveCategories, cat)
        });
      }
    });
    allStatuses.forEach(s => {
      if (activeStatuses.has(s)) {
        chips.push({
          key: `status-${s}`,
          label: ac.eventStatuses[s],
          onRemove: () => toggleInSet(setActiveStatuses, s)
        });
      }
    });
    return chips;
  }, [
    allYears,
    allCategories,
    allStatuses,
    activeYears,
    activeCategories,
    activeStatuses,
    ac
  ]);

  /* Ao aplicar filtro, expande todos os anos com resultados visíveis */
  useEffect(() => {
    if (!hasActiveFilters) return;
    setOpenYears(prev => {
      const next = new Set(prev);
      filtered.forEach(ev =>
        next.add(new Date(ev.start_date + "T12:00:00").getFullYear())
      );
      return next;
    });
  }, [filtered, hasActiveFilters]);

  /* Agrupa por ano e, dentro de cada ano, por mês/período */
  const groupedByYear = useMemo(() => {
    const yearMap = new Map<
      number,
      Map<string, { label: string; events: CalendarEventRow[] }>
    >();
    filtered.forEach(ev => {
      const year = new Date(ev.start_date + "T12:00:00").getFullYear();
      const key = getGroupKey(ev);
      const label = getGroupLabel(key, lang);
      if (!yearMap.has(year)) yearMap.set(year, new Map());
      const months = yearMap.get(year)!;
      if (!months.has(key)) months.set(key, { label, events: [] });
      months.get(key)!.events.push(ev);
    });
    return yearMap;
  }, [filtered, lang]);

  function toggleYear(year: number) {
    setOpenYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function expandAllYears() {
    setOpenYears(new Set(groupedByYear.keys()));
  }

  function collapseAllYears() {
    setOpenYears(new Set());
  }

  return (
    <PageShell
      title={t.nav.calendar}
      subtitle={cp.subtitle}
      breadcrumbs={[{ label: t.nav.calendar }]}>
      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-consudes-dark-body dark:bg-none py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60vh]">
          {/* Intro */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-consudes-gold mb-2">
              {dataLoading
                ? "\u2026"
                : `${events.length} ${cp.eventsLabel} · 2025–2030`}
            </p>
            <p className="text-lg sm:text-2xl font-['Cormorant_Garamond'] font-semibold text-consudes-blue-text dark:text-white leading-snug whitespace-nowrap">
              {cp.introHeadline}
            </p>
          </div>

          {/* Calendário Quadrienal Proposto */}
          <div className="mb-8 rounded-xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/70 dark:bg-violet-500/5 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-500/10 shrink-0">
                <CalendarDays
                  className="w-5 h-5 text-violet-700 dark:text-violet-300"
                  aria-hidden="true"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-[10px] font-bold tracking-widest uppercase">
                    {cp.quadrennial.badge}
                  </span>

                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {cp.quadrennial.period}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#003B73] dark:text-white mb-2">
                  {cp.quadrennial.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cp.quadrennial.description}
                </p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl mb-8 shadow-sm overflow-hidden">
            {/* Busca */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/5">
              <Search
                className="w-3.5 h-3.5 text-slate-400 shrink-0"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={cp.searchPlaceholder}
                aria-label={cp.searchPlaceholder}
                className="flex-1 bg-transparent text-sm text-[#1F2937] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  className="shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={cp.clearSearchLabel}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pills de filtro */}
            <div className="flex flex-col gap-4 p-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  {cp.filterYear}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    active={activeYears.size === 0}
                    onClick={() => setActiveYears(new Set())}>
                    {cp.all}
                  </FilterPill>
                  {allYears.map(year => (
                    <FilterPill
                      key={year}
                      active={activeYears.has(year)}
                      onClick={() => toggleInSet(setActiveYears, year)}>
                      {year}
                    </FilterPill>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  <Filter className="w-3 h-3" />
                  {cp.filterCategory}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill
                    active={activeCategories.size === 0}
                    onClick={() => setActiveCategories(new Set())}>
                    {cp.all}
                  </FilterPill>
                  {allCategories.map(cat => (
                    <FilterPill
                      key={cat}
                      active={activeCategories.has(cat)}
                      onClick={() => toggleInSet(setActiveCategories, cat)}>
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
                  <FilterPill
                    active={activeStatuses.size === 0}
                    onClick={() => setActiveStatuses(new Set())}>
                    {cp.all}
                  </FilterPill>
                  {allStatuses.map(s => (
                    <FilterPill
                      key={s}
                      active={activeStatuses.has(s)}
                      onClick={() => toggleInSet(setActiveStatuses, s)}>
                      {ac.eventStatuses[s]}
                    </FilterPill>
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="border-t border-slate-100 dark:border-white/5 pt-3 flex flex-col gap-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {filtered.length}{" "}
                    {filtered.length === 1
                      ? cp.monthEvents
                      : cp.monthEventsPlural}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeFilterChips.map(chip => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={chip.onRemove}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors">
                        {chip.label}
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#003B73]/8 text-[#003B73] dark:bg-blue-500/10 dark:text-blue-400 border border-[#003B73]/15 dark:border-blue-500/20 hover:bg-[#003B73]/15 dark:hover:bg-blue-500/20 transition-all">
                      <X className="w-3 h-3" />
                      {cp.clearFilters}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista */}
          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-28 bg-white dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={
                <CalendarDays className="w-7 h-7 text-slate-300 dark:text-slate-600" />
              }
              title={cp.noEvents}
              description={cp.noEventsDesc}
            />
          ) : (
            <>
              {/* Expandir/Recolher tudo */}
              <div className="flex items-center justify-end gap-3 mb-3">
                <button
                  type="button"
                  onClick={expandAllYears}
                  className="text-xs font-semibold text-[#003B73] dark:text-blue-300 hover:underline">
                  {cp.expandAll}
                </button>
                <span
                  className="text-slate-300 dark:text-slate-600"
                  aria-hidden="true">
                  ·
                </span>
                <button
                  type="button"
                  onClick={collapseAllYears}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:underline">
                  {cp.collapseAll}
                </button>
              </div>

              <div className="space-y-3">
                {Array.from(groupedByYear.entries()).map(([year, months]) => {
                  const yearCount = Array.from(months.values()).reduce(
                    (sum, m) => sum + m.events.length,
                    0
                  );
                  return (
                    <YearSection
                      key={year}
                      year={year}
                      count={yearCount}
                      open={openYears.has(year)}
                      onToggle={() => toggleYear(year)}>
                      {Array.from(months.entries()).map(
                        ([key, { label, events: evs }]) => (
                          <div key={key}>
                            <MonthHeader
                              label={label}
                              count={evs.length}
                              events={evs}
                            />
                            <div className="space-y-3 mt-2">
                              {evs.map(ev => (
                                <EventCard key={ev.id} event={ev} />
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </YearSection>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
