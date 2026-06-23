-- =============================================================================
-- CONSUDES CMS — Evolução mínima da auditoria administrativa
-- Migration: add user_id, user_role, module to admin_audit_logs
-- =============================================================================

alter table public.admin_audit_logs
  add column if not exists user_id uuid null,
  add column if not exists user_role text null,
  add column if not exists module text null;

comment on column public.admin_audit_logs.user_id is 'UUID do usuário autenticado que executou a ação.';
comment on column public.admin_audit_logs.user_role is 'Role do usuário no momento da ação.';
comment on column public.admin_audit_logs.module is 'Módulo administrativo associado à ação.';

create index if not exists idx_audit_user_id
  on public.admin_audit_logs (user_id);

create index if not exists idx_audit_user_role
  on public.admin_audit_logs (user_role);

create index if not exists idx_audit_module
  on public.admin_audit_logs (module);

create index if not exists idx_audit_created
  on public.admin_audit_logs (created_at desc);