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
import { supabase } from '../lib/supabase';
import type { ReportRow, PublishStatus, ReportCategory } from '../lib/database.aliases';

export interface ReportFormData {
  title: string;
  slug: string;
  description: string;
  category: ReportCategory;
  year: number;
  doc_date: string;
  file_url: string;
  status: PublishStatus;
  // campos removidos: featured, sort_order
}
export const REPORT_CATEGORIES: { value: ReportCategory; label: string }[] = [
    // campos removidos: featured, sort_order
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
    .order('doc_date', { ascending: false })
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
      year: Number(form.year),
      doc_date: form.doc_date || null,
      description: form.description || null,
      file_url: form.file_url || null,
    })
    .select()
    .single();

  if (error) return { data: null, error: `${error.message}${error.details ? ' — ' + error.details : ''}${error.hint ? ' — ' + error.hint : ''}` };
  return { data: data as ReportRow, error: null };
}

export async function updateReport(
  id: string,
  form: ReportFormData,
): Promise<{ data: ReportRow | null; error: string | null }> {
  const { data, error } = await (supabase as any)
    .from('reports')
    .update({
      ...form,
      year: Number(form.year),
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
  // Remove o PDF do R2 via Worker se houver URL
  if (fileUrl) {
    try {
      // Extrai key do CDN
      // Exemplo: https://cdn.consudes.leandrom.com.br/reports/documents/2026/arquivo.pdf
      const url = new URL(fileUrl);
      const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
      if (key.startsWith('reports/documents/')) {
        const endpoint = import.meta.env.VITE_REPORT_UPLOAD_ENDPOINT as string;
        const delUrl = `${endpoint}?key=${encodeURIComponent(key)}`;
        const res = await fetch(delUrl, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) {
          // Não quebra exclusão, apenas loga
          console.warn('Falha ao deletar PDF no R2:', await res.text());
        }
      }
    } catch (err) {
      // Falha silenciosa — continua excluindo o registro
      console.warn('Erro ao tentar deletar PDF no R2:', err);
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

import { uploadReportPdfToR2 } from '../lib/uploadReportPdfToR2';

export async function uploadReportPdf(
  file: File,
  year?: number,
  slug?: string
): Promise<{ url: string | null; error: string | null }> {
  const err = validatePdfFile(file);
  if (err) return { url: null, error: err };
  try {
    const { url } = await uploadReportPdfToR2(file, year ?? new Date().getFullYear(), slug);
    return { url, error: null };
  } catch (e: any) {
    return { url: null, error: e.message || 'Falha ao enviar PDF' };
  }
}
