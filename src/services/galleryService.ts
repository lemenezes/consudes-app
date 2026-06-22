// ──────────────────────────────────────────────────────────────────────────
// Gallery Service — Supabase DB com Fallback localStorage
// ──────────────────────────────────────────────────────────────────────────
//
// Gerencia álbuns de galeria com Supabase `gallery_albums` table.
// Fallback em leitura para localStorage e galleryData.ts se Supabase indisponível.
// Escrita SEMPRE vai para Supabase (sem fallback silencioso).
//
// RLS Policies:
// - SELECT: público (qualquer um consegue ler)
// - INSERT/UPDATE/DELETE: admin/diretor/editor (via has_role)
//
// ──────────────────────────────────────────────────────────────────────────

import { supabase } from "../lib/supabase";
import {
  galleryAlbums,
  type GalleryAlbum,
  type GalleryCategory,
  type GalleryTier,
  type GalleryPhoto
} from "../data/galleryData";
import type { Database } from "../lib/database.types";

export interface GalleryServiceResult<T = any> {
  data?: T;
  error?: string;
}

const STORAGE_KEY = "__consudes_gallery_demo__";

// ─── Type Mappings: Supabase (snake_case) ↔ Frontend (camelCase) ────────────

/**
 * Converte linha do banco (snake_case) para GalleryAlbum (camelCase)
 */
function fromDatabaseAlbum(
  row: Database["public"]["Tables"]["gallery_albums"]["Row"]
): GalleryAlbum {
  return {
    slug: row.slug,
    title: row.title,
    year: row.year,
    city: row.city,
    country: row.country,
    description: (row.description || { es: "", pt: "", en: "" }) as Record<
      string,
      string
    >,
    category: row.category as GalleryCategory,
    tier: row.tier as GalleryTier,
    coverFile: row.cover_file,
    coverPosition: row.cover_position || "center",
    photoCount: row.photo_count,
    photos: (row.photos || []) as unknown as GalleryPhoto[],
    featured: row.featured || false,
    adminTouchedAt: row.admin_touched_at
      ? new Date(row.admin_touched_at).getTime()
      : undefined
  };
}

/**
 * Converte GalleryAlbum (camelCase) para formato do banco (snake_case)
 */
function toDatabaseAlbum(
  album: GalleryAlbum
): Database["public"]["Tables"]["gallery_albums"]["Insert"] {
  return {
    slug: album.slug,
    title: album.title,
    year: album.year,
    city: album.city,
    country: album.country,
    description:
      album.description as Database["public"]["Tables"]["gallery_albums"]["Insert"]["description"],
    category: album.category as string,
    tier: album.tier as string,
    cover_file: album.coverFile,
    cover_position: album.coverPosition || "center",
    photo_count: album.photoCount,
    photos:
      album.photos as unknown as Database["public"]["Tables"]["gallery_albums"]["Insert"]["photos"],
    featured: album.featured || false
  };
}

// ─── Helpers: localStorage Fallback ───────────────────────────────────────

/**
 * Lista todos os álbuns de galeria
 * Supabase first, fallback para localStorage + galleryData.ts
 */
export async function listGalleries(): Promise<
  GalleryServiceResult<GalleryAlbum[]>
> {
  try {
    // Tenta Supabase primeiro
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*")
      .order("admin_touched_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Sucesso: mapear e retornar
      return { data: data.map(row => fromDatabaseAlbum(row)) };
    }

    // Fallback: localStorage ou galleryData.ts
    const stored = loadGalleryState();
    return { data: stored };
  } catch (err) {
    // Fallback final em caso de erro
    const stored = loadGalleryState();
    return { data: stored };
  }
}

/**
 * Obtém um álbum específico pelo slug
 * Supabase first, fallback para localStorage + galleryData.ts
 */
export async function getGalleryBySlug(
  slug: string
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    // Tenta Supabase primeiro
    const { data, error } = await supabase
      .from("gallery_albums")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!error && data) {
      // Sucesso: mapear e retornar
      return { data: fromDatabaseAlbum(data) };
    }

    // Fallback: localStorage ou galleryData.ts
    const allAlbums = loadGalleryState();
    const album = allAlbums.find(a => a.slug === slug);
    if (album) {
      return { data: { ...album } };
    }

    return { error: "Álbum não encontrado" };
  } catch (err) {
    // Fallback em caso de erro
    const allAlbums = loadGalleryState();
    const album = allAlbums.find(a => a.slug === slug);
    if (album) {
      return { data: { ...album } };
    }
    return { error: (err as Error).message };
  }
}

