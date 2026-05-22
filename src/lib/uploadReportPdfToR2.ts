// Reutiliza o client já configurado do projeto

export interface UploadReportPdfResult {
  url: string;
  key: string;
}

export async function uploadReportPdfToR2(file: File, year: number, slug?: string): Promise<UploadReportPdfResult> {
  // Envia PDF para o Worker simplificado
  const filename = slug || file.name;
  const endpoint = import.meta.env.VITE_REPORT_UPLOAD_ENDPOINT as string;
  const url = `${endpoint}?filename=${encodeURIComponent(filename)}&year=${encodeURIComponent(year)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/pdf',
    },
    body: file,
  });
  const data = await res.json();
  if (!res.ok || !data?.url || !data?.key) {
    throw new Error(data?.error || 'Falha ao enviar PDF');
  }
  return { url: data.url, key: data.key };
}
