-- =============================================================================
-- CONSUDES CMS — Federações (CMS completo)
-- Migration: 20260515_federations_cms.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Expandir tabela federations
-- ---------------------------------------------------------------------------

alter table public.federations
  add column if not exists acronym       text,
  add column if not exists name_es       text,
  add column if not exists name_pt       text,
  add column if not exists name_en       text,
  add column if not exists country_es    text,
  add column if not exists country_pt    text,
  add column if not exists country_en    text,
  add column if not exists flag          text not null default '',
  add column if not exists instagram_url text,
  add column if not exists facebook_url  text,
  add column if not exists youtube_url   text,
  add column if not exists twitter_url   text,
  add column if not exists linkedin_url  text,
  add column if not exists tiktok_url    text,
  add column if not exists flickr_url    text,
  add column if not exists updated_at    timestamptz not null default now();

update public.federations set name_es    = name    where name_es    is null and name    is not null;
update public.federations set country_es = country where country_es is null and country is not null;

-- ---------------------------------------------------------------------------
-- 2. Constraint unique na sigla
-- ---------------------------------------------------------------------------

do $$ begin
  alter table public.federations add constraint federations_acronym_key unique (acronym);
exception when duplicate_table then null; when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Trigger updated_at
-- ---------------------------------------------------------------------------

do $$ begin
  create trigger trg_federations_updated_at
    before update on public.federations
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------

alter table public.federations enable row level security;

grant select on public.federations to anon;
grant select, insert, update, delete on public.federations to authenticated;

do $$ begin
  create policy "federations: public lê todas"
    on public.federations for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "federations: admin escreve"
    on public.federations for all to authenticated
    using (true) with check (true);
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 5. Storage bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
  values ('cms-federations', 'cms-federations', true)
on conflict (id) do nothing;

do $$ begin
  create policy "cms-federations: public lê"
    on storage.objects for select using (bucket_id = 'cms-federations');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "cms-federations: auth upload"
    on storage.objects for insert to authenticated
    with check (bucket_id = 'cms-federations');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "cms-federations: auth delete"
    on storage.objects for delete to authenticated
    using (bucket_id = 'cms-federations');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 6. Seed
-- ---------------------------------------------------------------------------

insert into public.federations
  (acronym, name, name_es, name_pt, name_en,
   country, country_code, country_es, country_pt, country_en,
   flag, logo_url, website_url, instagram_url, facebook_url,
   youtube_url, twitter_url, linkedin_url, tiktok_url, flickr_url, sort_order)
