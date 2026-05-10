-- =============================================================================
-- CONSUDES CMS — Tabela de Eventos do Calendário
-- Migration: 20260510_calendar_events.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUMs
-- ---------------------------------------------------------------------------

do $$ begin
  create type calendar_event_category as enum (
    'interclubes', 'sub21', 'adulto', 'institucional', 'outro'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type calendar_event_type as enum (
    'championship', 'interclubs', 'congress', 'assembly', 'institutional'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type calendar_event_status as enum (
    'upcoming', 'registrations_open', 'confirmed', 'finished'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type date_precision as enum ('full', 'month', 'year');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- TABLE: calendar_events
-- ---------------------------------------------------------------------------

create table if not exists public.calendar_events (
    id              uuid primary key default gen_random_uuid(),
    title           text not null,
    slug            text not null unique,
    description     text,
    full_description text,

-- Datas
start_date date not null,
end_date date,
date_precision date_precision not null default 'full',

-- Localização
country text not null default '',
city text,
venue text,
location_open boolean not null default false,

-- Classificação
sport text not null default 'Fútbol Sala',
category calendar_event_category not null default 'outro',
event_type calendar_event_type not null default 'championship',
event_status calendar_event_status not null default 'upcoming',

-- Metadados
federation text,
link text,
cover_url text,

-- Controle de publicação
status          publish_status not null default 'draft',
    featured        boolean not null default false,
    sort_order      integer not null default 0,

    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

comment on table public.calendar_events is 'Eventos esportivos e institucionais do calendário da CONSUDES.';

comment on column public.calendar_events.date_precision is 'full = datas exatas; month = apenas mês/ano; year = apenas ano.';

comment on column public.calendar_events.location_open is 'true quando a sede ainda não foi definida (aberta a candidaturas).';

comment on column public.calendar_events.event_status is 'Estado do evento: upcoming, registrations_open, confirmed, finished.';

comment on column public.calendar_events.status is 'Estado de publicação no CMS: draft, published, archived.';

create index if not exists idx_calendar_events_status on public.calendar_events (status);

create index if not exists idx_calendar_events_start_date on public.calendar_events (start_date asc);

create index if not exists idx_calendar_events_event_status on public.calendar_events (event_status);

create index if not exists idx_calendar_events_featured on public.calendar_events (featured)
where
    featured = true;

-- Trigger updated_at (reutiliza função criada na migration de news)
drop trigger if exists trg_calendar_events_updated_at on public.calendar_events;

create trigger trg_calendar_events_updated_at
  before update on public.calendar_events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.calendar_events enable row level security;

-- Leitura pública: apenas eventos publicados
do $$ begin
  create policy "calendar_events: public read published"
    on public.calendar_events for select
    to anon
    using (status = 'published');
exception when duplicate_object then null; end $$;

-- Autenticado lê tudo (rascunhos, arquivados, etc.)
do $$ begin
  create policy "calendar_events: admin read all"
    on public.calendar_events for select
    to authenticated
    using (true);
exception when duplicate_object then null; end $$;

-- Autenticado escreve tudo
do $$ begin
  create policy "calendar_events: admin write"
    on public.calendar_events for all
    to authenticated
    using (true)
    with check (true);
exception when duplicate_object then null; end $$;

-- Permissões SQL
grant select on public.calendar_events to anon;

grant
select, insert,
update, delete on public.calendar_events to authenticated;

-- ---------------------------------------------------------------------------
-- SEED: eventos reais do site CONSUDES (2025–2027)
-- Inseridos como 'published' para aparecer imediatamente na página pública.
-- ---------------------------------------------------------------------------

insert into
    public.calendar_events (
        title,
        slug,
        description,
        start_date,
        end_date,
        date_precision,
        country,
        city,
        sport,
        category,
        event_type,
        event_status,
        federation,
        status,
        sort_order
    )
values (
        'Torneo Interclubes de Fútbol Sala',
        'interclubes-futsal-buenos-aires-2025',
        'Torneo interclubes de fútbol sala disputado en Buenos Aires, reuniendo los principales clubes de sordos de Sudamérica.',
        '2025-08-01',
        '2025-08-31',
        'month',
        'Argentina',
        'Buenos Aires',
        'Fútbol Sala',
        'interclubes',
        'interclubs',
        'finished',
        'FASDS',
        'published',
        10
    ),
    (
        'Campeonato Sudamericano de Fútbol Sala – Sub-21',
        'campeonato-sudamericano-futsal-sub21-2025',
        'Campeonato sudamericano de fútbol sala categoría Sub-21, disputado en São José dos Pinhais, Brasil.',
        '2025-12-01',
        '2025-12-31',
        'month',
        'Brasil',
        'São José dos Pinhais',
        'Fútbol Sala',
        'sub21',
        'championship',
        'finished',
        'CBDS',
        'published',
        20
    ),
    (
        'Torneo Interclubes de Fútbol Sala',
        'interclubes-futsal-florida-uruguay-2026',
        'Torneo interclubes de fútbol sala en Florida, Uruguay. Fechas confirmadas: 11 al 18 de octubre de 2026.',
        '2026-10-11',
        '2026-10-18',
        'full',
        'Uruguay',
        'Florida',
        'Fútbol Sala',
        'interclubes',
        'interclubs',
        'confirmed',
        'CONSUDES',
        'published',
        30
    ),
    (
        'Torneo Interclubes de Fútbol Sala',
        'interclubes-futsal-paraguay-2027',
        'Torneo interclubes de fútbol sala con sede en Paraguay, programado para junio de 2027.',
        '2027-06-01',
        '2027-06-30',
        'month',
        'Paraguay',
        null,
        'Fútbol Sala',
        'interclubes',
        'interclubs',
        'upcoming',
        'CONSUDES',
        'published',
        40
    ),
    (
        'Campeonato Sudamericano de Fútbol Sala – Sub-21',
        'campeonato-sudamericano-futsal-sub21-2027',
        'Sede abierta a propuestas. Las federaciones interesadas pueden enviar su candidatura a CONSUDES.',
        '2027-01-01',
        '2027-12-31',
        'year',
        '',
        null,
        'Fútbol Sala',
        'sub21',
        'championship',
        'upcoming',
        'CONSUDES',
        'published',
        50
    ),
    (
        'Campeonato Sudamericano de Fútbol Sala',
        'campeonato-sudamericano-futsal-adulto-2027',
        'Sede abierta a propuestas. Las federaciones interesadas pueden enviar su candidatura a CONSUDES.',
        '2027-01-01',
        '2027-12-31',
        'year',
        '',
        null,
        'Fútbol Sala',
        'adulto',
        'championship',
        'upcoming',
        'CONSUDES',
        'published',
        60
    )
on conflict (slug) do nothing;