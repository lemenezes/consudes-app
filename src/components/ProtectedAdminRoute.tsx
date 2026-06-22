import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "./AdminLayout";
import { canAccessModule } from "../utils/rbac";
import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "../context/ToastContext";
import ForcedPasswordChangeModal from "./ForcedPasswordChangeModal";

// Mapeamento de path para módulo RBAC
const PATH_MODULE_MAP: Record<string, string> = {
  "": "dashboard",
  noticias: "noticias",
  "noticias/nova": "noticias",
  "noticias/:id/editar": "noticias",
  calendario: "calendario",
  "calendario/novo": "calendario",
  "calendario/:id/editar": "calendario",
  transparencia: "transparencia",
  "transparencia/novo": "transparencia",
  "transparencia/:id/editar": "transparencia",
  federacoes: "federacoes",
  "federacoes/nova": "federacoes",
  "federacoes/:id/editar": "federacoes"
};

function getModuleFromPath(pathname: string): string | null {
  // Remove prefix '/admin' e leading/trailing slashes
  let sub = pathname.replace(/^\/admin\/?/, "").replace(/\/$/, "");
  // Normaliza rotas dinâmicas para pattern
  if (/^noticias\/[\w-]+\/editar$/.test(sub)) return "noticias";
  if (/^calendario\/[\w-]+\/editar$/.test(sub)) return "calendario";
  if (/^transparencia\/[\w-]+\/editar$/.test(sub)) return "transparencia";
  if (/^federacoes\/[\w-]+\/editar$/.test(sub)) return "federacoes";
  return PATH_MODULE_MAP[sub] || null;
}

export default function ProtectedAdminRoute() {
  // TODOS OS HOOKS NO TOPO
  const { user, loading, signOut, profile, profileLoading, refreshProfile } =
    useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const module = useMemo(
    () => getModuleFromPath(location.pathname),
    [location.pathname]
  );
  const role = profile?.role;
  const hasAdminRole = !!role && canAccessModule(role, "dashboard");
  const mustChangePassword = Boolean(profile?.must_change_password);
  // Se não for rota de módulo conhecido, libera acesso (ex: dashboard, rotas futuras)
  const canAccess = hasAdminRole && (!module || canAccessModule(role, module));

  const handleForcePasswordChange = async (newPassword: string) => {
    if (!user) return;

    setIsUpdatingPassword(true);

    const { error: updatePasswordError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updatePasswordError) {
      showToast(
        updatePasswordError.message || "Não foi possível atualizar a senha.",
        "error"
      );
      setIsUpdatingPassword(false);
      return;
    }

    const { error: edgeError } = await supabase.functions.invoke(
      "complete-password-change"
    );

    if (edgeError) {
      showToast(
        edgeError.message ||
          "Senha alterada, mas não foi possível concluir a atualização do perfil.",
        "error"
      );
      setIsUpdatingPassword(false);
      return;
    }

    const { error: refreshError } = await refreshProfile();
    if (refreshError) {
      showToast(
        "Senha alterada, mas não foi possível recarregar seu perfil. Tente novamente.",
        "error"
      );
      setIsUpdatingPassword(false);
      return;
    }

    showToast("Senha alterada com sucesso. Acesso liberado.", "success");
    setIsUpdatingPassword(false);
  };

  // RETORNOS CONDICIONAIS APÓS HOOKS
  // Só mostra loading global se não há user ou profile carregados
  if ((loading || profileLoading) && (!user || !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-8 h-8 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Usuário sem role administrativa não pode acessar o painel.
  if (!hasAdminRole) {
    signOut();
    return <Navigate to="/admin/login" replace />;
  }

  if (!canAccess) {
    // Evita loop: se já está no /admin, não redireciona
    if (location.pathname === "/admin") {
      return <AdminLayout />;
    }
    return <Navigate to="/admin" replace />;
  }

  // Renderiza layout e Outlet de forma compatível
  return (
    <>
      <AdminLayout />
      {mustChangePassword && (
        <ForcedPasswordChangeModal
          loading={isUpdatingPassword}
          onConfirm={handleForcePasswordChange}
        />
      )}
    </>
  );
}
