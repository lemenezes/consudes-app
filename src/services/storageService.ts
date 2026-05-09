import { supabase } from '../lib/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  url: string | null;
  error: string | null;
}

/** Valida o arquivo antes do upload */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato não suportado. Use JPG, PNG ou WebP.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Arquivo muito grande. Máximo 5 MB.';
  }
  return null;
}

/** Gera nome único para o arquivo no bucket */
function buildFileName(file: File, folder: string): string {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${folder}/${ts}-${rand}.${ext}`;
}

/**
 * Faz upload de uma imagem para um bucket do Supabase Storage.
 * Retorna a URL pública do arquivo ou uma mensagem de erro.
 */
export async function uploadImage(
  file: File,
  bucket: string,
  folder: string = 'covers',
): Promise<UploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) return { url: null, error: validationError };

  const path = buildFileName(file, folder);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) return { url: null, error: uploadError.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/**
 * Remove um arquivo do bucket dado sua URL pública.
 * Silencia erros (não bloqueia o fluxo principal).
 */
export async function deleteImageByUrl(bucket: string, publicUrl: string): Promise<void> {
  try {
    const url = new URL(publicUrl);
    // Path after /storage/v1/object/public/<bucket>/
    const prefix = `/storage/v1/object/public/${bucket}/`;
    const path = url.pathname.startsWith(prefix)
      ? url.pathname.slice(prefix.length)
      : null;

    if (!path) return;
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // silencioso
  }
}
