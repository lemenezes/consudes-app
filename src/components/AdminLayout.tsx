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

/* ── Ícones ──────────────────────────────────────────────────────────────── */
const IconDashboard = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);
const IconNews = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
  </svg>
);
const IconCalendar = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);
const IconGallery = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const IconReports = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const IconFederations = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
  </svg>
);
const IconExternalLink = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

/* ── Tipos de item de nav ────────────────────────────────────────────────── */
type NavItem =
  | { kind: 'link'; to: string; end: boolean; label: string; icon: React.ReactNode }
  | { kind: 'soon'; label: string; icon: React.ReactNode };

type NavGroup = { heading: string; items: NavItem[] };

/* ── Componente NavLink ativo ────────────────────────────────────────────── */
function SideNavLink({ item, onClick, comingSoonLabel }: { item: NavItem; onClick?: () => void; comingSoonLabel: string }) {
  const base = 'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150';

  if (item.kind === 'soon') {
    return (
      <div className={`${base} text-white/25 cursor-default select-none`}>
        {item.icon}
        <span>{item.label}</span>
        <span className="ml-auto text-[9px] font-bold tracking-widest uppercase text-white/20 border border-white/15 rounded px-1.5 py-0.5">
          {comingSoonLabel}
        </span>
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} ${
          isActive
            ? 'bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/25'
            : 'text-white/55 hover:text-white hover:bg-white/8 border border-transparent'
        }`
      }
    >
      {item.icon}
      <span>{item.label}</span>
    </NavLink>
  );
}

/* ── Sidebar content (compartilhado desktop/mobile) ─────────────────────── */
function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const NAV_GROUPS: NavGroup[] = [
    {
      heading: '',
      items: [
        { kind: 'link', to: '/admin', end: true, label: t.admin.nav.dashboard, icon: <IconDashboard /> },
      ],
    },
    {
      heading: 'Conteúdo',
      items: [
        { kind: 'link', to: '/admin/noticias',   end: false, label: t.admin.nav.news,     icon: <IconNews /> },
        { kind: 'link', to: '/admin/calendario', end: false, label: t.admin.nav.calendar, icon: <IconCalendar /> },
        { kind: 'soon', label: 'Galeria', icon: <IconGallery /> },
      ],
    },
    {
      heading: 'Institucional',
      items: [
        { kind: 'link', to: '/admin/transparencia', end: false, label: 'Transparência', icon: <IconReports /> },
        { kind: 'link', to: '/admin/federacoes',    end: false, label: 'Federações',    icon: <IconFederations /> },
      ],
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/8">
        <div className="bg-white rounded-xl px-4 py-3 flex justify-center">
          <img
            src="/logo-novo-consudes-removebg-preview-1.webp"
            alt="CONSUDES"
            className="h-14 w-auto"
          />
        </div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-white/30 mt-3 text-center font-medium">
          {t.admin.panelTitle}
        </p>
      </div>

      {/* Link para o site público — acima do menu */}
      <div className="px-3 pt-3 pb-1">
        <a
          href="https://consudes.leandrom.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-white/55 hover:text-white hover:bg-white/8 border border-transparent"
        >
          <IconExternalLink />
          <span>Site público</span>
        </a>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {group.heading && (
              <p className="px-3 mb-1.5 text-[9px] font-bold tracking-[0.18em] uppercase text-white/25">
                {group.heading}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, ii) => (
                <SideNavLink key={ii} item={item} onClick={onNav} comingSoonLabel={t.admin.dashboard.comingSoon} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Rodapé: usuário + lang + logout */}
      <div className="px-3 pb-4 pt-3 border-t border-white/8 space-y-3">
        <div className="px-3">
          <LangSwitcher lang={lang} setLang={setLang} dark />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/8">
          <p className="text-[10px] text-white/35 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/45 hover:text-white hover:bg-white/8 transition-all border border-transparent"
        >
          <IconLogout />
          {t.admin.logout}
        </button>
      </div>
    </div>
  );
}

/* ── Layout principal ────────────────────────────────────────────────────── */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* ── Sidebar desktop (fixed) ── */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-68 bg-[#002D5C] z-30">
        <SidebarContent />
      </aside>

      {/* ── Coluna de conteúdo ── */}
      <div className="lg:pl-68 flex flex-col min-h-screen">

        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-[#002D5C] text-white fixed top-0 inset-x-0 z-30">
          <div className="bg-white rounded-lg px-2 py-1">
            <img
              src="/logo-novo-consudes-removebg-preview-1.webp"
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

        {/* Drawer mobile */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 z-20 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-[#002D5C] z-30 overflow-y-auto">
              <SidebarContent onNav={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 lg:p-8 pt-[calc(1.5rem+3.5rem)] lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

