// Utils de datas para o calendário institucional
import type { CalendarEventRow } from '../lib/database.aliases';

export function getLocale(lang: string) {
  return lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-AR';
}

export function getDateBlock(
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

export function formatDateRange(
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

export function getGroupKey(ev: CalendarEventRow) {
  const d = new Date(ev.start_date + 'T12:00:00');
  if (ev.date_precision === 'year') return `year:${d.getFullYear()}`;
  return `month:${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function getGroupLabel(key: string, lang: string): string {
  const locale = getLocale(lang);
  if (key.startsWith('year:')) return key.replace('year:', '');
  const [year, month] = key.replace('month:', '').split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}
