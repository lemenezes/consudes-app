// Reutiliza o client já configurado do projeto

export interface UploadReportPdfResult {
  url: string;
  key: string;
}

export async function uploadReportPdfToR2(file: File, year: number, slug?: string): Promise<UploadReportPdfResult> {
  // 1. Solicita signed URL
  const filename = slug || file.name;
  const contentType = file.type || 'application/pdf';
  const res = await fetch('/api/create-report-upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, year, contentType }),
  });
  const data = await res.json();
  if (!res.ok || !data?.signedUrl || !data?.publicUrl) {
    throw new Error(data?.error || 'Falha ao obter signed URL');
  }

  // 2. Faz upload direto para o signedUrl
  const putRes = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
    body: file,
  });
  if (!putRes.ok) {
    throw new Error('Falha ao enviar PDF para R2');
  }

  // 3. Retorna publicUrl para salvar no Supabase
  return { url: data.publicUrl, key: data.key };
}
