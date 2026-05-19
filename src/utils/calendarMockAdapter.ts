import { calendarEvents as mockEvents } from '../data/calendarData';
import type { CalendarEventRow, CalendarEventType, CalendarEventStatus, CalendarEventCategory } from '../lib/database.types';

/**
 * Converte um evento mock para o formato CalendarEventRow (usado como fallback).
 */
export function mockToRow(m: (typeof mockEvents)[number]): CalendarEventRow {
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
