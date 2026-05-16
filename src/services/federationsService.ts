import { supabase } from '../lib/supabase';
import { deleteImageByUrl } from './storageService';
import type { FederationRow } from '../lib/database.types';

export const FEDERATIONS_BUCKET = 'cms-federations';

export interface FederationFormData {
  acronym: string;
  name_es: string;
  name_pt: string;
  name_en: string;
  country_es: string;
  country_pt: string;
  country_en: string;
  flag: string;
  logo_url: string;
  website_url: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  twitter_url: string;
  linkedin_url: string;
  tiktok_url: string;
  flickr_url: string;
  sort_order: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Converte campos de texto vazio para null antes de salvar */
function toNullable(val: string): string | null {
  return val.trim() === '' ? null : val.trim();
}

function formToInsert(form: FederationFormData) {
  return {
    acronym:       form.acronym.trim().toUpperCase(),
    name_es:       form.name_es.trim(),
    name_pt:       toNullable(form.name_pt),
    name_en:       toNullable(form.name_en),
    country_es:    form.country_es.trim(),
    country_pt:    toNullable(form.country_pt),
    country_en:    toNullable(form.country_en),
    flag:          form.flag.trim(),
    logo_url:      toNullable(form.logo_url),
    website_url:   toNullable(form.website_url),
    instagram_url: toNullable(form.instagram_url),
    facebook_url:  toNullable(form.facebook_url),
    youtube_url:   toNullable(form.youtube_url),
    twitter_url:   toNullable(form.twitter_url),
    linkedin_url:  toNullable(form.linkedin_url),
    tiktok_url:    toNullable(form.tiktok_url),
    flickr_url:    toNullable(form.flickr_url),
    sort_order:    form.sort_order,
  };
}

// ── Queries ────────────────────────────────────────────────────────────────

/** Lista todas as federações ordenadas por sort_order */
export async function listFederations(): Promise<{ data: FederationRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('federations')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return { data: [], error: error.message };
  return { data: data as FederationRow[], error: null };
}

/** Busca federação por ID */
export async function getFederationById(
  id: string,
): Promise<{ data: FederationRow | null; error: string | null }> {
  const { data, error } = await supabase
    .from('federations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as FederationRow, error: null };
}

/** Cria nova federação */
export async function createFederation(
  form: FederationFormData,
): Promise<{ data: FederationRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('federations')
    .insert(formToInsert(form))
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as FederationRow, error: null };
}

/** Atualiza federação existente */
export async function updateFederation(
  id: string,
  form: FederationFormData,
): Promise<{ data: FederationRow | null; error: string | null }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('federations')
    .update(formToInsert(form))
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as FederationRow, error: null };
}

/** Remove uma federação e seu logo do Storage (se for URL do Storage) */
export async function deleteFederation(
  id: string,
  logo_url: string | null,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('federations').delete().eq('id', id);
  if (error) return { error: error.message };

  if (logo_url) {
    await deleteImageByUrl(FEDERATIONS_BUCKET, logo_url);
  }

  return { error: null };
}
