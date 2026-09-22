import { supabase } from "../lib/supabase";
import type {
  CalendarEventRow,
  CalendarEventCategory,
  CalendarEventType,
  CalendarEventStatus,
  DatePrecision,
  PublishStatus,
  Lang
} from "../lib/database.aliases";

// ── Tipos públicos ─────────────────────────────────────────────────────────

export interface CalendarEventFormData {
  title: string;
  slug: string;
  description: string;
  full_description: string;
  lang: Lang;
  title_pt: string;
  title_es: string;
  title_en: string;
  description_pt: string;
  description_es: string;
  description_en: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD ou ''
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
  title: "",
  slug: "",
  description: "",
  full_description: "",
  lang: "es",
  title_pt: "",
  title_es: "",
  title_en: "",
  description_pt: "",
  description_es: "",
  description_en: "",
  start_date: "",
  end_date: "",
  date_precision: "full",
  country: "",
  city: "",
  venue: "",
  location_open: false,
  sport: "Fútbol Sala",
  category: "outro",
  event_type: "championship",
  event_status: "upcoming",
  federation: "",
  link: "",
  cover_url: "",
  status: "draft",
  featured: false,
  sort_order: 0
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Gera slug a partir do título */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function nullify(
  v: string | boolean | number
): string | boolean | number | null {
  if (typeof v === "string") return v.trim() === "" ? null : v.trim();
  return v;
}

function getLocalizedField(
  form: CalendarEventFormData,
  field: "title" | "description",
  lang: Lang
): string {
  if (field === "title") {
    return lang === "pt"
      ? form.title_pt
      : lang === "en"
        ? form.title_en
        : form.title_es;
  }
  return lang === "pt"
    ? form.description_pt
    : lang === "en"
      ? form.description_en
      : form.description_es;
}

/** Sincroniza title/description legados com o idioma original, para compatibilidade. */
function withLegacyCompatibility(
  form: CalendarEventFormData
): CalendarEventFormData {
  const original = form.lang;
  return {
    ...form,
    title: getLocalizedField(form, "title", original),
    description: getLocalizedField(form, "description", original)
  };
}

function toPayload(form: CalendarEventFormData) {
  const payload = withLegacyCompatibility(form);
  return {
    title: payload.title.trim(),
    slug: payload.slug.trim(),
    description: nullify(payload.description) as string | null,
    full_description: nullify(payload.full_description) as string | null,
    lang: payload.lang,
    title_pt: nullify(payload.title_pt) as string | null,
    title_es: nullify(payload.title_es) as string | null,
    title_en: nullify(payload.title_en) as string | null,
    description_pt: nullify(payload.description_pt) as string | null,
    description_es: nullify(payload.description_es) as string | null,
    description_en: nullify(payload.description_en) as string | null,
    start_date: payload.start_date,
    end_date: payload.end_date.trim() ? payload.end_date : null,
    date_precision: payload.date_precision,
    country: payload.country.trim(),
    city: nullify(payload.city) as string | null,
    venue: nullify(payload.venue) as string | null,
    location_open: payload.location_open,
    sport: payload.sport.trim(),
    category: payload.category,
    event_type: payload.event_type,
    event_status: payload.event_status,
    federation: nullify(payload.federation) as string | null,
    link: nullify(payload.link) as string | null,
    cover_url: nullify(payload.cover_url) as string | null,
    status: payload.status,
    featured: payload.featured,
    sort_order: payload.sort_order
  };
}

function getLocalizedRowField(
  row: CalendarEventRow,
  baseField: "title" | "description",
  lang: Lang
): string | null {
  const byLang = {
    title: { pt: row.title_pt, es: row.title_es, en: row.title_en },
    description: {
      pt: row.description_pt,
      es: row.description_es,
      en: row.description_en
    }
  };
  const localized = byLang[baseField][lang];
  if (localized) return localized;
  const original = byLang[baseField][row.lang];
  if (original) return original;
  return row[baseField];
}

/**
 * Resolve title/description para o idioma pedido.
 * Cadeia: campo do idioma solicitado -> campo do idioma original -> coluna legada.
 */
export function normalizeCalendarEventRow(
  row: CalendarEventRow,
  lang: Lang
): CalendarEventRow {
  return {
    ...row,
    title: getLocalizedRowField(row, "title", lang) ?? row.title,
    description: getLocalizedRowField(row, "description", lang)
  };
}

// ── Queries — Admin ────────────────────────────────────────────────────────

/** Lista todos os eventos (autenticado) — mais recentes primeiro */
export async function listCalendarEvents(): Promise<{
  data: CalendarEventRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_date", { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data as CalendarEventRow[], error: null };
}

/** Busca evento por ID */
export async function getCalendarEventById(id: string): Promise<{
  data: CalendarEventRow | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Cria novo evento */
export async function createCalendarEvent(
  form: CalendarEventFormData
): Promise<{
  data: CalendarEventRow | null;
  error: string | null;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("calendar_events")
    .insert(toPayload(form))
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Atualiza evento existente */
export async function updateCalendarEvent(
  id: string,
  form: CalendarEventFormData
): Promise<{ data: CalendarEventRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("calendar_events")
    .update(toPayload(form))
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as CalendarEventRow, error: null };
}

/** Altera status de publicação */
export async function setCalendarEventStatus(
  id: string,
  status: PublishStatus
): Promise<{ error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("calendar_events")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}

/** Apaga evento permanentemente */
export async function deleteCalendarEvent(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}

// ── Queries — Público ──────────────────────────────────────────────────────

/**
 * Lista eventos publicados, ordenados por data de início.
 * title/description são normalizados para o idioma pedido; padrão 'es' preserva comportamento anterior.
 */
export async function listPublishedCalendarEvents(lang: Lang = "es"): Promise<{
  data: CalendarEventRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("status", "published")
    .order("start_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) return { data: [], error: error.message };
  const normalized = ((data as CalendarEventRow[]) ?? []).map(row =>
    normalizeCalendarEventRow(row, lang)
  );
  return { data: normalized, error: null };
}
