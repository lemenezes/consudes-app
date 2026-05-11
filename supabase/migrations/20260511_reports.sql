-- ── Tabela reports ───────────────────────────────────────────────────────────

create type report_category as enum (
  'relatorio',
  'estatuto',
  'regulamento',
  'ata',
  'prestacao_contas',
  'documento_oficial'
);

create table if not exists reports (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  description text,
  category    report_category not null default 'documento_oficial',
  year        int not null,
  doc_date    date,
  file_url    text,
  status      text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured    boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Índices ────────────────────────────────────────────────────────────────
create index reports_status_idx  on reports (status);
create index reports_year_idx    on reports (year);
create index reports_category_idx on reports (category);

-- ── Updated_at automático ─────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reports_updated_at
  before update on reports
  for each row execute procedure set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────
alter table reports enable row level security;

-- Leitura pública: apenas publicados
create policy "reports_public_read"
  on reports for select
  using (status = 'published');

-- Escrita: apenas admin autenticado
create policy "reports_admin_all"
  on reports for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
