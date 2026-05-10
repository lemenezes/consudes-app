import { useState, useMemo } from 'react';
import {
  MapPin,
  HelpCircle,
  ExternalLink,
  CalendarDays,
  Trophy,
  Users,
  Filter,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import EmptyState from '../components/EmptyState';
import {
  calendarEvents,
  type EventType,
  type EventStatus,
  type DatePrecision,
} from '../data/calendarData';

/* ── Helpers de locale ───────────────────────────────────────────── */
function getLocale(lang: string) {
  return lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
}

/* ── Bloco de data lateral ───────────────────────────────────────── */
interface DateBlock { primary: string; secondary: string | null }

function getDateBlock(
  startDate: string,
  endDate: string,
  precision: DatePrecision,
  lang: string,
): DateBlock {
  const locale = getLocale(lang);
  const s = new Date(startDate + 'T12:00:00');
  const e = new Date(endDate   + 'T12:00:00');

  if (precision === 'full') {
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    const dayPrimary = sameMonth && startDate !== endDate
      ? `${s.getDate()}–${e.getDate()}`
      : String(s.getDate());
    return {
      primary:   dayPrimary,
      secondary: s.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
    };
  }

  if (precision === 'month') {
    return {
      primary:   s.toLocaleDateString(locale, { month: 'short' }).toUpperCase().replace('.', ''),
      secondary: String(s.getFullYear()),
    };
  }

  return { primary: String(s.getFullYear()), secondary: null };
}

/* ── Texto de data legível ───────────────────────────────────────── */
function formatDateRange(
  startDate: string,
  endDate: string,
  precision: DatePrecision,
  lang: string,
): string {
  const locale = getLocale(lang);
  const s = new Date(startDate + 'T12:00:00');
  const e = new Date(endDate   + 'T12:00:00');

  if (precision === 'year')  return String(s.getFullYear());
  if (precision === 'month') return s.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  if (startDate === endDate)
    return s.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  return sameMonth
    ? `${s.getDate()}–${e.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}`
    : `${s.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

/* ── Chave + rótulo de agrupamento ───────────────────────────────── */
function getGroupKey(ev: typeof calendarEvents[number]): string {
  const d = new Date(ev.startDate + 'T12:00:00');
  if (ev.datePrecision === 'year') return `year:${d.getFullYear()}`;
  return `month:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getGroupLabel(key: string, lang: string): string {
  const locale = getLocale(lang);
  if (key.startsWith('year:')) return key.replace('year:', '');
  const datePart = key.replace('month:', '');
  const [year, month] = datePart.split('-');
  return new Date(Number(year), Number(month) - 1, 1)
    .toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

/* ── Configurações visuais ───────────────────────────────────────── */
const typeBorderColor: Record<EventType, string> = {
  championship:  'border-l-[#003B73]',
  interclubs:    'border-l-[#D9A441]',
  congress:      'border-l-indigo-600',
  assembly:      'border-l-cyan-600',
  institutional: 'border-l-emerald-600',
};

const typeIcon: Record<EventType, React.ReactNode> = {
  championship:  <Trophy   className="w-3.5 h-3.5" />,
  interclubs:    <Users    className="w-3.5 h-3.5" />,
  congress:      <Trophy   className="w-3.5 h-3.5" />,
  assembly:      <Trophy   className="w-3.5 h-3.5" />,
  institutional: <Trophy   className="w-3.5 h-3.5" />,
};

const categoryBadgeStyle: Record<string, string> = {
  'Interclubes': 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  'Sub-21':      'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  'Adulto':      'bg-blue-50 text-[#003B73] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
};

const statusBadgeStyle: Record<EventStatus, string> = {
  upcoming:          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  registrationsOpen: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  confirmed:         'bg-blue-100 text-[#003B73] dark:bg-blue-900/30 dark:text-blue-400',
  finished:          'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

/* ── Pill de filtro ──────────────────────────────────────────────── */
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
function EventCard({ event }: { event: typeof calendarEvents[number] }) {
  const { t, lang } = useLanguage();
  const cp = t.calendarPage;

  const dateBlock = getDateBlock(event.startDate, event.endDate, event.datePrecision, lang);
  const dateRange = formatDateRange(event.startDate, event.endDate, event.datePrecision, lang);
  const catStyle  = event.category
    ? (categoryBadgeStyle[event.category] ?? 'bg-slate-100 text-slate-600 border border-slate-200')
    : '';

  return (
    <article
      className={`
        group flex bg-white dark:bg-white/[0.03] rounded-xl
        border border-slate-200 dark:border-white/10
        border-l-4 ${typeBorderColor[event.type]}
        shadow-sm hover:shadow-md dark:hover:bg-white/[0.06]
        transition-all duration-200 overflow-hidden
      `}
    >
      {/* Bloco de data */}
      <div className="hidden sm:flex flex-col items-center justify-center min-w-[80px] px-4 py-5 bg-slate-50 dark:bg-white/[0.03] border-r border-slate-100 dark:border-white/5 select-none">
        <span
          className={`font-bold text-[#003B73] dark:text-white leading-none ${
            event.datePrecision === 'full'  ? 'text-2xl' :
            event.datePrecision === 'month' ? 'text-lg'  : 'text-xl'
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
          {event.category && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase ${catStyle}`}>
              {typeIcon[event.type]}
              {event.category}
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${statusBadgeStyle[event.status]}`}>
            {cp.statuses[event.status]}
          </span>
          <span className="text-[10px] font-medium text-[#D9A441] tracking-widest uppercase">
            {event.sport}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-base sm:text-lg font-semibold text-[#1F2937] dark:text-white leading-snug mb-1 group-hover:text-[#003B73] dark:group-hover:text-blue-300 transition-colors">
          {event.title}
        </h3>

        {/* Data (mobile) */}
        <p className="sm:hidden text-xs font-medium text-[#D9A441] mb-2">{dateRange}</p>

        {/* Localização */}
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mb-3">
          {event.locationOpen ? (
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

/* ── Separador de período ─────────────────────────────────────────── */
function PeriodSeparator({ label }: { label: string }) {
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

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus]     = useState<EventStatus | 'all'>('all');

  /* Categorias únicas na ordem em que aparecem nos dados */
  const allCategories = useMemo(() => {
    const seen = new Set<string>();
    calendarEvents.forEach((ev) => { if (ev.category) seen.add(ev.category); });
    return Array.from(seen);
  }, []);

  const allStatuses: EventStatus[] = ['finished', 'confirmed', 'upcoming', 'registrationsOpen'];

  const filtered = useMemo(() => calendarEvents.filter((ev) => {
    const matchCat    = activeCategory === 'all' || ev.category === activeCategory;
    const matchStatus = activeStatus   === 'all' || ev.status   === activeStatus;
    return matchCat && matchStatus;
  }), [activeCategory, activeStatus]);

  /* Agrupa preservando a ordem de inserção do array */
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; events: typeof filtered }>();
    filtered.forEach((ev) => {
      const key   = getGroupKey(ev);
      const label = getGroupLabel(key, lang);
      if (!map.has(key)) map.set(key, { label, events: [] });
      map.get(key)!.events.push(ev);
    });
    return map;
  }, [filtered, lang]);

  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.calendar}
        subtitle={cp.subtitle}
      />

      <section className="bg-gradient-to-b from-slate-50 to-blue-50/30 dark:bg-[#0d1624] dark:bg-none py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <div className="mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-[#D9A441] mb-2">
              {calendarEvents.length} {cp.eventsLabel} · 2025–2027
            </p>
            <p className="text-2xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] dark:text-white leading-snug whitespace-nowrap">
              {cp.introHeadline}
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-8 shadow-sm">
            <div className="flex flex-col gap-4">

              {/* Por categoria */}
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
                      {cat}
                    </FilterPill>
                  ))}
                </div>
              </div>

              {/* Por status */}
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
                      {cp.statuses[s]}
                    </FilterPill>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Lista */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="w-7 h-7 text-slate-300 dark:text-slate-600" />}
              title={cp.noEvents}
              description={cp.noEventsDesc}
            />
          ) : (
            <div className="space-y-2">
              {Array.from(grouped.values()).map(({ label, events }) => (
                <div key={label}>
                  <PeriodSeparator label={label} />
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
