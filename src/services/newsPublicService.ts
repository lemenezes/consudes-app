import { supabase } from '../lib/supabase';
import type { NewsRow } from '../lib/database.aliases';

/** Campos que o site público precisa (sem content completo na listagem) */
export type NewsListItem = Pick<
  NewsRow,
  'id' | 'title' | 'slug' | 'cover_url' | 'lang' | 'published_at' | 'content'
>;

/**
 * Retorna notícias publicadas, ordenadas da mais recente à mais antiga.
 * @param limit  Máximo de resultados (padrão: sem limite)
 */
export async function listPublishedNews(
  limit?: number,
): Promise<{ data: NewsListItem[]; error: string | null }> {
  let query = supabase
    .from('news')
    .select('id, title, slug, cover_url, lang, published_at, content')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data as NewsListItem[]) ?? [], error: null };
}

/**
 * Retorna uma notícia publicada pelo slug (para a página de detalhe).
 */
export async function getPublishedNewsBySlug(
  slug: string,
): Promise<{ data: NewsRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as NewsRow, error: null };
}
