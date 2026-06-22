/**
 * Database Aliases — Compatibilidade com tipos legados
 *
 * Este arquivo re-exporta tipos derivados do schema Supabase gerado
 * e preserva tipos customizados/legados que não estão mais no schema.
 *
 * Objetivo: Manter `src/lib/database.types.ts` 100% gerado pelo Supabase,
 * enquanto fornece compatibilidade com o resto do projeto.
 */

import type { Database, Tables, TablesInsert, Enums } from "./database.types";

// Re-exportar Database type para compatibilidade
export type { Database };

// ────────────────────────────────────────────────────────────────────────────
// Aliases derivados do schema gerado (auto-gerado pelo Supabase)
// ────────────────────────────────────────────────────────────────────────────

/** Tipos de tabelas — Row (leitura) */
export type NewsRow = Tables<"news">;
export type FederationRow = Tables<"federations">;
export type GalleryRow = Tables<"gallery">;
export type ChampionshipRow = Tables<"championships">;
export type TeamMemberRow = Tables<"team_members">;
export type FormerPresidentRow = Tables<"former_presidents">;
export type ProfileRow = Tables<"profiles">;
export type AuditLogRow = Tables<"admin_audit_logs">;

/** Tipos de tabelas — Insert (criação) */
export type AuditLogInsert = TablesInsert<"admin_audit_logs">;

/** Enums do schema */
export type PublishStatus = Enums<"publish_status">;
export type ReportCategory = Enums<"report_category">;
export type CalendarEventCategory = Enums<"calendar_event_category">;
export type CalendarEventType = Enums<"calendar_event_type">;
export type CalendarEventStatus = Enums<"calendar_event_status">;
export type ChampionshipStatus = Enums<"championship_status">;
export type DatePrecision = Enums<"date_precision">;
export type Lang = Enums<"content_lang">;

/**
 * Audit Action — Union literal completa
 * Inclui ações do schema + ações legadas usadas no app
 */
export type AuditAction =
  // Ações presentes no enum do schema Supabase
  | "create_news"
  | "edit_news"
  | "publish_news"
  | "unpublish_news"
  | "delete_news"
  | "upload_image"
  | "delete_image"
  | "create_report"
  | "delete_report"
  | "create_federation"
  | "edit_federation"
  | "delete_federation"
  // Ações legadas do calendário (não no schema atualmente)
  | "create_calendar_event"
  | "edit_calendar_event"
  | "publish_calendar_event"
  | "unpublish_calendar_event"
  | "delete_calendar_event"
  // Ações legadas da galeria (não no schema atualmente)
  | "create_gallery_album"
  | "update_gallery_album"
  | "delete_gallery_album";

// ────────────────────────────────────────────────────────────────────────────
// Tipos legados/custom — preservados da versão anterior
// Não existem mais como tabelas/enums no schema gerado atual
// ────────────────────────────────────────────────────────────────────────────

/** Report — Tipo de estrutura específica do projeto */
export type ReportRow = Database["public"]["Tables"]["reports"]["Row"];

/**
 * Calendar Event — Tipo customizado que estende o gerado
 * Preservado para compatibilidade com páginas do projeto
 */
export interface CalendarEventRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  full_description: string | null;
  start_date: string; // date as YYYY-MM-DD
  end_date: string | null;
  date_precision: DatePrecision;
  country: string;
  city: string | null;
  venue: string | null;
  location_open: boolean;
  sport: string;
  category: CalendarEventCategory;
  event_type: CalendarEventType;
  event_status: CalendarEventStatus;
  federation: string | null;
  link: string | null;
  cover_url: string | null;
  status: PublishStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Profile Role — Enumeração local do projeto
 * Não existe como enum no schema Supabase atual
 */
export type ProfileRole =
  | "super_admin"
  | "secretaria"
  | "diretor_esportes"
  | "financeiro"
  | "editor";

/**
 * Profile Status — Estado de perfil/usuário
 * Não existe como enum no schema Supabase atual
 */
export type ProfileStatus = "approved" | "suspended";

/**
 * Access Request Status — Estado de requisição de acesso
 * Tabela/enum não existe no schema Supabase atual
 */
export type AccessRequestStatus = "pending" | "approved" | "rejected";

/**
 * Access Request Row — Estrutura de requisição de acesso
 * Tabela não existe no schema Supabase atual
 * Tipo criado como fallback para compatibilidade
 */
export interface AccessRequestRow {
  id: string;
  email: string;
  status: AccessRequestStatus;
  created_at: string;
  updated_at: string;
}
