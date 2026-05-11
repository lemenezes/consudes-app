import { supabase } from '../lib/supabase';
import type { ReportRow, ReportCategory } from '../lib/database.types';

export type ReportPublicItem = Pick<
  ReportRow,
  'id' | 'title' | 'slug' | 'description' | 'category' | 'year' | 'doc_date' | 'file_url' | 'featured' | 'sort_order'
>;

export async function listPublishedReports(filters?: {
  year?: number;
  category?: ReportCategory;
}): Promise<{ data: ReportPublicItem[]; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('reports')
    .select('id, title, slug, description, category, year, doc_date, file_url, featured, sort_order, created_at')
    .eq('status', 'published')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (filters?.year) query = query.eq('year', filters.year);
  if (filters?.category) query = query.eq('category', filters.category);

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data as ReportPublicItem[]) ?? [], error: null };
}
