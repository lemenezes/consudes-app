-- Migration: 20260921120000_reports_i18n_columns.sql
-- Adiciona colunas multilíngues à tabela reports, seguindo o padrão adotado em news.
-- As colunas originais (title, description) são mantidas para compatibilidade.

-- ── 1. Coluna de idioma original ──────────────────────────────────────────
alter table public.reports
  add column if not exists lang public.content_lang;

-- Sem histórico de idioma anterior: assume 'es' (idioma padrão do site).
update public.reports
  set lang = 'es'
  where lang is null;

alter table public.reports
  alter column lang set not null,
  alter column lang set default 'es';

-- ── 2. Colunas de conteúdo por idioma ─────────────────────────────────────
alter table public.reports
  add column if not exists title_pt       text,
  add column if not exists title_es       text,
  add column if not exists title_en       text,
  add column if not exists description_pt text,
  add column if not exists description_es text,
  add column if not exists description_en text;

-- ── 3. Migrar dados existentes — idempotente ──────────────────────────────
update public.reports set
  title_pt       = coalesce(title_pt,       title),
  description_pt = coalesce(description_pt, description)
where lang = 'pt';

update public.reports set
  title_es       = coalesce(title_es,       title),
  description_es = coalesce(description_es, description)
where lang = 'es';

update public.reports set
  title_en       = coalesce(title_en,       title),
  description_en = coalesce(description_en, description)
where lang = 'en';

-- ── 4. Índice de apoio ────────────────────────────────────────────────────
create index if not exists idx_reports_lang
  on public.reports (lang);

-- ── 5. Comentários ────────────────────────────────────────────────────────
comment on column public.reports.lang           is 'Idioma em que o editor escreveu o conteúdo originalmente.';
comment on column public.reports.title_pt       is 'Título em português.';
comment on column public.reports.title_es       is 'Título em espanhol.';
comment on column public.reports.title_en       is 'Título em inglês.';
comment on column public.reports.description_pt is 'Descrição em português.';
comment on column public.reports.description_es is 'Descrição em espanhol.';
comment on column public.reports.description_en is 'Descrição em inglês.';
