-- Diagnóstico seguro do schema CMS CONSUDES
-- NÃO altera dados, NÃO cria/droppa nada
-- Execute no Supabase SQL Editor para inspecionar estrutura real


-- 1. Tabelas existentes no schema public
-- ================================
select '1. Tabelas' as bloco, table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;


-- 2. Colunas das tabelas principais
-- ================================
select '2. Colunas' as bloco, table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('profiles', 'reports', 'news', 'calendar_events', 'federations')
order by table_name, ordinal_position;



-- 3. Policies das tabelas principais
-- ================================
select '3. Policies' as bloco, tablename, policyname, cmd, qual as definition, with_check as check_expression
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'reports', 'news', 'calendar_events', 'federations')
order by tablename, policyname;


-- 4. Buckets existentes no storage
-- ================================
select '4. Buckets' as bloco, id as bucket_id, name, public
from storage.buckets
order by name;



-- 5. Policies do storage.objects
-- ================================
select '5. Storage Policies' as bloco, tablename, policyname, cmd, qual as definition, with_check as check_expression
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;
