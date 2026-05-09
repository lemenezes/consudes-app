/**
 * Lista de e-mails autorizados a acessar o painel administrativo.
 *
 * Para ambientes com variável de ambiente:
 *   VITE_ADMIN_EMAILS=secretaria@consudes.org,backup@consudes.org
 *
 * Fallback: lista vazia (nenhum acesso sem configurar a variável).
 */
const rawEnv = (import.meta.env.VITE_ADMIN_ALLOWED_EMAIL as string | undefined) ?? '';

const ADMIN_EMAILS: Set<string> = new Set(
  rawEnv
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Retorna `true` se o e-mail está na allowlist de admins.
 * Comparação case-insensitive.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
