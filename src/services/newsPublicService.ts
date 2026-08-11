import { supabase } from "../lib/supabase";
import type { NewsRow, Lang } from "../lib/database.aliases";

/** Campos que o site público precisa (title/content já normalizados para o idioma ativo) */
export type NewsListItem = Pick<
  NewsRow,
  | "id"
  | "title"
  | "slug"
  | "cover_url"
  | "lang"
  | "original_language"
  | "published_at"
  | "content"
>;

function getLocalizedField(
  row: NewsRow,
  baseField: "title" | "excerpt" | "content",
  lang: Lang
): string | null {
  const byLang = {
    title: {
      pt: row.title_pt,
      es: row.title_es,
      en: row.title_en
    },
    excerpt: {
      pt: row.excerpt_pt,
      es: row.excerpt_es,
      en: row.excerpt_en
    },
    content: {
      pt: row.content_pt,
      es: row.content_es,
      en: row.content_en
    }
  };

  const localized = byLang[baseField][lang];
  if (localized) return localized;

  const original = byLang[baseField][row.original_language];
  if (original) return original;

  return row[baseField];
}

/**
 * Resolve title/excerpt/content para o idioma pedido.
 * Cadeia: campo do idioma solicitado -> campo do idioma original -> coluna legada.
 */
function normalizeNewsRow(row: NewsRow, lang: Lang): NewsRow {
  return {
    ...row,
    title: getLocalizedField(row, "title", lang) ?? row.title,
    excerpt: getLocalizedField(row, "excerpt", lang),
    content: getLocalizedField(row, "content", lang)
  };
}

/**
 * Retorna notícias publicadas, ordenadas da mais recente à mais antiga.
 * title/content são normalizados para o idioma pedido; padrão 'es' preserva comportamento anterior.
 */
export async function listPublishedNews(
  limit?: number,
  lang: Lang = "es"
): Promise<{ data: NewsListItem[]; error: string | null }> {
  let query = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };

  const normalized = ((data as NewsRow[]) ?? []).map(row =>
    normalizeNewsRow(row, lang)
  );
  return { data: normalized as NewsListItem[], error: null };
}

/**
 * Retorna uma notícia publicada pelo slug.
 * title/excerpt/content são normalizados para o idioma pedido; padrão 'es' preserva comportamento anterior.
 */
export async function getPublishedNewsBySlug(
  slug: string,
  lang: Lang = "es"
): Promise<{ data: NewsRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return { data: null, error: error.message };
  return { data: normalizeNewsRow(data as NewsRow, lang), error: null };
}
