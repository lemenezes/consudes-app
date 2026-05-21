-- Torna idempotente para ambiente local
drop table if exists public.reports cascade;
drop type if exists public.report_category cascade;


do $$
begin
  create type report_category as enum (
    'relatorio',
    'estatuto',
    'regulamento',
    'ata',
    'prestacao_contas',
    'documento_oficial'
  );
exception
  when duplicate_object then null;
end $$;

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

create index if not exists reports_status_idx on reports (status);
create index if not exists reports_year_idx on reports (year);
create index if not exists reports_category_idx on reports (category);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_updated_at on reports;

create trigger reports_updated_at
  before update on reports
  for each row execute procedure set_updated_at();

alter table reports enable row level security;

drop policy if exists "reports_public_read" on reports;
drop policy if exists "reports_admin_all" on reports;

create policy "reports_public_read"
  on reports for select
  using (status = 'published');

create policy "reports_admin_all"
  on reports for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');