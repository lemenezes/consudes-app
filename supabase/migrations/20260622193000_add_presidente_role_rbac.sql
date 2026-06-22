-- =============================================================================
-- CONSUDES CMS — Add role presidente (conteudo administrativo)
-- Migration: 20260622193000_add_presidente_role_rbac.sql
-- =============================================================================
-- Objetivo:
--   - Incluir role 'presidente' no check de public.profiles.role.
--   - Conceder acesso de conteudo administrativo para 'presidente'.
--   - Manter a gestao de perfis/roles exclusiva de super_admin.
-- =============================================================================

-- 1) Constraint de role em profiles
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (
    role in (
      'user',
      'super_admin',
      'presidente',
      'secretaria',
      'diretor_esportes',
      'financeiro',
      'editor'
    )
  );

-- 2) Profiles: manter update de perfis restrito a super_admin
-- (nao adicionar 'presidente' aqui)
drop policy if exists "Super admin can update profiles" on public.profiles;
create policy "Super admin can update profiles" on public.profiles
  for update using (public.has_role(array['super_admin']))
  with check (true);

-- 3) News
drop policy if exists "Admin/Secretaria/Editor pode ler todas" on public.news;
create policy "Admin/Secretaria/Editor pode ler todas" on public.news
  for select using (public.has_role(array['super_admin','presidente','secretaria','editor']));

drop policy if exists "Admin/Secretaria/Editor pode criar" on public.news;
create policy "Admin/Secretaria/Editor pode criar" on public.news
  for insert with check (public.has_role(array['super_admin','presidente','secretaria','editor']));

drop policy if exists "Admin/Secretaria/Editor pode editar" on public.news;
create policy "Admin/Secretaria/Editor pode editar" on public.news
  for update using (public.has_role(array['super_admin','presidente','secretaria','editor']))
  with check (public.has_role(array['super_admin','presidente','secretaria','editor']));

drop policy if exists "Admin/Secretaria pode deletar" on public.news;
create policy "Admin/Secretaria pode deletar" on public.news
  for delete using (public.has_role(array['super_admin','presidente','secretaria']));

-- 4) Reports
drop policy if exists "Admin/Secretaria/Financeiro pode ler todas" on public.reports;
create policy "Admin/Secretaria/Financeiro pode ler todas" on public.reports
  for select using (public.has_role(array['super_admin','presidente','secretaria','financeiro']));

drop policy if exists "Admin/Secretaria/Financeiro pode criar" on public.reports;
create policy "Admin/Secretaria/Financeiro pode criar" on public.reports
  for insert with check (public.has_role(array['super_admin','presidente','secretaria','financeiro']));

drop policy if exists "Admin/Secretaria/Financeiro pode editar" on public.reports;
create policy "Admin/Secretaria/Financeiro pode editar" on public.reports
  for update using (public.has_role(array['super_admin','presidente','secretaria','financeiro']))
  with check (public.has_role(array['super_admin','presidente','secretaria','financeiro']));

drop policy if exists "Admin/Secretaria/Financeiro pode deletar" on public.reports;
create policy "Admin/Secretaria/Financeiro pode deletar" on public.reports
  for delete using (public.has_role(array['super_admin','presidente','secretaria','financeiro']));

-- 5) Calendar Events
drop policy if exists "Admin/Secretaria/Diretor pode ler todas" on public.calendar_events;
create policy "Admin/Secretaria/Diretor pode ler todas" on public.calendar_events
  for select using (public.has_role(array['super_admin','presidente','secretaria','diretor_esportes']));

drop policy if exists "Admin/Secretaria/Diretor pode criar" on public.calendar_events;
create policy "Admin/Secretaria/Diretor pode criar" on public.calendar_events
  for insert with check (public.has_role(array['super_admin','presidente','secretaria','diretor_esportes']));

drop policy if exists "Admin/Secretaria/Diretor pode editar" on public.calendar_events;
create policy "Admin/Secretaria/Diretor pode editar" on public.calendar_events
  for update using (public.has_role(array['super_admin','presidente','secretaria','diretor_esportes']))
  with check (public.has_role(array['super_admin','presidente','secretaria','diretor_esportes']));

drop policy if exists "Admin/Secretaria pode deletar" on public.calendar_events;
create policy "Admin/Secretaria pode deletar" on public.calendar_events
  for delete using (public.has_role(array['super_admin','presidente','secretaria']));

