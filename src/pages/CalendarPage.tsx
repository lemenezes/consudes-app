import { useState, useMemo } from 'react';
import {
  MapPin,
  ExternalLink,
  CalendarDays,
  Trophy,
  Users,
  BookOpen,
  Building2,
  Star,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import { calendarEvents, type EventType, type EventStatus } from '../data/calendarData';

/* ── Helpers de formatação de data ───────────────────────────────── */
function formatDateRange(start: string, end: string, lang: string): string {
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end + 'T12:00:00');
  if (start === end) {
    return s.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.getDate()}–${e.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  }
  return `${s.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function getDayMonth(dateStr: string, lang: string) {
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
  const d = new Date(dateStr + 'T12:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
    year: d.getFullYear(),
  };
}

/* ── Configurações visuais por tipo ──────────────────────────────── */
const typeIcons: Record<EventType, React.ReactNode> = {
  championship: <Trophy className="w-4 h-4" />,
  interclubs:   <Users className="w-4 h-4" />,
  congress:     <BookOpen className="w-4 h-4" />,
  assembly:     <Building2 className="w-4 h-4" />,
  institutional:<Star className="w-4 h-4" />,
};

const typeBorderColor: Record<EventType, string> = {
  championship: 'border-l-[#003B73]',
  interclubs:   'border-l-[#D9A441]',
  congress:     'border-l-indigo-600',
  assembly:     'border-l-cyan-600',
  institutional:'border-l-emerald-600',
};

const typeBadgeStyle: Record<EventType, string> = {
  championship: 'bg-blue-50 text-[#003B73] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  interclubs:   'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  congress:     'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
  assembly:     'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
  institutional:'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
};

const statusBadgeStyle: Record<EventStatus, string> = {
  upcoming:          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  registrationsOpen: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  confirmed:         'bg-blue-100 text-[#003B73] dark:bg-blue-900/30 dark:text-blue-400',
  finished:          'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

/* ── Pill button de filtro ─────────────────────────────────────────── */
function FilterPill({
  active,
  onClick,
  children,
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
          ? 'bg-[#003B73] text-white border-[#003B73] shadow-sm'
          : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-[#003B73]/40 hover:text-[#003B73] dark:hover:text-blue-300'
      }`}
    >
      {children}
    </button>
  );
}

/* ── Card de evento ──────────────────────────────────────────────── */
function EventCard({ event }: { event: (typeof calendarEvents)[number] }) {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;
  const { day, month } = getDayMonth(event.startDate, lang);
  const dateRange = formatDateRange(event.startDate, event.endDate, lang);
  const typeLabel = cp.types[event.type];
  const statusLabel = cp.statuses[event.status];

  return (
    <article
      className={`
        group flex gap-0 bg-white dark:bg-white/[0.03] rounded-xl border border-slate-200 dark:border-white/10
        border-l-4 ${typeBorderColor[event.type]}
        shadow-sm hover:shadow-md dark:hover:shadow-none dark:hover:bg-white/[0.06]
        transition-all duration-200 overflow-hidden
      `}
    >
      {/* Bloco de data */}
      <div className="hidden sm:flex flex-col items-center justify-center min-w-[80px] px-4 py-5 bg-slate-50 dark:bg-white/[0.03] border-r border-slate-100 dark:border-white/5 select-none">
        <span className="text-3xl font-bold text-[#003B73] dark:text-white leading-none">{day}</span>
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#D9A441] uppercase mt-1">{month}</span>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-5 min-w-0">
        {/* Cabeçalho com badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${typeBadgeStyle[event.type]}`}>
            {typeIcons[event.type]}
            {typeLabel}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${statusBadgeStyle[event.status]}`}>
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

        {/* Data visível em mobile */}
        <p className="sm:hidden text-xs font-medium text-[#D9A441] mb-2">{dateRange}</p>

        {/* Localização */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{event.city}, {event.country}</span>
          {event.federation && (
            <>
              <span className="mx-1">·</span>
              <span>{event.federation}</span>
            </>
          )}
        </div>

        {/* Descrição */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {event.description}
        </p>

        {/* Rodapé: data completa + link */}
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
              <span>Ver detalhes</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── Separador de mês ─────────────────────────────────────────────── */
function MonthSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 dark:text-slate-500 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

/* ── Componente principal ─────────────────────────────────────────── */
export default function CalendarPage() {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;

  const [activeType, setActiveType]     = useState<EventType | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<EventStatus | 'all'>('all');

  const allTypes: EventType[]   = ['championship', 'interclubs', 'congress', 'assembly', 'institutional'];
  const allStatuses: EventStatus[] = ['upcoming', 'registrationsOpen', 'confirmed', 'finished'];

  const filtered = useMemo(() => {
    return calendarEvents.filter((ev) => {
      const matchType   = activeType === 'all'   || ev.type   === activeType;
      const matchStatus = activeStatus === 'all' || ev.status === activeStatus;
      return matchType && matchStatus;
    });
  }, [activeType, activeStatus]);

  /* Agrupa por mês/ano para os separadores */
  const locale = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((ev) => {
      const d = new Date(ev.startDate + 'T12:00:00');
      const key = d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    });
    return map;
  }, [filtered, locale]);

  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.calendar}
        subtitle={cp.subtitle}
      />

      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-[#0d1624] dark:bg-none py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro institucional */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#D9A441] mb-2">
              {calendarEvents.length} eventos · 2026
            </p>
            <p className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] dark:text-white leading-snug max-w-lg">
              {cp.introHeadline}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col gap-4">
              {/* Filtro por tipo */}
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  <Filter className="w-3 h-3" />
                  {cp.filterType}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeType === 'all'} onClick={() => setActiveType('all')}>
                    {cp.all}
                  </FilterPill>
                  {allTypes.map((type) => (
                    <FilterPill key={type} active={activeType === type} onClick={() => setActiveType(type)}>
                      {cp.types[type]}
                    </FilterPill>
                  ))}
                </div>
              </div>

              {/* Filtro por status */}
              <div className="border-t border-slate-100 dark:border-white/5 pt-4">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-2.5">
                  {cp.filterStatus}
                </p>
                <div className="flex flex-wrap gap-2">
                  <FilterPill active={activeStatus === 'all'} onClick={() => setActiveStatus('all')}>
                    {cp.all}
                  </FilterPill>
                  {allStatuses.map((status) => (
                    <FilterPill key={status} active={activeStatus === status} onClick={() => setActiveStatus(status)}>
                      {cp.statuses[status]}
                    </FilterPill>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de eventos */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="w-7 h-7 text-slate-300 dark:text-slate-600" />}
              title={cp.noEvents}
              description={cp.noEventsDesc}
            />
          ) : (
            <div className="space-y-2">
              {Array.from(grouped.entries()).map(([monthLabel, events]) => (
                <div key={monthLabel}>
                  <MonthSeparator label={monthLabel} />
                  <div className="space-y-3 mt-3">
                    {events.map((ev) => (
                      <EventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
