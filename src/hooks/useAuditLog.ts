import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AuditAction, AuditLogInsert } from '../lib/database.types';

/**
 * Payload para registrar uma ação de auditoria.
 * `actor_email` é preenchido automaticamente pelo hook.
 */
export type AuditEntry = Omit<AuditLogInsert, 'actor_email'>;

/**
 * Hook para registrar ações no log de auditoria via Edge Function.
 *
 * Usa a rota `/functions/v1/notify-admin-action` que:
 *   1. Insere em admin_audit_logs (service_role).
 *   2. Envia notificação por e-mail ao responsável.
 */
export function useAuditLog() {
  const { user, session } = useAuth();

  const log = useCallback(
    async (entry: AuditEntry): Promise<void> => {
      if (!user?.email || !session?.access_token) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      if (!supabaseUrl) return;

      const payload: AuditLogInsert = { ...entry, actor_email: user.email };

      try {
        await fetch(`${supabaseUrl}/functions/v1/notify-admin-action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(payload),
        });
      } catch {
        // Falha silenciosa — não bloqueia a ação principal
      }
    },
    [user, session],
  );

  return { log };
}

// ── Re-export para conveniência ───────────────────────────────────────────────
export type { AuditAction };