values
  ('CADES',
   'Confederación Argentina de Deportes de Sordos', 'Confederación Argentina de Deportes de Sordos', 'Confederação Argentina de Esportes de Surdos', 'Argentine Confederation of Deaf Sports',
   'Argentina', 'AR', 'Argentina', 'Argentina', 'Argentina',
   '🇦🇷', '/images/federations/cades.webp', 'http://www.cades.org.ar/', 'https://www.instagram.com/cades_argentina/', 'https://www.facebook.com/CadesARG',
   'https://www.youtube.com/@cadesARG', 'https://x.com/CADES_Argentina', null, null, null, 1),

  ('FEBOS',
   'Federación Boliviana de Sordos', 'Federación Boliviana de Sordos', 'Federação Boliviana de Surdos', 'Bolivian Federation of the Deaf',
   'Bolivia', 'BO', 'Bolivia', 'Bolívia', 'Bolivia',
   '🇧🇴', '/images/federations/febos.webp', null, null, 'https://www.facebook.com/Febos.Bolivia/',
   null, null, null, null, null, 2),

  ('CBDS',
   'Confederación Brasileña de Deportes de Sordos', 'Confederación Brasileña de Deportes de Sordos', 'Confederação Brasileira de Desportos de Surdos', 'Brazilian Confederation of Deaf Sports',
   'Brasil', 'BR', 'Brasil', 'Brasil', 'Brazil',
   '🇧🇷', '/images/federations/cbds.webp', 'https://www.cbds.org.br/cbds/', 'https://www.instagram.com/cbdsbrasil/', 'https://www.facebook.com/cbdsbrasil/',
   'https://www.youtube.com/c/cbdsbrasil', 'https://x.com/cbdsbrasil/', null, null, 'https://www.flickr.com/photos/cbdsbrasil/albums/', 3),

  ('FEDENASC',
   'Federación Deportiva Nacional de Sordos de Chile', 'Federación Deportiva Nacional de Sordos de Chile', 'Federação Esportiva Nacional de Surdos do Chile', 'Chilean National Sports Federation of the Deaf',
   'Chile', 'CL', 'Chile', 'Chile', 'Chile',
   '🇨🇱', '/images/federations/fedenasc.webp', 'https://fedenaschile.cl/', 'https://www.instagram.com/fedenaschile/', 'https://www.facebook.com/fedenaschile.cl/',
   'https://www.youtube.com/channel/UCQAupEQi_vr4I-lj67cQhoA', null, null, null, null, 4),

  ('FENASCOL',
   'Federación Nacional de Sordos de Colombia', 'Federación Nacional de Sordos de Colombia', 'Federação Nacional de Surdos da Colômbia', 'National Federation of the Deaf of Colombia',
   'Colombia', 'CO', 'Colombia', 'Colômbia', 'Colombia',
   '🇨🇴', '/images/federations/fenascol.webp', 'https://fenascol.org.co/', 'https://www.instagram.com/fenascol/', 'https://www.facebook.com/fenascol',
   'https://www.youtube.com/channel/UCBFKvAm40Wq9VdIRVCUzmMQ', 'https://x.com/fenascol', 'https://www.linkedin.com/company/fenascol/', 'https://www.tiktok.com/@fenascol', null, 5),

  ('FEDEPDAL',
   'Federación Ecuatoriana de Deporte para Personas Sordas', 'Federación Ecuatoriana de Deporte para Personas Sordas', 'Federação Equatoriana de Esporte para Pessoas Surdas', 'Ecuadorian Sports Federation for Deaf Persons',
   'Ecuador', 'EC', 'Ecuador', 'Equador', 'Ecuador',
   '🇪🇨', '/images/federations/fedepdal.webp', null, 'https://www.instagram.com/fedepdal_ec_oficial/', 'https://www.facebook.com/FEDEPDAL',
   null, null, null, 'https://www.tiktok.com/@fedepdal', null, 6),

  ('FEDESPAR',
   'Federación Deportiva de Sordos del Paraguay', 'Federación Deportiva de Sordos del Paraguay', 'Federação Esportiva dos Surdos do Paraguai', 'Sports Federation of the Deaf of Paraguay',
   'Paraguay', 'PY', 'Paraguay', 'Paraguai', 'Paraguay',
   '🇵🇾', '/images/federations/fedespar.webp', null, 'https://www.instagram.com/fedespar005/', 'https://www.facebook.com/100069831503386/videos/',
   null, null, null, null, null, 7),

  ('FDNSP',
   'Federación Deportiva Nacional de Sordos del Perú', 'Federación Deportiva Nacional de Sordos del Perú', 'Federação Esportiva Nacional dos Surdos do Peru', 'National Sports Federation of the Deaf of Peru',
   'Perú', 'PE', 'Perú', 'Peru', 'Peru',
   '🇵🇪', '/images/federations/fdnsp.webp', null, null, 'https://www.facebook.com/profile.php?id=100087425774271',
   null, null, null, null, null, 8),

  ('ODSU',
   'Organización Deportiva de Sordos del Uruguay', 'Organización Deportiva de Sordos del Uruguay', 'Organização Esportiva dos Surdos do Uruguai', 'Sports Organization of the Deaf of Uruguay',
   'Uruguay', 'UY', 'Uruguay', 'Uruguai', 'Uruguay',
   '🇺🇾', '/images/federations/odsu.webp', 'http://sordos.org.uy/', 'https://www.instagram.com/odsusordos/', null,
   'https://www.youtube.com/channel/UCBg1rQx51PAEg6cRxPKgl9g', null, null, null, null, 9),

  ('FEPOSOR',
   'Federación Venezolana Polideportiva de Sordos', 'Federación Venezolana Polideportiva de Sordos', 'Federação Poliesportiva Venezuelana de Surdos', 'Venezuelan Multisports Federation of the Deaf',
   'Venezuela', 'VE', 'Venezuela', 'Venezuela', 'Venezuela',
   '🇻🇪', '/images/federations/feposor.webp', null, 'https://www.instagram.com/feposor_ve/', 'https://www.facebook.com/p/Feposor-Venezuela-100054981262698/',
   null, null, null, null, null, 10)

on conflict (acronym) do nothing;
