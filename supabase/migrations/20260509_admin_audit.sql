-- =============================================================================
-- CONSUDES CMS — Auditoria administrativa
-- Migration: 20260509_admin_audit.sql
-- =============================================================================
-- Cria a tabela admin_audit_logs para rastrear todas as ações do painel admin.
-- RLS: somente service_role pode inserir; leitura proibida para anon/authenticated.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUM: audit_action
-- Ações rastreadas pelo painel administrativo
-- ---------------------------------------------------------------------------

do $$ begin
  create type audit_action as enum (
    'create_news',
    'edit_news',
    'publish_news',
    'unpublish_news',
    'delete_news',
    'upload_image',
    'delete_image',
    'create_report',
    'delete_report',
    'create_federation',
    'edit_federation',
    'delete_federation'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- TABLE: admin_audit_logs
-- ---------------------------------------------------------------------------

create table if not exists public.admin_audit_logs (
    id uuid primary key default gen_random_uuid (),
    actor_email text not null, -- email de quem executou
    action audit_action not null, -- ação realizada
    entity_type text not null, -- 'news' | 'image' | 'report' | ...
    entity_id uuid, -- id do registro afetado (nullable para uploads)
    entity_title text, -- título/nome legível do item
    reason text, -- obrigatório quando action = delete_*
    metadata jsonb not null default '{}'::jsonb, -- dados extras livres
    created_at timestamptz not null default now()
);

comment on table public.admin_audit_logs is 'Log de auditoria das ações do painel administrativo.';

comment on column public.admin_audit_logs.actor_email is 'E-mail do usuário que executou a ação.';

comment on column public.admin_audit_logs.action is 'Tipo de ação realizada.';

comment on column public.admin_audit_logs.entity_type is 'Tipo de entidade afetada (news, image, report, ...).';

comment on column public.admin_audit_logs.entity_id is 'UUID do registro afetado, se aplicável.';

comment on column public.admin_audit_logs.entity_title is 'Título ou nome legível do item afetado.';

comment on column public.admin_audit_logs.reason is 'Motivo da ação; obrigatório para exclusões.';

comment on column public.admin_audit_logs.metadata is 'Dados adicionais em formato livre (JSON).';

create index if not exists idx_audit_actor on public.admin_audit_logs (actor_email);

create index if not exists idx_audit_action on public.admin_audit_logs (action);

create index if not exists idx_audit_entity on public.admin_audit_logs (entity_type, entity_id);

create index if not exists idx_audit_created on public.admin_audit_logs (created_at desc);

alter table public.admin_audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- RLS POLICIES
-- Anon e authenticated NÃO lêem nem escrevem.
-- Inserção apenas via service_role (chamado pelas Edge Functions).
-- ---------------------------------------------------------------------------

-- Nenhuma policy SELECT para anon/authenticated → bloqueio total por padrão

-- Permitir inserção apenas para o role service_role (via Edge Function)
do $$ begin
  create policy "audit: inserção apenas service_role"
    on public.admin_audit_logs
    for insert
    to service_role
    with check (true);
exception when duplicate_object then null; end $$;

-- Leitura restrita ao service_role (para futura tela de logs no painel)
do $$ begin
  create policy "audit: leitura apenas service_role"
    on public.admin_audit_logs
    for select
    to service_role
    using (true);
exception when duplicate_object then null; end $$;