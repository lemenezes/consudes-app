import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { canAccessModule } from "../utils/rbac";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import type { Lang } from "../i18n/translations";
import { ChevronLeft, ChevronRight, Moon, Sun, Wallet } from "lucide-react";

const LANGS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" }
];

const SIDEBAR_STORAGE_KEY = "consudes-admin-sidebar-collapsed";

function LangSwitcher({
  lang,
  setLang,
  dark = false,
  compact = false
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center ${compact ? "flex-col gap-0.5" : "gap-1"}`}>
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`${compact ? "px-1.5 py-0.5 text-[10px] leading-4" : "px-2.5 py-1 text-xs"} rounded-md font-semibold transition-colors ${
            lang === code
              ? dark
                ? "bg-[#D9A441] text-[#1F2937]"
                : "bg-[#003B73] text-white"
              : dark
                ? "text-white/50 hover:text-white hover:bg-white/10"
                : "text-gray-400 hover:text-[#1F2937] hover:bg-gray-100"
          }`}>
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Ícones ──────────────────────────────────────────────────────────────── */
const IconDashboard = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  </svg>
);
const IconNews = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
    />
  </svg>
);
const IconCalendar = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);
const IconGallery = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);
const IconReports = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);
const IconFederations = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);
const IconLogout = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);
const IconExternalLink = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);
const IconGlobe = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m-8.5 9h17"
    />
  </svg>
);

const IconHelp = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 9a3.375 3.375 0 116.75 0c0 2.25-3.375 2.25-3.375 4.5M12 17.25h.008v.008H12v-.008z"
    />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const IconOfficialDocuments = () => (
  <svg
    className="w-4 h-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9h3.75m-3.75 3h3.75M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

/* ── Tipos de item de nav ────────────────────────────────────────────────── */

type NavItem =
  | {
      kind: "link";
      to: string;
      end: boolean;
      label: string;
      icon: React.ReactNode;
      module?: string;
    }
  | { kind: "soon"; label: string; icon: React.ReactNode };

type NavGroup = { heading: string; items: NavItem[] };

/* ── Componente NavLink ativo ────────────────────────────────────────────── */
function SideNavLink({
  item,
  onClick,
  comingSoonLabel,
  collapsed = false,
  showTooltip,
  hideTooltip
}: {
  item: NavItem;
  onClick?: () => void;
  comingSoonLabel: string;
  collapsed?: boolean;
  showTooltip?: (label: string, element: HTMLElement) => void;
  hideTooltip?: () => void;
}) {
  const base =
    "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200";

  if (item.kind === "soon") {
    return (
      <div
        onMouseEnter={event =>
          collapsed && showTooltip?.(item.label, event.currentTarget)
        }
        onMouseLeave={hideTooltip}
        className={`${base} ${collapsed ? "justify-center px-0 py-3" : "px-3.5 py-3"} text-white/25 cursor-default select-none border border-white/5 bg-white/[0.02]`}>
        {item.icon}
        {!collapsed && <span>{item.label}</span>}
        {!collapsed && (
          <span className="ml-auto text-[9px] font-bold tracking-widest uppercase text-white/20 border border-white/15 rounded px-1.5 py-0.5">
            {comingSoonLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      aria-label={collapsed ? item.label : undefined}
      onMouseEnter={event =>
        collapsed && showTooltip?.(item.label, event.currentTarget)
      }
      onMouseLeave={hideTooltip}
      onFocus={event =>
        collapsed && showTooltip?.(item.label, event.currentTarget)
      }
      onBlur={hideTooltip}
      onClick={() => {
        hideTooltip?.();
        onClick?.();
      }}>
      {({ isActive }) => (
        <div
          className={`${base} ${collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5 lg:px-3.5 lg:py-3"} border overflow-hidden ${
            isActive
              ? "bg-white/10 lg:bg-[linear-gradient(135deg,rgba(217,164,65,0.22),rgba(217,164,65,0.08)_35%,rgba(255,255,255,0.06))] text-white border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.18)]"
              : "text-white/62 border-transparent hover:text-white hover:bg-white/7 hover:border-white/8"
          }`}>
          {isActive && (
            <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#D9A441]" />
          )}
          <span
            className={`relative z-10 ${
              isActive ? "text-white lg:text-[#D9A441]" : "text-current"
            }`}>
            {item.icon}
          </span>
          {!collapsed && <span className="relative z-10">{item.label}</span>}
        </div>
      )}
    </NavLink>
  );
}

/* ── Sidebar content (compartilhado desktop/mobile) ─────────────────────── */
function SidebarContent({
  onNav,
  collapsed = false
}: {
  onNav?: () => void;
  collapsed?: boolean;
}) {
  const { profile, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{
    label: string;
    top: number;
    left: number;
    themeAction?: boolean;
  } | null>(null);
  const showTooltip = (
    label: string,
    element: HTMLElement,
    themeAction = false
  ) => {
    const bounds = element.getBoundingClientRect();
    setTooltip({
      label,
      top: bounds.top + bounds.height / 2,
      left: bounds.right + 10,
      themeAction
    });
  };
  const hideTooltip = () => setTooltip(null);
  const themeLabel = theme === "dark" ? t.admin.lightMode : t.admin.darkMode;
  const helpLabel =
    lang === "pt"
      ? "Ajuda e Manual"
      : lang === "es"
        ? "Ayuda y Manual"
        : "Help and Manual";

  // Mapeamento de módulos para cada item do menu
  const NAV_GROUPS: NavGroup[] = [
    {
      heading: "",
      items: [
        {
          kind: "link",
          to: "/admin",
          end: true,
          label: t.admin.nav.dashboard,
          icon: <IconDashboard />,
          module: "dashboard"
        }
      ]
    },
    {
      heading: t.admin.groups.content,
      items: [
        {
          kind: "link",
          to: "/admin/noticias",
          end: false,
          label: t.admin.nav.news,
          icon: <IconNews />,
          module: "noticias"
        },
        {
          kind: "link",
          to: "/admin/calendario",
          end: false,
          label: t.admin.nav.calendar,
          icon: <IconCalendar />,
          module: "calendario"
        },
        {
          kind: "link",
          to: "/admin/galeria",
          end: false,
          label: t.admin.nav.gallery,
          icon: <IconGallery />,
          module: "galeria"
        }
      ]
    },
    {
      heading: t.admin.groups.institutional,
      items: [
        {
          kind: "link",
          to: "/admin/transparencia",
          end: false,
          label: t.admin.nav.transparency,
          icon: <IconReports />,
          module: "transparencia"
        },
        {
          kind: "link",
          to: "/admin/oficios",
          end: false,
          label:
            lang === "pt"
              ? "Ofícios"
              : lang === "es"
                ? "Oficios"
                : "Official documents",
          icon: <IconOfficialDocuments />,
          module: "documentos"
        },
        {
          kind: "link",
          to: "/admin/federacoes",
          end: false,
          label: t.admin.nav.federations,
          icon: <IconFederations />,
          module: "federacoes"
        }
      ]
    },
    {
      heading: t.admin.groups.finance,
      items: [
        {
          kind: "link",
          to: "/admin/financeiro",
          end: true,
          label: t.admin.nav.finance,
          icon: <Wallet className="w-4 h-4 shrink-0" />,
          module: "financeiro"
        }
      ]
    }
  ];

  // Filtra menus conforme permissão do perfil
  const filteredGroups = !profile?.role
    ? NAV_GROUPS
    : NAV_GROUPS.map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (item.kind === "soon") return true;
          // Se não houver módulo mapeado, mostra apenas para super_admin
          if (!("module" in item)) return profile.role === "super_admin";
          return canAccessModule(profile.role, item.module!);
        })
      })).filter(group => group.items.length > 0);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#002D5C_0%,#01264B_100%)] text-white">
      {/* Logo */}
      <div
        className={`border-b border-white/8 ${collapsed ? "px-2 pt-4 pb-10" : "px-4 pt-4 pb-3 lg:px-5 lg:pt-6 lg:pb-4"}`}>
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3 lg:gap-4"}`}>
          <div
            className={`flex shrink-0 items-center justify-center bg-white shadow-[0_8px_24px_rgba(0,0,0,0.14)] ${collapsed ? "h-12 w-12 rounded-xl p-1.5" : "h-14 w-16 lg:h-16 lg:w-20 rounded-xl lg:rounded-2xl px-2.5 lg:px-3"}`}>
            <img
              src="/logo-novo-consudes-removebg-preview-1.webp"
              alt="CONSUDES"
              className={
                collapsed
                  ? "max-h-full max-w-full object-contain"
                  : "h-8 lg:h-9 w-auto"
              }
            />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3 lg:gap-4">
              <div className="h-10 lg:h-12 w-px bg-gradient-to-b from-transparent via-[#D9A441]/70 to-transparent" />
              <div className="min-w-0">
                <p className="text-sm font-medium tracking-[0.08em] text-white/80 whitespace-nowrap">
                  ADMIN
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <nav
        className={`min-h-0 flex-1 overflow-y-auto py-2 lg:py-4 ${collapsed ? "px-2" : "px-4"}`}>
        {filteredGroups.map((group, gi) => (
          <div
            key={gi}
            className={gi === 0 ? "" : collapsed ? "mt-3" : "mt-4 lg:mt-6"}>
            {group.heading && !collapsed && (
              <div className="mb-2 lg:mb-3 flex flex-col px-1">
                <div className="mb-2 h-0.5 w-8 lg:w-10 rounded-full bg-[#D9A441]" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/56">
                  {group.heading}
                </p>
              </div>
            )}
            <div className="space-y-1 lg:space-y-1.5">
              {group.items.map((item, ii) => (
                <SideNavLink
                  key={ii}
                  item={item}
                  onClick={onNav}
                  comingSoonLabel={t.admin.dashboard.comingSoon}
                  collapsed={collapsed}
                  showTooltip={showTooltip}
                  hideTooltip={hideTooltip}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
      {/* Rodapé: ações finais */}
      <div
        className={`border-t border-white/8 pb-2.5 lg:pb-3 pt-2 ${collapsed ? "px-2" : "px-4"}`}>
        <div
          className={`rounded-[16px] border border-white/8 bg-white/[0.03] py-1.5 lg:py-2 ${collapsed ? "px-1" : "px-2.5 lg:px-3"}`}>
          <div className="space-y-0.5 lg:space-y-1">
            {/* Idioma */}
            <div
              className={`flex items-center gap-2 rounded-xl py-1 text-white/60 ${collapsed ? "flex-col px-1" : "px-2.5 lg:px-3"}`}>
              <IconGlobe />
              <LangSwitcher
                lang={lang}
                setLang={setLang}
                dark
                compact={collapsed}
              />
            </div>

            <button
              type="button"
              onClick={toggle}
              aria-label={themeLabel}
              title={collapsed ? undefined : themeLabel}
              onMouseEnter={event =>
                collapsed && showTooltip(themeLabel, event.currentTarget, true)
              }
              onMouseLeave={hideTooltip}
              onFocus={event =>
                collapsed && showTooltip(themeLabel, event.currentTarget, true)
              }
              onBlur={hideTooltip}
              className={`flex w-full items-center gap-2 rounded-xl text-sm font-medium text-white/80 transition-all duration-150 hover:bg-white/8 hover:text-[#D9A441] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9A441] ${collapsed ? "justify-center px-0 py-2" : "px-2.5 lg:px-3 py-1.5 lg:py-2"}`}>
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              {!collapsed && <span>{themeLabel}</span>}
            </button>

            {/* Ajuda */}
            <NavLink
              to="/admin/ajuda"
              onClick={onNav}
              aria-label={collapsed ? helpLabel : undefined}
              onMouseEnter={event =>
                collapsed && showTooltip(helpLabel, event.currentTarget)
              }
              onMouseLeave={hideTooltip}
              onFocus={event =>
                collapsed && showTooltip(helpLabel, event.currentTarget)
              }
              onBlur={hideTooltip}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl ${collapsed ? "justify-center px-0 py-2" : "px-2.5 lg:px-3 py-1.5 lg:py-2"} text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/8 hover:text-white"
                }`
              }>
              <IconHelp />
              {!collapsed && <span>{helpLabel}</span>}
            </NavLink>

            {/* Site público */}
            <a
              href="https://www.consudes.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={collapsed ? t.admin.publicSite : undefined}
              onMouseEnter={event =>
                collapsed &&
                showTooltip(t.admin.publicSite, event.currentTarget)
              }
              onMouseLeave={hideTooltip}
              onFocus={event =>
                collapsed &&
                showTooltip(t.admin.publicSite, event.currentTarget)
              }
              onBlur={hideTooltip}
              className={`flex items-center gap-2 rounded-xl ${collapsed ? "justify-center px-0 py-2" : "px-2.5 lg:px-3 py-1.5 lg:py-2"} text-sm font-medium text-white/60 transition-all duration-150 hover:bg-white/8 hover:text-white`}>
              <IconExternalLink />
              {!collapsed && <span>{t.admin.publicSite}</span>}
            </a>

            {/* Sair */}
            <button
              onClick={handleSignOut}
              aria-label={collapsed ? t.admin.logout : undefined}
              onMouseEnter={event =>
                collapsed && showTooltip(t.admin.logout, event.currentTarget)
              }
              onMouseLeave={hideTooltip}
              onFocus={event =>
                collapsed && showTooltip(t.admin.logout, event.currentTarget)
              }
              onBlur={hideTooltip}
              className={`flex w-full items-center gap-2 rounded-xl ${collapsed ? "justify-center px-0 py-2" : "px-2.5 lg:px-3 py-1.5 lg:py-2"} text-sm font-medium text-white/60 transition-all duration-150 hover:bg-white/8 hover:text-white`}>
              <IconLogout />
              {!collapsed && <span>{t.admin.logout}</span>}
            </button>
          </div>
        </div>
      </div>
      {collapsed &&
        tooltip &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-[#172033] px-3 py-1.5 text-xs font-medium text-white shadow-lg"
            style={{ top: tooltip.top, left: tooltip.left }}>
            {tooltip.themeAction ? themeLabel : tooltip.label}
          </div>,
          document.body
        )}
    </div>
  );
}

/* ── Layout principal ────────────────────────────────────────────────────── */
export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return (
        typeof window !== "undefined" &&
        window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
      );
    } catch {
      return false;
    }
  });
  const { t } = useLanguage();

  useEffect(() => {
    try {
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(sidebarCollapsed)
      );
    } catch {
      return;
    }
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-consudes-dark-body">
      <style>{`
        .dark .admin-main [class~="text-[#172033]"],
        .dark .admin-main [class~="text-[#1F2937]"] {
          color: #f1f5f9;
        }
        .dark .admin-main :is(.border-gray-100, .border-gray-200, .border-gray-300, .border-slate-100, .border-slate-200, .border-slate-300) {
          border-color: rgb(148 163 184 / 0.12);
        }
        .dark .admin-main :is(.ring-gray-100, .ring-slate-100) {
          --tw-ring-color: rgb(148 163 184 / 0.08);
        }
        .dark .admin-main thead {
          background-color: #1c293a;
          border-color: rgb(148 163 184 / 0.12);
        }
        .dark .admin-main thead th {
          color: #a8b6c8;
        }
        .dark .admin-main :is(.divide-y, .divide-y-reverse) > :not(:last-child) {
          border-color: rgb(148 163 184 / 0.1);
        }
        .dark .admin-main tbody tr:hover {
          background-color: rgb(255 255 255 / 0.035);
        }
        .dark .admin-main :is(.text-gray-400, .text-gray-500, .text-slate-400, .text-slate-500) {
          color: #9aa9bb;
        }
      `}</style>
      {/* ── Sidebar desktop (fixed) ── */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 ${sidebarCollapsed ? "w-20" : "w-60"} bg-[#002D5C] shadow-[18px_0_48px_rgba(0,27,54,0.16)] z-30 transition-[width] duration-300`}>
        <SidebarContent collapsed={sidebarCollapsed} />
        <button
          type="button"
          onClick={() => setSidebarCollapsed(previous => !previous)}
          aria-label={
            sidebarCollapsed ? t.admin.expandMenu : t.admin.collapseMenu
          }
          title={sidebarCollapsed ? t.admin.expandMenu : t.admin.collapseMenu}
          className={`absolute z-10 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A441] ${sidebarCollapsed ? "top-[76px] left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center text-white/45 hover:bg-white/5 hover:text-white/85" : "right-2 top-4 p-2 text-white/60 hover:bg-white/10 hover:text-white"}`}>
          {sidebarCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </aside>

      {/* ── Coluna de conteúdo ── */}
      <div
        className={`${sidebarCollapsed ? "lg:pl-20" : "lg:pl-60"} flex flex-col min-h-screen transition-[padding] duration-300`}>
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-end px-3 h-14 bg-[#002D5C] text-white fixed top-0 inset-x-0 z-30">
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label={t.admin.menuLabel}
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 focus:outline-none">
            {mobileOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
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
            <div className="lg:hidden fixed top-14 left-0 bottom-0 w-[85vw] max-w-[320px] bg-[#002D5C] z-30 overflow-y-auto">
              <SidebarContent onNav={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        {/* Conteúdo principal */}
        <main className="admin-main flex-1 p-6 lg:p-8 pt-[calc(1.5rem+3.5rem)] lg:pt-8 dark:text-slate-200 dark:[&_.bg-white]:bg-[#172333] dark:[&_.bg-gray-50]:bg-[#1c2c40] dark:[&_.bg-slate-50]:bg-[#1c2c40] dark:[&_.bg-gray-100]:bg-[#243449] dark:[&_.bg-slate-100]:bg-[#243449] dark:[&_.text-gray-500]:text-slate-400 dark:[&_.text-gray-600]:text-slate-300 dark:[&_.text-slate-500]:text-slate-400 dark:[&_.text-slate-600]:text-slate-300 dark:[&_.text-slate-700]:text-slate-200 dark:[&_.text-slate-800]:text-slate-100 dark:[&_h1]:text-slate-100 dark:[&_h2]:text-slate-100 dark:[&_h3]:text-slate-100 dark:[&_input]:text-slate-100 dark:[&_select]:text-slate-100 dark:[&_.border-gray-200]:border-white/10 dark:[&_.border-slate-200]:border-white/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