-- 6) Federations
drop policy if exists "Admin/Secretaria pode criar" on public.federations;
create policy "Admin/Secretaria pode criar" on public.federations
  for insert with check (public.has_role(array['super_admin','presidente','secretaria']));

drop policy if exists "Admin/Secretaria pode editar" on public.federations;
create policy "Admin/Secretaria pode editar" on public.federations
  for update using (public.has_role(array['super_admin','presidente','secretaria']))
  with check (public.has_role(array['super_admin','presidente','secretaria']));

drop policy if exists "Admin pode deletar" on public.federations;
create policy "Admin pode deletar" on public.federations
  for delete using (public.has_role(array['super_admin','presidente']));

-- 7) Gallery Albums
drop policy if exists "Admin/Diretor/Editor can insert gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can insert gallery_albums" on public.gallery_albums
  for insert
  with check (public.has_role(array['super_admin','presidente','diretor_esportes','editor']));

drop policy if exists "Admin/Diretor/Editor can update gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can update gallery_albums" on public.gallery_albums
  for update
  using (public.has_role(array['super_admin','presidente','diretor_esportes','editor']))
  with check (public.has_role(array['super_admin','presidente','diretor_esportes','editor']));

drop policy if exists "Admin/Diretor/Editor can delete gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor can delete gallery_albums" on public.gallery_albums
  for delete
  using (public.has_role(array['super_admin','presidente','diretor_esportes','editor']));

-- 8) Storage buckets de conteudo
-- cms-news
drop policy if exists "Admin/Secretaria/Editor pode upload cms-news" on storage.objects;
create policy "Admin/Secretaria/Editor pode upload cms-news" on storage.objects
  for insert with check (
    bucket_id = 'cms-news' and public.has_role(array['super_admin','presidente','secretaria','editor'])
  );

drop policy if exists "Admin/Secretaria/Editor pode deletar cms-news" on storage.objects;
create policy "Admin/Secretaria/Editor pode deletar cms-news" on storage.objects
  for delete using (
    bucket_id = 'cms-news' and public.has_role(array['super_admin','presidente','secretaria','editor'])
  );

-- cms-reports
drop policy if exists "Admin/Secretaria/Financeiro pode upload cms-reports" on storage.objects;
create policy "Admin/Secretaria/Financeiro pode upload cms-reports" on storage.objects
  for insert with check (
    bucket_id = 'cms-reports' and public.has_role(array['super_admin','presidente','secretaria','financeiro'])
  );

drop policy if exists "Admin/Secretaria/Financeiro pode update cms-reports" on storage.objects;
create policy "Admin/Secretaria/Financeiro pode update cms-reports" on storage.objects
  for update using (
    bucket_id = 'cms-reports' and public.has_role(array['super_admin','presidente','secretaria','financeiro'])
  ) with check (
    bucket_id = 'cms-reports' and public.has_role(array['super_admin','presidente','secretaria','financeiro'])
  );

drop policy if exists "Admin/Secretaria/Financeiro pode deletar cms-reports" on storage.objects;
create policy "Admin/Secretaria/Financeiro pode deletar cms-reports" on storage.objects
  for delete using (
    bucket_id = 'cms-reports' and public.has_role(array['super_admin','presidente','secretaria','financeiro'])
  );

-- cms-federations
drop policy if exists "Admin/Secretaria pode upload cms-federations" on storage.objects;
create policy "Admin/Secretaria pode upload cms-federations" on storage.objects
  for insert with check (
    bucket_id = 'cms-federations' and public.has_role(array['super_admin','presidente','secretaria'])
  );

drop policy if exists "Admin/Secretaria pode deletar cms-federations" on storage.objects;
create policy "Admin/Secretaria pode deletar cms-federations" on storage.objects
  for delete using (
    bucket_id = 'cms-federations' and public.has_role(array['super_admin','presidente','secretaria'])
  );

-- cms-gallery
drop policy if exists "Admin/Diretor/Editor pode upload cms-gallery" on storage.objects;
create policy "Admin/Diretor/Editor pode upload cms-gallery" on storage.objects
  for insert with check (
    bucket_id = 'cms-gallery' and public.has_role(array['super_admin','presidente','diretor_esportes','editor'])
  );

drop policy if exists "Admin/Diretor/Editor pode deletar cms-gallery" on storage.objects;
create policy "Admin/Diretor/Editor pode deletar cms-gallery" on storage.objects
  for delete using (
    bucket_id = 'cms-gallery' and public.has_role(array['super_admin','presidente','diretor_esportes','editor'])
  );
