-- Migration: 20260806120000_news_i18n_columns.sql
-- Adiciona colunas multilíngues à tabela news.
-- As colunas originais (title, excerpt, content, lang) são mantidas
-- nesta migration; a remoção ocorre em migration separada após validar produção.

-- ── 1. Coluna de idioma original ──────────────────────────────────────────
-- Adicionada sem NOT NULL/default para distinguir linhas ainda não migradas.
alter table public.news
  add column if not exists original_language public.content_lang;

-- Preenche apenas linhas ainda sem valor (seguro reaplicar).
update public.news
  set original_language = lang
  where original_language is null;

-- Agora é seguro impor NOT NULL; default 'es' só afeta inserções futuras.
alter table public.news
  alter column original_language set not null,
  alter column original_language set default 'es';

-- ── 2. Colunas de conteúdo por idioma ─────────────────────────────────────
alter table public.news
  add column if not exists title_pt   text,
  add column if not exists title_es   text,
  add column if not exists title_en   text,
  add column if not exists excerpt_pt text,
  add column if not exists excerpt_es text,
  add column if not exists excerpt_en text,
  add column if not exists content_pt text,
  add column if not exists content_es text,
  add column if not exists content_en text;

-- ── 3. Migrar dados existentes — um bloco por idioma, idempotente ─────────
-- coalesce preserva tradução manual existente; nunca define null nos outros idiomas.

update public.news set
  title_pt   = coalesce(title_pt,   title),
  excerpt_pt = coalesce(excerpt_pt, excerpt),
  content_pt = coalesce(content_pt, content)
where lang = 'pt';

update public.news set
  title_es   = coalesce(title_es,   title),
  excerpt_es = coalesce(excerpt_es, excerpt),
  content_es = coalesce(content_es, content)
where lang = 'es';

update public.news set
  title_en   = coalesce(title_en,   title),
  excerpt_en = coalesce(excerpt_en, excerpt),
  content_en = coalesce(content_en, content)
where lang = 'en';

-- ── 4. Índice de apoio ────────────────────────────────────────────────────
create index if not exists idx_news_original_language
  on public.news (original_language);

-- ── 5. Comentários ────────────────────────────────────────────────────────
comment on column public.news.original_language
  is 'Idioma em que o editor escreveu o conteúdo originalmente.';
comment on column public.news.title_pt   is 'Título em português.';
comment on column public.news.title_es   is 'Título em espanhol.';
comment on column public.news.title_en   is 'Título em inglês.';
comment on column public.news.excerpt_pt is 'Resumo em português.';
comment on column public.news.excerpt_es is 'Resumo em espanhol.';
comment on column public.news.excerpt_en is 'Resumo em inglês.';
comment on column public.news.content_pt is 'Conteúdo HTML em português.';
comment on column public.news.content_es is 'Conteúdo HTML em espanhol.';
comment on column public.news.content_en is 'Conteúdo HTML em inglês.';

-- ── PARA USAR DEPOIS (não executar agora) ─────────────────────────────────
-- Após validar produção, executar em migration separada:
-- alter table public.news
--   drop column if exists title,
--   drop column if exists excerpt,
--   drop column if exists content,
--   drop column if exists lang;
