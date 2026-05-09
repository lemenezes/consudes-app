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
 * Verifica se uma URL pertence ao Supabase Storage (não é URL manual).
 * Checa apenas pelo padrão da URL — independente de variáveis de ambiente.
 */
export function isStorageUrl(url: string, bucket: string): boolean {
  return url.includes(`/storage/v1/object/public/${bucket}/`);
}

/**
 * Extrai o path relativo de uma URL pública do Supabase Storage.
 * Ex: "covers/1234-abc.jpg"
 * Retorna null se a URL não for do Storage.
 */
export function extractStoragePath(bucket: string, publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const prefix = `/storage/v1/object/public/${bucket}/`;
    if (!url.pathname.startsWith(prefix)) return null;
    const path = url.pathname.slice(prefix.length);
    return path || null;
  } catch {
    return null;
  }
}

/**
 * Remove um arquivo do bucket dado sua URL pública.
 * Retorna erro se a remoção falhar.
 */
export async function deleteImageByUrl(
  bucket: string,
  publicUrl: string,
): Promise<{ error: string | null }> {
  const path = extractStoragePath(bucket, publicUrl);
  if (!path) return { error: null };

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: error.message };
  return { error: null };
}
