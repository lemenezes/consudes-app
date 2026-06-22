const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = /^image\/(jpeg|png|webp|gif|avif)$/i;

export type GalleryUploadResult =
  | { ok: true; url: string; key: string; filename: string }
  | { ok: false; error: string };

/**
 * Valida arquivo de imagem no cliente antes do upload.
 * Retorna mensagem de erro se inválido, null se válido.
 */
export function validateGalleryImageFile(file: File): string | null {
  const normalizedType = file.type.split(";")[0].trim();
  if (!ALLOWED_IMAGE_TYPES.test(normalizedType)) {
    return "Formato não suportado. Use JPG, PNG, WebP, GIF ou AVIF.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "Arquivo muito grande. Máximo 10 MB.";
  }
  return null;
}

/**
 * Faz upload de uma imagem de galeria para o Worker R2.
 *
 * Query params: albumSlug, filename
 * Body: ArrayBuffer da imagem
 *
 * Retorna { ok: true, url, key, filename } ou { ok: false, error }.
 */
export async function uploadGalleryImage(
  albumSlug: string,
  file: File
): Promise<GalleryUploadResult> {
  const trimmedSlug = albumSlug.trim();
  if (!trimmedSlug) {
    return {
      ok: false,
      error: "Salve as informações do álbum antes de adicionar fotos."
    };
  }

  const validationError = validateGalleryImageFile(file);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const endpoint =
    (import.meta.env as Record<string, string>).VITE_GALLERY_UPLOAD_ENDPOINT ||
    "";
  if (!endpoint) {
    return {
      ok: false,
      error: "Endpoint de upload não configurado"
    };
  }

  try {
    const buffer = await file.arrayBuffer();
    const normalizedType = file.type.split(";")[0].trim();
    const url = new URL(endpoint);
    url.searchParams.set("albumSlug", trimmedSlug);
    url.searchParams.set("filename", file.name);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": normalizedType
      },
      body: buffer
    });

    if (!response.ok) {
      let errorMsg = "Falha ao enviar imagem";
      try {
        const data = await response.json();
        errorMsg = data.error || errorMsg;
      } catch {
        // Se não conseguir parsear JSON, mantém mensagem genérica
      }
      return { ok: false, error: errorMsg };
    }

    const data = (await response.json()) as {
      url?: string;
      key?: string;
      filename?: string;
    };

    if (!data.url || !data.key || !data.filename) {
      return {
        ok: false,
        error: "Resposta inválida do serviço de upload."
      };
    }

    return {
      ok: true,
      url: data.url,
      key: data.key,
      filename: data.filename
    };
  } catch {
    return {
      ok: false,
      error: "Não foi possível conectar ao serviço de upload."
    };
  }
}

/**
 * Remove uma imagem do R2 pelo seu key (gallery/slug/filename).
 *
 * Query param: key
 * Method: DELETE
 *
 * Retorna erro se a remoção falhar, null se sucesso.
 */
export async function deleteGalleryImage(
  key: string
): Promise<{ error: string | null }> {
  const endpoint =
    (import.meta.env as Record<string, string>).VITE_GALLERY_UPLOAD_ENDPOINT ||
    "";
  if (!endpoint) {
    return { error: "Endpoint de upload não configurado" };
  }

  try {
    const url = new URL(endpoint);
    url.searchParams.set("key", key);

    const response = await fetch(url.toString(), {
      method: "DELETE"
    });

    if (!response.ok) {
      let errorMsg = "Falha ao deletar imagem";
      try {
        const data = await response.json();
        errorMsg = data.error || errorMsg;
      } catch {
        // Se resposta não for JSON, mantém mensagem genérica
      }
      return { error: errorMsg };
    }

    return { error: null };
  } catch {
    return { error: "Não foi possível conectar ao serviço de upload." };
  }
}
