import type { ProfileRole } from "../types";

// Mapeamento de módulos do CMS por perfil
export const ROLE_MODULES: Record<ProfileRole, string[]> = {
  super_admin: [
    "noticias",
    "documentos",
    "calendario",
    "paginas",
    "esportes",
    "calendario_esportivo",
    "eventos",
    "galeria",
    "transparencia",
    "relatorios",
    "documentos_financeiros",
    "federacoes",
    "dashboard"
  ],
  presidente: [
    "noticias",
    "documentos",
    "calendario",
    "paginas",
    "esportes",
    "calendario_esportivo",
    "eventos",
    "galeria",
    "transparencia",
    "relatorios",
    "documentos_financeiros",
    "federacoes",
    "dashboard"
  ],
  secretaria: [
    "noticias",
    "documentos",
    "calendario",
    "paginas",
    "galeria",
    "transparencia",
    "relatorios",
    "federacoes",
    "dashboard"
  ],
  diretor_esportes: [
    "esportes",
    "calendario_esportivo",
    "eventos",
    "galeria",
    "dashboard"
  ],
  financeiro: [
    "transparencia",
    "relatorios",
    "documentos_financeiros",
    "dashboard"
  ],
  editor: ["noticias", "galeria", "dashboard"]
};

// Permissões por módulo (CRUD)
export type Permission = "read" | "create" | "update" | "delete";

// super_admin sempre tem acesso total
export function hasPermission(
  role: ProfileRole,
  module: string,
  _action: Permission
): boolean {
  if (role === "super_admin") return true;
  const modules = ROLE_MODULES[role] ?? [];
  // Por padrão, todos os módulos do perfil têm CRUD completo
  return modules.includes(module);
}

// Verifica se o usuário pode acessar um módulo
export function canAccessModule(role: ProfileRole, module: string): boolean {
  if (role === "super_admin") return true;
  const modules = ROLE_MODULES[role] ?? [];
  return modules.includes(module);
}

// Sugestão de nomes de módulos para uso nas proteções:
export const MODULE_LABELS = {
  noticias: "Notícias",
  documentos: "Documentos institucionais",
  calendario: "Calendário",
  paginas: "Páginas institucionais",
  esportes: "Esportes",
  calendario_esportivo: "Calendário esportivo",
  eventos: "Eventos",
  galeria: "Galeria",
  transparencia: "Transparência",
  relatorios: "Relatórios",
  documentos_financeiros: "Documentos financeiros",
  federacoes: "Federações",
  dashboard: "Dashboard"
};
