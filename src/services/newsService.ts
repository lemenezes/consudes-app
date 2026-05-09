import { supabase } from '../lib/supabase';
import type { NewsRow, PublishStatus, Lang } from '../lib/database.types';

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  lang: Lang;
  status: PublishStatus;
}

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

// ── Queries ────────────────────────────────────────────────────────────────

/** Lista todas as notícias ordenadas por data de criação */
export async function listNews(): Promise<{ data: NewsRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data as NewsRow[], error: null };
}

/** Busca notícia por ID */
export async function getNewsById(id: string): Promise<{ data: NewsRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Cria nova notícia */
export async function createNews(
  form: NewsFormData,
): Promise<{ data: NewsRow | null; error: string | null }> {
  const published_at =
    form.status === 'published' ? new Date().toISOString() : null;

  const { data, error } = await supabase
    .from('news')
    .insert({ ...form, published_at })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Atualiza notícia existente */
export async function updateNews(
  id: string,
  form: NewsFormData,
  previousStatus: PublishStatus,
): Promise<{ data: NewsRow | null; error: string | null }> {
  const wasPublished = previousStatus === 'published';
  const isPublishing = form.status === 'published' && !wasPublished;

  const published_at = isPublishing
    ? new Date().toISOString()
    : form.status !== 'published'
    ? null
    : undefined; // mantém valor existente

  const payload: Partial<NewsFormData & { published_at: string | null }> = { ...form };
  if (published_at !== undefined) payload.published_at = published_at;

  const { data, error } = await supabase
    .from('news')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}

/** Altera apenas o status de uma notícia */
export async function setNewsStatus(
  id: string,
  status: PublishStatus,
): Promise<{ error: string | null }> {
  const published_at =
    status === 'published' ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('news')
    .update({ status, published_at })
    .eq('id', id);

  if (error) return { error: error.message };
  return { error: null };
}

/** Apaga notícia permanentemente */
export async function deleteNews(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}
