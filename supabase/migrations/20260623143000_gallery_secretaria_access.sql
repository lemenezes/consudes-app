-- =============================================================================
-- CONSUDES CMS — Galeria: secretaria pode gerenciar
-- =============================================================================
-- Objetivo:
--   - Permitir que a role secretaria acesse e gerencie a Galeria.
--   - Atualizar policies de gallery_albums e storage.objects.
-- =============================================================================

-- gallery_albums

drop policy if exists "Admin/Diretor/Editor can insert gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor/Secretaria can insert gallery_albums"
  on public.gallery_albums
  for insert
  with check (
    public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  );

drop policy if exists "Admin/Diretor/Editor can update gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor/Secretaria can update gallery_albums"
  on public.gallery_albums
  for update
  using (
    public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  )
  with check (
    public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  );

drop policy if exists "Admin/Diretor/Editor can delete gallery_albums" on public.gallery_albums;
create policy "Admin/Diretor/Editor/Secretaria can delete gallery_albums"
  on public.gallery_albums
  for delete
  using (
    public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  );

-- storage.objects: cms-gallery

drop policy if exists "Admin/Diretor/Editor pode upload cms-gallery" on storage.objects;
create policy "Admin/Diretor/Editor/Secretaria pode upload cms-gallery" on storage.objects
  for insert with check (
    bucket_id = 'cms-gallery' and public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  );

drop policy if exists "Admin/Diretor/Editor pode deletar cms-gallery" on storage.objects;
create policy "Admin/Diretor/Editor/Secretaria pode deletar cms-gallery" on storage.objects
  for delete using (
    bucket_id = 'cms-gallery' and public.has_role(array['super_admin','diretor_esportes','editor','secretaria'])
  );
