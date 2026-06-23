import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import type { AuditAction, AuditLogInsert } from "../lib/database.aliases";

/**
 * Payload para registrar uma ação de auditoria.
 * `actor_email` é preenchido automaticamente pelo hook.
 *
 * Usa `AuditAction` ao invés de `Enums<'audit_action'>` para incluir
 * ações legadas de calendário e galeria.
 */
export type AuditEntry = Omit<AuditLogInsert, "actor_email" | "action"> & {
  action: AuditAction;
  module?: string;
};

const MODULE_FALLBACK_BY_ENTITY_TYPE: Record<string, string> = {
  news: "noticias",
  report: "relatorios",
  federation: "federacoes",
  calendar_event: "calendario",
  gallery_album: "galeria",
  image: "galeria"
};

/**
 * Hook para registrar ações no log de auditoria via Edge Function.
 *
 * Usa a rota `/functions/v1/notify-admin-action` que:
 *   1. Insere em admin_audit_logs (service_role).
 *   2. Envia notificação por e-mail ao responsável.
 */
export function useAuditLog() {
  const { user, session, profile } = useAuth();

  const log = useCallback(
    async (entry: AuditEntry): Promise<void> => {
      if (!user?.email || !session?.access_token) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      if (!supabaseUrl) return;

      // Type assertion: o Edge Function aceita AuditAction completo (com ações legadas)
      const resolvedModule =
        entry.module ??
        MODULE_FALLBACK_BY_ENTITY_TYPE[entry.entity_type] ??
        entry.entity_type;

      const payload = {
        ...entry,
        actor_email: user.email,
        user_id: user.id,
        user_role: profile?.role ?? null,
        module: resolvedModule
      } as unknown as AuditLogInsert;

      try {
        await fetch(`${supabaseUrl}/functions/v1/notify-admin-action`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify(payload)
        });
      } catch {
        // Falha silenciosa — não bloqueia a ação principal
      }
    },
    [user, session]
  );

  return { log };
}

// ── Re-export para conveniência ───────────────────────────────────────────────
export type { AuditAction };