/**
 * Atualiza um álbum existente
 * Escrita SEMPRE vai para Supabase (sem fallback silencioso)
 * RLS garante que apenas admin/editor/diretor conseguem
 */
export async function updateGallery(
  slug: string,
  updates: Partial<GalleryAlbum>
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    // Obter álbum atual
    const { data: current, error: getError } = await supabase
      .from("gallery_albums")
      .select("*")
      .eq("slug", slug)
      .single();

    if (getError || !current) {
      return { error: "Álbum não encontrado" };
    }

    // Preparar dados para update
    const merged = { ...fromDatabaseAlbum(current), ...updates };
    const dbUpdate: Database["public"]["Tables"]["gallery_albums"]["Update"] = {
      ...toDatabaseAlbum(merged),
      admin_touched_at: new Date().toISOString() as any
    };

    // Atualizar no Supabase
    const { data, error } = await supabase
      .from("gallery_albums")
      .update(dbUpdate)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      // Erro de RLS ou outra falha - retornar erro sem fallback
      return { error: error.message };
    }

    if (!data) {
      return { error: "Falha ao atualizar álbum" };
    }

    // Sucesso: atualizar localStorage como backup
    saveGalleryState([
      ...loadGalleryState().filter(a => a.slug !== slug),
      fromDatabaseAlbum(data)
    ]);

    return { data: fromDatabaseAlbum(data) };
  } catch (err) {
    // Erro de conexão, não fazer fallback silencioso
    return { error: (err as Error).message };
  }
}

/**
 * Deleta um álbum da galeria
 * Escrita SEMPRE vai para Supabase (sem fallback silencioso)
 * RLS garante que apenas admin/editor/diretor conseguem
 */
export async function deleteGallery(
  slug: string
): Promise<GalleryServiceResult<null>> {
  try {
    const { error } = await supabase
      .from("gallery_albums")
      .delete()
      .eq("slug", slug);

    if (error) {
      // Erro de RLS ou outra falha - retornar erro
      return { error: error.message };
    }

    // Sucesso: remover de localStorage também
    saveGalleryState(loadGalleryState().filter(a => a.slug !== slug));

    return { data: null };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

/**
 * Cria um novo álbum
 * Escrita SEMPRE vai para Supabase (sem fallback silencioso)
 * RLS garante que apenas admin/editor/diretor conseguem
 */
export async function createGallery(
  album: GalleryAlbum
): Promise<GalleryServiceResult<GalleryAlbum>> {
  try {
    const dbData: Database["public"]["Tables"]["gallery_albums"]["Insert"] = {
      ...toDatabaseAlbum(album),
      admin_touched_at: new Date().toISOString() as any
    };

    // Inserir no Supabase
    const { data, error } = await supabase
      .from("gallery_albums")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      // Erro de RLS ou slug duplicado - retornar erro sem fallback
      return { error: error.message };
    }

    if (!data) {
      return { error: "Falha ao criar álbum" };
    }

    // Sucesso: adicionar a localStorage também
    saveGalleryState([...loadGalleryState(), fromDatabaseAlbum(data)]);

    return { data: fromDatabaseAlbum(data) };
  } catch (err) {
    // Erro de conexão, não fazer fallback silencioso
    return { error: (err as Error).message };
  }
}

// ─── Helpers: localStorage Fallback ───────────────────────────────────────

/**
 * Carrega estado do localStorage ou retorna cópia dos dados originais
 */
function loadGalleryState(): GalleryAlbum[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to load gallery from localStorage", e);
  }
  // Fallback final: dados originais de galleryData.ts
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

// ─── Debug Functions ──────────────────────────────────────────────────────

/**
 * Reseta estado para dados originais (para desenvolvimento/debug)
 * Limpa localStorage e recarrega de galleryData.ts
 */
export function resetGalleryState(): void {
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
  return JSON.parse(JSON.stringify(loadGalleryState()));
}
