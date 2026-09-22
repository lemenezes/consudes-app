-- Migration: 20260922030000_calendar_events_i18n_columns.sql
-- Adiciona colunas multilíngues à tabela calendar_events, seguindo o padrão
-- adotado em news e reports. As colunas originais (title, description) são
-- mantidas para compatibilidade.

-- ── 1. Coluna de idioma original ──────────────────────────────────────────
alter table public.calendar_events
  add column if not exists lang public.content_lang;

-- Sem histórico de idioma anterior: assume 'es' (idioma padrão do site).
update public.calendar_events
  set lang = 'es'
  where lang is null;

alter table public.calendar_events
  alter column lang set not null,
  alter column lang set default 'es';

-- ── 2. Colunas de conteúdo por idioma ─────────────────────────────────────
alter table public.calendar_events
  add column if not exists title_pt       text,
  add column if not exists title_es       text,
  add column if not exists title_en       text,
  add column if not exists description_pt text,
  add column if not exists description_es text,
  add column if not exists description_en text;

-- ── 3. Migrar dados existentes — idempotente ──────────────────────────────
update public.calendar_events set
  title_pt       = coalesce(title_pt,       title),
  description_pt = coalesce(description_pt, description)
where lang = 'pt';

update public.calendar_events set
  title_es       = coalesce(title_es,       title),
  description_es = coalesce(description_es, description)
where lang = 'es';

update public.calendar_events set
  title_en       = coalesce(title_en,       title),
  description_en = coalesce(description_en, description)
where lang = 'en';

-- ── 4. Índice de apoio ────────────────────────────────────────────────────
create index if not exists idx_calendar_events_lang
  on public.calendar_events (lang);

-- ── 5. Comentários ────────────────────────────────────────────────────────
comment on column public.calendar_events.lang           is 'Idioma em que o editor escreveu o conteúdo originalmente.';
comment on column public.calendar_events.title_pt       is 'Título em português.';
comment on column public.calendar_events.title_es       is 'Título em espanhol.';
comment on column public.calendar_events.title_en       is 'Título em inglês.';
comment on column public.calendar_events.description_pt is 'Descrição em português.';
comment on column public.calendar_events.description_es is 'Descrição em espanhol.';
comment on column public.calendar_events.description_en is 'Descrição em inglês.';
