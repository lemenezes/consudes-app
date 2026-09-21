import { supabase } from "../lib/supabase";
import type { ReportRow, ReportCategory, Lang } from "../lib/database.aliases";

export type ReportPublicItem = Pick<
  ReportRow,
  | "id"
  | "title"
  | "slug"
  | "description"
  | "category"
  | "year"
  | "doc_date"
  | "file_url"
>;

function getLocalizedField(
  row: ReportRow,
  baseField: "title" | "description",
  lang: Lang
): string | null {
  const byLang = {
    title: {
      pt: row.title_pt,
      es: row.title_es,
      en: row.title_en
    },
    description: {
      pt: row.description_pt,
      es: row.description_es,
      en: row.description_en
    }
  };

  const localized = byLang[baseField][lang];

  if (localized) {
    return localized;
  }

  const original = byLang[baseField][row.lang];

  if (original) {
    return original;
  }

  return row[baseField];
}

/**
 * Resolve title/description para o idioma pedido.
 * Cadeia:
 * idioma solicitado -> idioma original -> coluna legada.
 */
function normalizeReportRow(row: ReportRow, lang: Lang): ReportRow {
  return {
    ...row,
    title: getLocalizedField(row, "title", lang) ?? row.title,
    description: getLocalizedField(row, "description", lang)
  };
}

export async function listPublishedReports(filters?: {
  year?: number;
  category?: ReportCategory;
  lang?: Lang;
}): Promise<{
  data: ReportPublicItem[];
  error: string | null;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from("reports")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false })
    .order("doc_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.year) {
    query = query.eq("year", filters.year);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: [],
      error: error.message
    };
  }

  const lang = filters?.lang ?? "es";

  // DEBUG TEMPORÁRIO
  console.log("[REPORT DEBUG]", {
    lang,
    reports: ((data as ReportRow[]) ?? []).map(row => ({
      id: row.id,
      lang: row.lang,

      title: row.title,
      title_pt: row.title_pt,
      title_es: row.title_es,
      title_en: row.title_en,

      description: row.description,
      description_pt: row.description_pt,
      description_es: row.description_es,
      description_en: row.description_en
    }))
  });

  const normalized = ((data as ReportRow[]) ?? []).map(row =>
    normalizeReportRow(row, lang)
  );

  // DEBUG TEMPORÁRIO
  console.log(
    "[REPORT NORMALIZED]",
    normalized.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description
    }))
  );

  return {
    data: normalized as ReportPublicItem[],
    error: null
  };
}
