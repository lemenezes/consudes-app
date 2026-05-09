-- =============================================================================
-- CONSUDES CMS — Policies e permissões da tabela news
-- Migration: 20260509_news_policies.sql
-- =============================================================================
-- Libera acesso completo à tabela news para usuários autenticados.
-- TODO: restringir escrita apenas ao email admin (via allowlist ou custom claim).
-- =============================================================================

-- Permissões SQL base
grant select, insert, update, delete on public.news to authenticated;

-- Leitura: authenticated vê todas (rascunhos, arquivadas, publicadas)
do $$ begin
  create policy "news: admin lê todas"
    on public.news for select
    to authenticated
    using (true);
exception when duplicate_object then null; end $$;

-- Escrita: authenticated pode criar/editar/apagar
do $$ begin
  create policy "news: admin escreve"
    on public.news for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null; end $$;