-- Adiciona troca obrigatoria de senha no primeiro acesso para usuarios administrativos
-- Requisitos:
--   - nova coluna must_change_password boolean not null default true
--   - backfill para usuarios ja existentes (false)

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.must_change_password
IS 'Quando true, exige alteracao de senha antes de usar o painel administrativo.';

-- Backfill de seguranca para nao bloquear usuarios ja existentes no deploy.
UPDATE public.profiles
SET must_change_password = false
WHERE must_change_password = true;

COMMIT;
