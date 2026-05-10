import { isStorageUrl, extractStoragePath, deleteImageByUrl } from '../services/storageService';

const BUCKET = 'cms-news';
const INLINE_FOLDER_PREFIX = 'inline/';

/** Extrai todas as URLs de <img src="..."> de um HTML */
export function extractInlineImageUrls(html: string): string[] {
  const matches = html.matchAll(/<img[^>]+src="([^"]+)"/g);
  return Array.from(matches, (m) => m[1]);
}

/** Retorna true se a URL é uma imagem inline do nosso bucket (pasta inline/) */
function isOurInlineUrl(url: string): boolean {
  if (!isStorageUrl(url, BUCKET)) return false;
  const path = extractStoragePath(BUCKET, url);
  return path?.startsWith(INLINE_FOLDER_PREFIX) ?? false;
}

/**
 * Retorna as URLs que estão em `oldHtml` mas não em `newHtml`,
 * filtradas apenas para imagens inline do nosso Storage.
 */
export function getOrphanedInlineUrls(oldHtml: string, newHtml: string): string[] {
  const oldUrls = extractInlineImageUrls(oldHtml).filter(isOurInlineUrl);
  const newSet = new Set(extractInlineImageUrls(newHtml).filter(isOurInlineUrl));
  return oldUrls.filter((url) => !newSet.has(url));
}

/**
 * Retorna URLs que estão em `currentHtml` mas NÃO em `originalHtml`.
 * Útil para limpar uploads feitos durante a sessão ao cancelar.
 */
export function getNewlyAddedInlineUrls(originalHtml: string, currentHtml: string): string[] {
  const originalSet = new Set(extractInlineImageUrls(originalHtml).filter(isOurInlineUrl));
  const current = extractInlineImageUrls(currentHtml).filter(isOurInlineUrl);
  return current.filter((url) => !originalSet.has(url));
}

/**
 * Deleta uma lista de URLs de imagens inline do Storage.
 * Erros individuais são ignorados (não devem impedir o fluxo do usuário).
 * Retorna o número de imagens deletadas com sucesso.
 */
export async function deleteInlineImageUrls(
  urls: string[],
  onDeleted?: (url: string) => void,
): Promise<number> {
  if (!urls.length) return 0;

  let deleted = 0;
  await Promise.allSettled(
    urls.map(async (url) => {
      const { error } = await deleteImageByUrl(BUCKET, url);
      if (!error) {
        deleted++;
        onDeleted?.(url);
      } else {
        console.warn('[inlineImageCleanup] Falha ao deletar imagem:', url, error);
      }
    }),
  );
  return deleted;
}
