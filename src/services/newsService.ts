import { supabase } from "../lib/supabase";
import { deleteImageByUrl } from "./storageService";
import type { NewsRow, PublishStatus, Lang } from "../lib/database.aliases";

export interface NewsFormData {
  slug: string;
  cover_url: string;
  original_language: Lang;
  title_pt: string;
  title_es: string;
  title_en: string;
  excerpt_pt: string;
  excerpt_es: string;
  excerpt_en: string;
  content_pt: string;
  content_es: string;
  content_en: string;
  // Compatibilidade temporária com modelo legado
  title: string;
  excerpt: string;
  content: string;
  lang: Lang;
  status: PublishStatus;
}

function getLocalizedField(
  form: NewsFormData,
  field: "title" | "excerpt" | "content",
  lang: Lang
): string {
  if (field === "title") {
    return lang === "pt"
      ? form.title_pt
      : lang === "en"
        ? form.title_en
        : form.title_es;
  }
  if (field === "excerpt") {
    return lang === "pt"
      ? form.excerpt_pt
      : lang === "en"
        ? form.excerpt_en
        : form.excerpt_es;
  }
  return lang === "pt"
    ? form.content_pt
    : lang === "en"
      ? form.content_en
      : form.content_es;
}

function withLegacyCompatibility(form: NewsFormData): NewsFormData {
  const original = form.original_language;
  return {
    ...form,
    title: getLocalizedField(form, "title", original),
    excerpt: getLocalizedField(form, "excerpt", original),
    content: getLocalizedField(form, "content", original),
    lang: original
  };
}

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

// ── Queries ────────────────────────────────────────────────────────────────

/** Lista todas as notícias ordenadas por data de criação */
export async function listNews(): Promise<{
  data: NewsRow[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data as NewsRow[], error: null };
}

/** Busca notícia por ID */
export async function getNewsById(
  id: string
): Promise<{ data: NewsRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Cria nova notícia */
export async function createNews(
  form: NewsFormData
): Promise<{ data: NewsRow | null; error: string | null }> {
  const payload = withLegacyCompatibility(form);
  const published_at =
    payload.status === "published" ? new Date().toISOString() : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("news")
    .insert({ ...payload, published_at })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Atualiza notícia existente */
export async function updateNews(
  id: string,
  form: NewsFormData,
  previousStatus: PublishStatus
): Promise<{ data: NewsRow | null; error: string | null }> {
  const payloadWithCompatibility = withLegacyCompatibility(form);
  const wasPublished = previousStatus === "published";
  const isPublishing =
    payloadWithCompatibility.status === "published" && !wasPublished;

  const published_at = isPublishing
    ? new Date().toISOString()
    : payloadWithCompatibility.status !== "published"
      ? null
      : undefined; // mantém valor existente

  const payload: Partial<NewsFormData & { published_at: string | null }> = {
    ...form
  };
  Object.assign(payload, payloadWithCompatibility);
  if (published_at !== undefined) payload.published_at = published_at;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("news")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Altera apenas o status de uma notícia */
export async function setNewsStatus(
  id: string,
  status: PublishStatus
): Promise<{ error: string | null }> {
  const published_at = status === "published" ? new Date().toISOString() : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("news")
    .update({ status, published_at })
    .eq("id", id);

  if (error) return { error: error.message };
  return { error: null };
}

/** Apaga notícia permanentemente e remove a imagem do Storage, se houver */
export async function deleteNews(
  id: string,
  coverUrl?: string | null
): Promise<{ error: string | null }> {
  // Remove imagem do bucket antes de apagar o registro
  if (coverUrl) {
    await deleteImageByUrl("cms-news", coverUrl);
  }

  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}
