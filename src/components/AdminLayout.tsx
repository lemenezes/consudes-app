import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/noticias', label: 'Notícias', end: false },
  // { to: '/admin/galeria', label: 'Galeria' },
  // { to: '/admin/relatorios', label: 'Relatórios' },
  // { to: '/admin/federacoes', label: 'Federações' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-[#D9A441] text-[#1F2937]'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex bg-[#F5F7FA]">
      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#003B73] text-white shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex flex-col items-center text-center">
          <div className="bg-white rounded-xl px-4 py-3 inline-block">
            <img
              src="/logo-novo-consudes-removebg-preview-1.png"
              alt="CONSUDES"
              className="h-16 w-auto"
            />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-white/40 mt-3 font-['Inter']">
            Painel Administrativo
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário + logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <p className="text-xs text-white/40 truncate px-1">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* ── Coluna de conteúdo ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#003B73] text-white shrink-0">
          <div className="bg-white rounded-lg px-2 py-1 inline-block">
            <img
              src="/logo-novo-consudes-removebg-preview-1.png"
              alt="CONSUDES"
              className="h-8 w-auto"
            />
          </div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="p-2 text-white/70 hover:text-white"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </header>

        {/* Menu mobile */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#003B73] text-white px-4 pb-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              <p className="text-xs text-white/40 px-1 mb-2">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
