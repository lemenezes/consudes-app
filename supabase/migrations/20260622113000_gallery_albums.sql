-- =============================================================================
-- CONSUDES CMS — Gallery Albums (estrutura real da galeria)
-- Migration: 20260622113000_gallery_albums.sql
-- =============================================================================
-- Objetivo:
--   - Criar tabela public.gallery_albums para substituir o mock/localStorage.
--   - Manter imagens em Cloudflare R2/CDN (somente referência de path/url no banco).
--   - Aplicar RLS com leitura pública e escrita apenas para perfis administrativos.
-- =============================================================================

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  year integer,
  city text,
  country text,
  description jsonb not null default '{"es":"","pt":"","en":""}'::jsonb,
  category text not null,
  tier text not null default 'T2',
  cover_file text,
  cover_position text default 'center',
  photo_count integer not null default 0 check (photo_count >= 0),
  photos jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  admin_touched_at bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_albums_slug_not_blank check (length(trim(slug)) > 0),
  constraint gallery_albums_title_not_blank check (length(trim(title)) > 0),
  constraint gallery_albums_category_check check (
    category in (
      'interclubes',
      'juegos-sudamericanos',
      'assembleias',
      'panamdes',
      'capacitacao',
      'futsal-feminino',
      'historico'
    )
  ),
  constraint gallery_albums_tier_check check (tier in ('T1', 'T2', 'T3')),
  constraint gallery_albums_description_object check (jsonb_typeof(description) = 'object'),
  constraint gallery_albums_photos_array check (jsonb_typeof(photos) = 'array')
);

comment on table public.gallery_albums is 'Álbuns da galeria institucional; arquivos de imagem ficam no Cloudflare R2/CDN.';
comment on column public.gallery_albums.slug is 'Slug único do álbum (também usado no path gallery/{slug}/ no R2).';
comment on column public.gallery_albums.description is 'Descrição multilíngue no formato JSON: {es, pt, en}.';
comment on column public.gallery_albums.photos is 'Lista de fotos do álbum em JSON (filename, caption, originalName, isHero).';
comment on column public.gallery_albums.cover_file is 'Arquivo de capa dentro do álbum (ex: cover.webp ou 01.webp).';

create index if not exists idx_gallery_albums_category on public.gallery_albums (category);
create index if not exists idx_gallery_albums_year on public.gallery_albums (year desc);
create index if not exists idx_gallery_albums_featured on public.gallery_albums (featured);
create index if not exists idx_gallery_albums_admin_touched_at on public.gallery_albums (admin_touched_at desc nulls last);

-- Reusa função padrão já criada no projeto (public.set_updated_at)
drop trigger if exists trg_gallery_albums_updated_at on public.gallery_albums;
create trigger trg_gallery_albums_updated_at
before update on public.gallery_albums
for each row execute function public.set_updated_at();

alter table public.gallery_albums enable row level security;

-- Leitura pública
-- (mantém fallback/consumo público sem exigir autenticação)
drop policy if exists "Public can read gallery_albums" on public.gallery_albums;
create policy "Public can read gallery_albums"
  on public.gallery_albums
  for select
  using (true);

-- Escrita restrita a perfis administrativos já existentes no RBAC do projeto
-- Roles: super_admin, diretor_esportes, editor

drop policy if exists "Admin/Diretor/Editor can insert gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can insert gallery_albums"
  on public.gallery_albums
  for insert
  with check (public.has_role(array['super_admin','diretor_esportes','editor']));

drop policy if exists "Admin/Diretor/Editor can update gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can update gallery_albums"
  on public.gallery_albums
  for update
  using (public.has_role(array['super_admin','diretor_esportes','editor']))
  with check (public.has_role(array['super_admin','diretor_esportes','editor']));

drop policy if exists "Admin/Diretor/Editor can delete gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can delete gallery_albums"
  on public.gallery_albums
  for delete
  using (public.has_role(array['super_admin','diretor_esportes','editor']));
