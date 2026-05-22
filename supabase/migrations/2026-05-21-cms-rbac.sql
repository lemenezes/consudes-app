-- Migration segura: RBAC real para CMS CONSUDES
-- NÃO altera dados, NÃO remove buckets, NÃO mexe em frontend
-- Idempotente: drop policy if exists

-- 1. Função helper para RBAC
create or replace function public.has_role(roles text[])
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(roles)
  );
$$;

-- 2. Remover policies permissivas antigas
-- =====================
DROP POLICY IF EXISTS "Authenticated users can select" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update" ON public.profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Authenticated users can select" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can update" ON public.news;
DROP POLICY IF EXISTS "Authenticated users can delete" ON public.news;

DROP POLICY IF EXISTS "Authenticated users can read news" ON public.news;
DROP POLICY IF EXISTS "news: admin escreve" ON public.news;
DROP POLICY IF EXISTS "news: admin lê todas" ON public.news;
DROP POLICY IF EXISTS "news: leitura pública de publicadas" ON public.news;

DROP POLICY IF EXISTS "Authenticated users can select" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can update" ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can delete" ON public.reports;
DROP POLICY IF EXISTS reports_admin_all ON public.reports;

DROP POLICY IF EXISTS "reports: leitura pública" ON public.reports;
DROP POLICY IF EXISTS reports_public_read ON public.reports;

DROP POLICY IF EXISTS "Authenticated users can select" ON public.calendar_events;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.calendar_events;
DROP POLICY IF EXISTS "Authenticated users can update" ON public.calendar_events;
DROP POLICY IF EXISTS "Authenticated users can delete" ON public.calendar_events;
DROP POLICY IF EXISTS admin_write ON public.calendar_events;

DROP POLICY IF EXISTS "calendar_events: admin read all" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events: admin write" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events: public read published" ON public.calendar_events;

DROP POLICY IF EXISTS "Authenticated users can select" ON public.federations;
DROP POLICY IF EXISTS "Authenticated users can insert" ON public.federations;
DROP POLICY IF EXISTS "Authenticated users can update" ON public.federations;
DROP POLICY IF EXISTS "Authenticated users can delete" ON public.federations;
DROP POLICY IF EXISTS admin_write ON public.federations;

DROP POLICY IF EXISTS "federations: admin escreve" ON public.federations;
DROP POLICY IF EXISTS "federations: leitura pública" ON public.federations;
DROP POLICY IF EXISTS "federations: public lê todas" ON public.federations;

DROP POLICY IF EXISTS "Authenticated upload cms-news" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms-news" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload cms-reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms-reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload cms-federations" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms-federations" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload cms-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms-gallery" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload cms-avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms-avatars" ON storage.objects;

DROP POLICY IF EXISTS "cms-federations: public lê" ON storage.objects;
DROP POLICY IF EXISTS "cms-news: select authenticated" ON storage.objects;
DROP POLICY IF EXISTS "cms-reports: select public" ON storage.objects;
DROP POLICY IF EXISTS "cms-reports: update authenticated" ON storage.objects;

-- 3. Policies RBAC novas
-- =====================

-- profiles
create policy if not exists "User can read own profile" on public.profiles
for select using (auth.uid() = id);

create policy if not exists "Super admin can update profiles" on public.profiles
for update using (public.has_role(array['super_admin']))
with check (true);

-- news
create policy if not exists "Public can read published news" on public.news
for select using (status = 'published');

create policy if not exists "Admin/Secretaria/Editor pode ler todas" on public.news
for select using (public.has_role(array['super_admin','secretaria','editor']));

create policy if not exists "Admin/Secretaria/Editor pode criar" on public.news
for insert with check (public.has_role(array['super_admin','secretaria','editor']));

create policy if not exists "Admin/Secretaria/Editor pode editar" on public.news
for update using (public.has_role(array['super_admin','secretaria','editor']))
with check (public.has_role(array['super_admin','secretaria','editor']));

create policy if not exists "Admin/Secretaria pode deletar" on public.news
for delete using (public.has_role(array['super_admin','secretaria']));

-- reports
create policy if not exists "Public can read published reports" on public.reports
for select using (status = 'published');

create policy if not exists "Admin/Secretaria/Financeiro pode ler todas" on public.reports
for select using (public.has_role(array['super_admin','secretaria','financeiro']));

create policy if not exists "Admin/Secretaria/Financeiro pode criar" on public.reports
for insert with check (public.has_role(array['super_admin','secretaria','financeiro']));

create policy if not exists "Admin/Secretaria/Financeiro pode editar" on public.reports
for update using (public.has_role(array['super_admin','secretaria','financeiro']))
with check (public.has_role(array['super_admin','secretaria','financeiro']));

