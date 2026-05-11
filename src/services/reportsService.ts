import { supabase } from '../lib/supabase';
import type { ReportRow, PublishStatus, ReportCategory } from '../lib/database.types';

export interface ReportFormData {
  title: string;
  slug: string;
  description: string;
  category: ReportCategory;
  year: number;
  doc_date: string;
  file_url: string;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

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

export const REPORT_CATEGORIES: { value: ReportCategory; label: string }[] = [
  { value: 'relatorio',        label: 'Relatório' },
  { value: 'estatuto',         label: 'Estatuto' },
  { value: 'regulamento',      label: 'Regulamento' },
  { value: 'ata',              label: 'Ata' },
  { value: 'prestacao_contas', label: 'Prestação de Contas' },
  { value: 'documento_oficial', label: 'Documento Oficial' },
];

export function categoryLabel(cat: ReportCategory): string {
  return REPORT_CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
}

// ── Admin queries ──────────────────────────────────────────────────────────

export async function listReports(): Promise<{ data: ReportRow[]; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reports')
    .select('*')
    .order('year', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data as ReportRow[]) ?? [], error: null };
}

export async function getReportById(id: string): Promise<{ data: ReportRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ReportRow, error: null };
}

export async function createReport(form: ReportFormData): Promise<{ data: ReportRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reports')
    .insert({
      ...form,
      doc_date: form.doc_date || null,
      description: form.description || null,
      file_url: form.file_url || null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ReportRow, error: null };
}

export async function updateReport(
  id: string,
  form: ReportFormData,
): Promise<{ data: ReportRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reports')
    .update({
      ...form,
      doc_date: form.doc_date || null,
      description: form.description || null,
      file_url: form.file_url || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ReportRow, error: null };
}

export async function setReportStatus(
  id: string,
  status: PublishStatus,
): Promise<{ error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('reports')
    .update({ status })
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function deleteReport(
  id: string,
  fileUrl?: string | null,
): Promise<{ error: string | null }> {
  // Remove o PDF do storage se houver URL
  if (fileUrl) {
    try {
      const url = new URL(fileUrl);
      const parts = url.pathname.split('/object/public/cms-reports/');
      if (parts[1]) {
        await supabase.storage.from('cms-reports').remove([parts[1]]);
      }
    } catch {
      // Falha silenciosa — continua excluindo o registro
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('reports').delete().eq('id', id);
  return { error: error?.message ?? null };
}

// ── PDF upload ─────────────────────────────────────────────────────────────

const MAX_PDF_SIZE = 20 * 1024 * 1024; // 20 MB

export function validatePdfFile(file: File): string | null {
  if (file.type !== 'application/pdf') return 'Apenas arquivos PDF são aceitos.';
  if (file.size > MAX_PDF_SIZE) return 'Arquivo muito grande. Máximo 20 MB.';
  return null;
}

export async function uploadReportPdf(
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  const err = validatePdfFile(file);
  if (err) return { url: null, error: err };

  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `documents/${ts}-${rand}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('cms-reports')
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: 'application/pdf' });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from('cms-reports').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
