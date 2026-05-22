// Reutiliza o client já configurado do projeto
import { supabase } from '../lib/supabase';

export interface UploadReportPdfResult {
  url: string;
  key: string;
}

export async function uploadReportPdfToR2(file: File, year: number, slug?: string): Promise<UploadReportPdfResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('year', String(year));
  if (slug) formData.append('slug', slug);

  const { data, error } = await supabase.functions.invoke('upload-report-pdf', {
    body: formData,
  });

  if (error || !data || !data.url) {
    throw new Error(data?.error || error?.message || 'Falha ao enviar PDF');
  }
  return data as UploadReportPdfResult;
}
