import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import type { Lang } from '../i18n/translations';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

function LangSwitcher({ lang, setLang, dark = false }: { lang: Lang; setLang: (l: Lang) => void; dark?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            lang === code
              ? dark
                ? 'bg-[#D9A441] text-[#1F2937]'
                : 'bg-[#003B73] text-white'
              : dark
              ? 'text-white/50 hover:text-white hover:bg-white/10'
              : 'text-gray-400 hover:text-[#1F2937] hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { to: '/admin', label: t.admin.nav.dashboard, end: true },
    { to: '/admin/noticias', label: t.admin.nav.news, end: false },
  ];

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
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* ── Sidebar desktop (fixed) ── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#003B73] text-white z-30">
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
            {t.admin.panelTitle}
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {t.admin.logout}
          </button>
        </div>
      </aside>

      {/* ── Coluna de conteúdo ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar desktop (fixed) */}
        <header className="hidden lg:flex items-center justify-end gap-3 px-8 h-12 bg-[#003B73] fixed top-0 left-64 right-0 z-20 shrink-0">
          <LangSwitcher lang={lang} setLang={setLang} dark />
        </header>

        {/* Top bar mobile (fixed) */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#003B73] text-white fixed top-0 inset-x-0 z-30 shrink-0">
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

        {/* Menu mobile (fixed abaixo do topbar) */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#003B73] text-white px-4 pb-4 space-y-1 fixed top-14 inset-x-0 z-20">
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
              <div className="px-1 mb-3">
                <LangSwitcher lang={lang} setLang={setLang} dark />
              </div>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                {t.admin.logout}
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo principal — compensar altura do header fixo */}
        <main className="flex-1 p-6 lg:p-8 pt-[calc(1.5rem+3rem)] lg:pt-[calc(2rem+3rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
