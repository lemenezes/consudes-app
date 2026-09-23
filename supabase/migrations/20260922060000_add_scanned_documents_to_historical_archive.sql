-- =============================================================================
-- CONSUDES — Acervo Histórico
-- Adiciona 11 páginas digitalizadas extraídas de dois PDFs históricos.
-- Preserva capa, metadados e as 818 fotos já existentes.
-- =============================================================================

update public.gallery_albums
set
  photos = photos || '[
    {"filename":"digitalizado-20260818-1927-1.webp"},
    {"filename":"digitalizado-20260818-1927-2.webp"},
    {"filename":"digitalizado-20260818-1927-3.webp"},
    {"filename":"digitalizado-20260818-1927-4.webp"},
    {"filename":"digitalizado-20260818-1927-5.webp"},
    {"filename":"digitalizado-20260818-1929-1.webp"},
    {"filename":"digitalizado-20260818-1929-2.webp"},
    {"filename":"digitalizado-20260818-1929-3.webp"},
    {"filename":"digitalizado-20260818-1929-4.webp"},
    {"filename":"digitalizado-20260818-1929-5.webp"},
    {"filename":"digitalizado-20260818-1929-6.webp"}
  ]'::jsonb,
  photo_count = photo_count + 11,
  updated_at = now()
where slug = 'museu/acervo-historico-consudes'
  and photo_count = 818;