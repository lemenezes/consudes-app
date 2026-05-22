-- Migration: Adiciona coluna 'role' à tabela public.profiles para RBAC seguro
-- Não aplica RLS nem policies ainda

-- 1. Adicionar coluna 'role' se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN role text NOT NULL DEFAULT 'user';
  END IF;
END$$;

-- 2. Adicionar constraint check para valores permitidos
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'user',
    'super_admin',
    'secretaria',
    'diretor_esportes',
    'financeiro',
    'editor'
  ));

-- 3. Atualizar seu usuário para super_admin
-- Substitua 'SEU_EMAIL_AQUI' pelo seu email real se o campo existir
UPDATE public.profiles
   SET role = 'super_admin'
 WHERE email = 'SEU_EMAIL_AQUI';

-- Se não houver coluna 'email' em profiles, atualize manualmente pelo id do usuário:
-- UPDATE public.profiles SET role = 'super_admin' WHERE id = 'SEU_AUTH_USER_ID';
