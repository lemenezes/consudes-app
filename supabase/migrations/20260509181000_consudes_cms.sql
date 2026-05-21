-- =============================================================================
-- CONSUDES CMS — Schema institucional
-- Migration: 20260509_consudes_cms.sql
-- =============================================================================
-- Tabelas criadas:
--   news, federations, reports, gallery, championships,
--   team_members, former_presidents
--
-- Padrões:
--   - UUIDs gerados por gen_random_uuid()
--   - created_at / updated_at com default now()
--   - Enums para valores controlados
--   - RLS habilitado em todas as tabelas (políticas a definir por tabela)
--   - Storage buckets preparados (criados via Supabase Dashboard ou API)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------

do $$ begin
  create type publish_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_category as enum ('financeiro', 'ata', 'estatuto', 'outro');
exception when duplicate_object then null; end $$;

do $$ begin
  create type championship_status as enum ('upcoming', 'ongoing', 'finished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('photo', 'video');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_lang as enum ('es', 'pt', 'en');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- TABLE: news
-- Notícias, avisos e comunicados oficiais
-- ---------------------------------------------------------------------------

create table if not exists public.news (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    slug text not null unique,
    excerpt text,
    content text,
    cover_url text,
    lang content_lang not null default 'es',
    status publish_status not null default 'draft',
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.news is 'Notícias, avisos e comunicados da CONSUDES.';

comment on column public.news.slug is 'Identificador único para URL amigável.';

comment on column public.news.cover_url is 'URL pública da imagem de capa (Supabase Storage).';

comment on column public.news.lang is 'Idioma principal do conteúdo.';

comment on column public.news.published_at is 'Data de publicação; null = não publicado.';

create index if not exists idx_news_status on public.news (status);

create index if not exists idx_news_lang on public.news (lang);

create index if not exists idx_news_published_at on public.news (published_at desc);

-- Atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_news_updated_at on public.news;

create trigger trg_news_updated_at
  before update on public.news
  for each row execute function public.set_updated_at();

alter table public.news enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: federations
-- Federações nacionais afiliadas à CONSUDES
-- ---------------------------------------------------------------------------

create table if not exists public.federations (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    country text not null,
    country_code char(2) not null, -- ISO 3166-1 alpha-2 (BR, AR, CL...)
    logo_url text,
    website_url text,
    contact_email text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

comment on table public.federations is 'Federações nacionais afiliadas à CONSUDES.';

comment on column public.federations.country_code is 'Código ISO 3166-1 alpha-2 do país.';

comment on column public.federations.logo_url is 'URL pública do logo (Supabase Storage).';

comment on column public.federations.sort_order is 'Ordem de exibição na listagem.';

create index if not exists idx_federations_country on public.federations (country);

create index if not exists idx_federations_sort on public.federations (sort_order);

alter table public.federations enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: reports
-- Documentos de transparência (informes, atas, estatutos)
-- ---------------------------------------------------------------------------

create table if not exists public.reports (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    category report_category not null,
    file_url text not null, -- URL pública (Supabase Storage)
    year integer check (
        year >= 1990
        and year <= 2100
    ),
    description text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

comment on table public.reports is 'Documentos de transparência institucional.';

comment on column public.reports.file_url is 'URL pública do arquivo PDF (Supabase Storage).';

comment on column public.reports.year is 'Ano de referência do documento.';

comment on column public.reports.category is 'Categoria: financeiro, ata, estatuto ou outro.';

create index if not exists idx_reports_category on public.reports (category);

create index if not exists idx_reports_year on public.reports (year desc);

create index if not exists idx_reports_sort on public.reports (sort_order);

alter table public.reports enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: gallery
-- Galeria de fotos e vídeos institucionais
-- ---------------------------------------------------------------------------

create table if not exists public.gallery (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    description text,
    media_url text not null, -- URL pública (Supabase Storage)
    media_type media_type not null default 'photo',
    cover_url text, -- Thumbnail para vídeos
    sort_order integer not null default 0,
    published_at timestamptz,
    created_at timestamptz not null default now()
);

comment on table public.gallery is 'Galeria de fotos e vídeos da CONSUDES.';

comment on column public.gallery.media_url is 'URL pública da mídia (Supabase Storage).';

comment on column public.gallery.cover_url is 'Thumbnail para vídeos; null para fotos.';

comment on column public.gallery.published_at is 'Data de publicação; null = rascunho.';

create index if not exists idx_gallery_media_type on public.gallery (media_type);

create index if not exists idx_gallery_published_at on public.gallery (published_at desc);

create index if not exists idx_gallery_sort on public.gallery (sort_order);

alter table public.gallery enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: championships
-- Campeonatos, interclubes e jogos sul-americanos
-- ---------------------------------------------------------------------------

create table if not exists public.championships (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    edition text, -- Ex: "VIII Edición"
    location text,
    country text,
    start_date date,
    end_date date,
    status championship_status not null default 'upcoming',
    cover_url text,
    description text,
    created_at timestamptz not null default now(),
    constraint chk_dates check (
        end_date is null
        or end_date >= start_date
    )
);

comment on table public.championships is 'Campeonatos e competições organizados pela CONSUDES.';

comment on column public.championships.edition is 'Edição da competição (ex: VIII Edición).';

comment on column public.championships.cover_url is 'URL pública da imagem de capa (Supabase Storage).';

comment on column public.championships.status is 'upcoming | ongoing | finished.';

create index if not exists idx_championships_status on public.championships (status);

create index if not exists idx_championships_start_date on public.championships (start_date desc);

alter table public.championships enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: team_members
-- Equipe atual da CONSUDES (diretoria, comissões)
-- ---------------------------------------------------------------------------

create table if not exists public.team_members (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    role text not null, -- Cargo / função
    country text,
    photo_url text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

comment on table public.team_members is 'Membros da equipe atual da CONSUDES.';

comment on column public.team_members.role is 'Cargo ou função na confederação.';

comment on column public.team_members.photo_url is 'URL pública da foto (Supabase Storage).';

comment on column public.team_members.sort_order is 'Ordem de exibição.';

create index if not exists idx_team_members_sort on public.team_members (sort_order);

alter table public.team_members enable row level security;

-- ---------------------------------------------------------------------------
-- TABLE: former_presidents
-- Histórico de ex-presidentes da CONSUDES
-- ---------------------------------------------------------------------------

create table if not exists public.former_presidents (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    country text,
    period_start integer not null check (period_start >= 1980),
    period_end integer check (
        period_end is null
        or period_end >= period_start
    ),
    photo_url text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

comment on table public.former_presidents is 'Ex-presidentes da CONSUDES.';

comment on column public.former_presidents.period_start is 'Ano de início do mandato.';

comment on column public.former_presidents.period_end is 'Ano de fim do mandato; null = mandato atual.';

comment on column public.former_presidents.photo_url is 'URL pública da foto (Supabase Storage).';

create index if not exists idx_former_presidents_sort on public.former_presidents (sort_order);

alter table public.former_presidents enable row level security;

-- =============================================================================
-- RLS POLICIES — leitura pública (anon) para todas as tabelas CMS
-- Escrita apenas por service_role / admin (a definir com Auth)
-- =============================================================================

do $$ begin
  create policy "news: leitura pública de publicadas" on public.news for select using (status = 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "federations: leitura pública" on public.federations for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "reports: leitura pública" on public.reports for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gallery: leitura pública de publicadas" on public.gallery for select using (published_at is not null and published_at <= now());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "championships: leitura pública" on public.championships for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "team_members: leitura pública" on public.team_members for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "former_presidents: leitura pública" on public.former_presidents for select using (true);
exception when duplicate_object then null; end $$;

-- =============================================================================
-- STORAGE BUCKETS (executar via Supabase Dashboard ou API separadamente)
-- =============================================================================
-- Os buckets abaixo devem ser criados no painel Storage do Supabase:
--
--   cms-news      → capas de notícias         (público, accept: image/*)
--   cms-gallery   → fotos e vídeos            (público, accept: image/*, video/*)
--   cms-reports   → PDFs de transparência     (público, accept: application/pdf)
--   cms-avatars   → fotos de membros/equipe   (público, accept: image/*)
--
-- Exemplo via SQL (requer extensão storage habilitada):
-- insert into storage.buckets (id, name, public) values
--   ('cms-news',    'cms-news',    true),
--   ('cms-gallery', 'cms-gallery', true),
--   ('cms-reports', 'cms-reports', true),
--   ('cms-avatars', 'cms-avatars', true)
-- on conflict (id) do nothing;