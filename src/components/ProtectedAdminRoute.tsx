import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import { isAdminEmail } from '../utils/adminAllowlist';

export default function ProtectedAdminRoute() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
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

  return <AdminLayout />;
}
