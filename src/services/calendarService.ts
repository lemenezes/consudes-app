import { supabase } from '../lib/supabase';
import type {
  CalendarEventRow,
  CalendarEventCategory,
  CalendarEventType,
  CalendarEventStatus,
  DatePrecision,
  PublishStatus,
} from '../lib/database.aliases';

// ── Tipos públicos ─────────────────────────────────────────────────────────

export interface CalendarEventFormData {
  title: string;
  slug: string;
  description: string;
  full_description: string;
  start_date: string;        // YYYY-MM-DD
  end_date: string;          // YYYY-MM-DD ou ''
  date_precision: DatePrecision;
  country: string;
  city: string;
  venue: string;
  location_open: boolean;
  sport: string;
  category: CalendarEventCategory;
  event_type: CalendarEventType;
  event_status: CalendarEventStatus;
  federation: string;
  link: string;
  cover_url: string;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
}

export const EMPTY_FORM: CalendarEventFormData = {
  title: '',
  slug: '',
  description: '',
  full_description: '',
  start_date: '',
  end_date: '',
  date_precision: 'full',
  country: '',
  city: '',
  venue: '',
  location_open: false,
  sport: 'Fútbol Sala',
  category: 'outro',
  event_type: 'championship',
  event_status: 'upcoming',
  federation: '',
  link: '',
  cover_url: '',
  status: 'draft',
  featured: false,
  sort_order: 0,
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Gera slug a partir do título */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function nullify(v: string | boolean | number): string | boolean | number | null {
  if (typeof v === 'string') return v.trim() === '' ? null : v.trim();
  return v;
}

function toPayload(form: CalendarEventFormData) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    description: nullify(form.description) as string | null,
    full_description: nullify(form.full_description) as string | null,
    start_date: form.start_date,
    end_date: form.end_date.trim() ? form.end_date : null,
    date_precision: form.date_precision,
    country: form.country.trim(),
    city: nullify(form.city) as string | null,
    venue: nullify(form.venue) as string | null,
    location_open: form.location_open,
    sport: form.sport.trim(),
    category: form.category,
    event_type: form.event_type,
    event_status: form.event_status,
    federation: nullify(form.federation) as string | null,
    link: nullify(form.link) as string | null,
    cover_url: nullify(form.cover_url) as string | null,
    status: form.status,
    featured: form.featured,
    sort_order: form.sort_order,
  };
}

// ── Queries — Admin ────────────────────────────────────────────────────────

/** Lista todos os eventos (autenticado) — mais recentes primeiro */
export async function listCalendarEvents(): Promise<{
  data: CalendarEventRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data as CalendarEventRow[], error: null };
}

/** Busca evento por ID */
export async function getCalendarEventById(id: string): Promise<{
  data: CalendarEventRow | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Cria novo evento */
export async function createCalendarEvent(form: CalendarEventFormData): Promise<{
  data: CalendarEventRow | null;
  error: string | null;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('calendar_events')
    .insert(toPayload(form))
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Atualiza evento existente */
export async function updateCalendarEvent(
  id: string,
  form: CalendarEventFormData,
): Promise<{ data: CalendarEventRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('calendar_events')
    .update(toPayload(form))
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Altera status de publicação */
export async function setCalendarEventStatus(
  id: string,
  status: PublishStatus,
): Promise<{ error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('calendar_events')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  return { error: null };
}

/** Apaga evento permanentemente */
export async function deleteCalendarEvent(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('calendar_events')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { error: null };
}

// ── Queries — Público ──────────────────────────────────────────────────────

/** Lista eventos publicados, ordenados por data de início */
export async function listPublishedCalendarEvents(): Promise<{
  data: CalendarEventRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data as CalendarEventRow[], error: null };
}
