// Reutiliza o client já configurado do projeto

export interface UploadReportPdfResult {
  url: string;
  key: string;
}

export async function uploadReportPdfToR2(file: File, year: number, slug?: string): Promise<UploadReportPdfResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('year', String(year));
  if (slug) formData.append('slug', slug);

  const res = await fetch('/api/upload-report-pdf', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data?.url) {
    throw new Error(data?.error || 'Falha ao enviar PDF');
  }
  return data as UploadReportPdfResult;
}
