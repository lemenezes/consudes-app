import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import { isAdminEmail } from '../utils/adminAllowlist';
import { canAccessModule } from '../utils/rbac';
import { useMemo } from 'react';

// Mapeamento de path para módulo RBAC
const PATH_MODULE_MAP: Record<string, string> = {
  '': 'dashboard',
  'noticias': 'noticias',
  'noticias/nova': 'noticias',
  'noticias/:id/editar': 'noticias',
  'calendario': 'calendario',
  'calendario/novo': 'calendario',
  'calendario/:id/editar': 'calendario',
  'transparencia': 'transparencia',
  'transparencia/novo': 'transparencia',
  'transparencia/:id/editar': 'transparencia',
  'federacoes': 'federacoes',
  'federacoes/nova': 'federacoes',
  'federacoes/:id/editar': 'federacoes',
};

function getModuleFromPath(pathname: string): string | null {
  // Remove prefix '/admin' e leading/trailing slashes
  let sub = pathname.replace(/^\/admin\/?/, '').replace(/\/$/, '');
  // Normaliza rotas dinâmicas para pattern
  if (/^noticias\/[\w-]+\/editar$/.test(sub)) return 'noticias';
  if (/^calendario\/[\w-]+\/editar$/.test(sub)) return 'calendario';
  if (/^transparencia\/[\w-]+\/editar$/.test(sub)) return 'transparencia';
  if (/^federacoes\/[\w-]+\/editar$/.test(sub)) return 'federacoes';
  return PATH_MODULE_MAP[sub] || null;
}

export default function ProtectedAdminRoute() {
  const { user, loading, signOut, profile, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-8 h-8 border-4 border-[#0057A8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Email não está na allowlist → desloga e bloqueia
  if (!isAdminEmail(user.email)) {
    signOut();
    return <Navigate to="/admin/login" replace />;
  }

  // Proteção por RBAC
  const module = useMemo(() => getModuleFromPath(location.pathname), [location.pathname]);
  const role = profile?.role;
  // Se não for rota de módulo conhecido, libera acesso (ex: dashboard, rotas futuras)
  const canAccess = !module || (role && canAccessModule(role, module));

  if (!canAccess) {
    // Evita loop: se já está no /admin, não redireciona
    if (location.pathname === '/admin') {
      return <AdminLayout />;
    }
    return <Navigate to="/admin" replace />;
  }

  // Renderiza layout e Outlet de forma compatível
  return (
    <>
      <AdminLayout />
      <Outlet />
    </>
  );
}
