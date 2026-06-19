// ──────────────────────────────────────────────────────────────────────────
// 🚀 MOCK SERVICE — TEMPORÁRIO DURANTE DESENVOLVIMENTO
// ──────────────────────────────────────────────────────────────────────────
//
// Gerencia álbuns de galeria com persistência em localStorage.
// Fonte única: galleryData.ts (mesmos dados da galeria pública)
// Alterações simuladas persistem durante a demo (reload = dados mantidos)
//
// ⚠️  IMPORTANTE:
// - Sem integração real com Supabase ainda
// - localStorage NÃO é produção (perder dados em private/incognito, limite 5-10MB)
// - Ao conectar Supabase, remover código de localStorage
// - Galeria pública /galeria/ usa galleryData.ts diretamente (ainda não usa service)
//
// TODO: Migrar para Supabase quando backend estiver pronto
// ──────────────────────────────────────────────────────────────────────────

import { galleryAlbums, type GalleryAlbum } from "../data/galleryData";

export interface GalleryServiceResult<T = any> {
  data?: T;
  error?: string;
}

const STORAGE_KEY = "__consudes_gallery_demo__";

/**
 * Carrega estado do localStorage ou retorna cópia dos dados originais
 */
function loadGalleryState(): GalleryAlbum[] {
  try {
    // Tenta recuperar do localStorage (dados editados na demo anterior)
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load gallery from localStorage, using defaults", e);
  }

  // Cópia limpa dos dados originais de galleryData.ts
  return [...galleryAlbums];
}

/**
 * Persiste o estado no localStorage
 */
function saveGalleryState(state: GalleryAlbum[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save gallery to localStorage", e);
  }
}

// Estado em sessão (inicializa com localStorage ou dados originais)
let galleryState = loadGalleryState();

/**
 * Lista todos os álbuns de galeria
 * ✓ Retorna EXATAMENTE os mesmos que aparecem em /galeria
 * ✓ Inclui alterações salvas no localStorage
 */
export async function listGalleries(): Promise<
  GalleryServiceResult<GalleryAlbum[]>
> {
  try {
    // Simula delay de rede
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: [...galleryState] });
      }, 200);
    });
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Obtém um álbum específico pelo slug
 * ✓ Busca apenas entre álbuns que existem (originais ou editados)
 */
export async function getGalleryBySlug(
  slug: string
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    const album = galleryState.find(a => a.slug === slug);
    if (!album) {
      return { error: "Álbum não encontrado" };
    }
    return { data: { ...album } };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Atualiza um álbum existente
 * ✓ Persiste em localStorage
 * ✓ Mantém slug intocável
 */
export async function updateGallery(
  slug: string,
  updates: Partial<GalleryAlbum>
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    const index = galleryState.findIndex(a => a.slug === slug);
    if (index === -1) {
      return { error: "Álbum não encontrado" };
    }

    const updatedAlbum = {
      ...galleryState[index],
      ...updates,
      slug: galleryState[index].slug // slug nunca muda
    };

    galleryState[index] = updatedAlbum;
    saveGalleryState(galleryState); // Persiste alteração

    return { data: { ...updatedAlbum } };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Deleta um álbum da galeria
 * ✓ Remove apenas se existir
 * ✓ Persiste em localStorage
 * ⚠️  Operação destrutiva, user deve confirmar
 */
export async function deleteGallery(
  slug: string
): Promise<GalleryServiceResult<null>> {
  try {
    const index = galleryState.findIndex(a => a.slug === slug);
    if (index === -1) {
      return { error: "Álbum não encontrado" };
    }

    galleryState.splice(index, 1);
    saveGalleryState(galleryState); // Persiste alteração

    return { data: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Cria um novo álbum
 * ⚠️  Validação básica - slug deve ser único
 * ✓ Persiste em localStorage
 */
export async function createGallery(
  album: GalleryAlbum
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    // Verifica se slug já existe
    if (galleryState.some(a => a.slug === album.slug)) {
      return { error: "Álbum com este slug já existe" };
    }

    galleryState.push({ ...album });
    saveGalleryState(galleryState); // Persiste alteração

    return { data: { ...album } };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Reseta estado para dados originais (para desenvolvimento/debug)
 * Limpa localStorage e recarrega de galleryData.ts
 */
export function resetGalleryState(): void {
  galleryState = [...galleryAlbums];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear gallery localStorage", e);
  }
  console.log("✓ Gallery reset to original state");
}

/**
 * Exporta estado atual (debug apenas)
 */
export function debugGetCurrentState(): GalleryAlbum[] {
  return JSON.parse(JSON.stringify(galleryState));
}