create policy if not exists "Admin/Secretaria/Financeiro pode deletar" on public.reports
for delete using (public.has_role(array['super_admin','secretaria','financeiro']));

-- calendar_events
create policy if not exists "Public can read published events" on public.calendar_events
for select using (status = 'published');

create policy if not exists "Admin/Secretaria/Diretor pode ler todas" on public.calendar_events
for select using (public.has_role(array['super_admin','secretaria','diretor_esportes']));

create policy if not exists "Admin/Secretaria/Diretor pode criar" on public.calendar_events
for insert with check (public.has_role(array['super_admin','secretaria','diretor_esportes']));

create policy if not exists "Admin/Secretaria/Diretor pode editar" on public.calendar_events
for update using (public.has_role(array['super_admin','secretaria','diretor_esportes']))
with check (public.has_role(array['super_admin','secretaria','diretor_esportes']));

create policy if not exists "Admin/Secretaria pode deletar" on public.calendar_events
for delete using (public.has_role(array['super_admin','secretaria']));

-- federations
create policy if not exists "Public can read federations" on public.federations
for select using (true);

create policy if not exists "Admin/Secretaria pode criar" on public.federations
for insert with check (public.has_role(array['super_admin','secretaria']));

create policy if not exists "Admin/Secretaria pode editar" on public.federations
for update using (public.has_role(array['super_admin','secretaria']))
with check (public.has_role(array['super_admin','secretaria']));

create policy if not exists "Admin pode deletar" on public.federations
for delete using (public.has_role(array['super_admin']));

-- storage.objects: cms-news
create policy if not exists "Public can read cms-news" on storage.objects
for select using (bucket_id = 'cms-news');

create policy if not exists "Admin/Secretaria/Editor pode upload cms-news" on storage.objects
for insert with check (
  bucket_id = 'cms-news' and public.has_role(array['super_admin','secretaria','editor'])
);

create policy if not exists "Admin/Secretaria/Editor pode deletar cms-news" on storage.objects
for delete using (
  bucket_id = 'cms-news' and public.has_role(array['super_admin','secretaria','editor'])
);

-- storage.objects: cms-reports
create policy if not exists "Public can read cms-reports" on storage.objects
for select using (bucket_id = 'cms-reports');

create policy if not exists "Admin/Secretaria/Financeiro pode upload cms-reports" on storage.objects
for insert with check (
  bucket_id = 'cms-reports' and public.has_role(array['super_admin','secretaria','financeiro'])
);

create policy if not exists "Admin/Secretaria/Financeiro pode update cms-reports" on storage.objects
for update using (
  bucket_id = 'cms-reports' and public.has_role(array['super_admin','secretaria','financeiro'])
) with check (
  bucket_id = 'cms-reports' and public.has_role(array['super_admin','secretaria','financeiro'])
);

create policy if not exists "Admin/Secretaria/Financeiro pode deletar cms-reports" on storage.objects
for delete using (
  bucket_id = 'cms-reports' and public.has_role(array['super_admin','secretaria','financeiro'])
);

-- storage.objects: cms-federations
create policy if not exists "Public can read cms-federations" on storage.objects
for select using (bucket_id = 'cms-federations');

create policy if not exists "Admin/Secretaria pode upload cms-federations" on storage.objects
for insert with check (
  bucket_id = 'cms-federations' and public.has_role(array['super_admin','secretaria'])
);

create policy if not exists "Admin/Secretaria pode deletar cms-federations" on storage.objects
for delete using (
  bucket_id = 'cms-federations' and public.has_role(array['super_admin','secretaria'])
);

-- storage.objects: cms-gallery
create policy if not exists "Public can read cms-gallery" on storage.objects
for select using (bucket_id = 'cms-gallery');

create policy if not exists "Admin/Diretor/Editor pode upload cms-gallery" on storage.objects
for insert with check (
  bucket_id = 'cms-gallery' and public.has_role(array['super_admin','diretor_esportes','editor'])
);

create policy if not exists "Admin/Diretor/Editor pode deletar cms-gallery" on storage.objects
for delete using (
  bucket_id = 'cms-gallery' and public.has_role(array['super_admin','diretor_esportes','editor'])
);

-- storage.objects: cms-avatars
create policy if not exists "Public can read cms-avatars" on storage.objects
for select using (bucket_id = 'cms-avatars');

create policy if not exists "User pode upload/update/delete próprio avatar" on storage.objects
for all using (
  bucket_id = 'cms-avatars' and (
    public.has_role(array['super_admin'])
    or (auth.uid()::text = left(name, 36))
  )
) with check (
  bucket_id = 'cms-avatars' and (
    public.has_role(array['super_admin'])
    or (auth.uid()::text = left(name, 36))
  )
);
