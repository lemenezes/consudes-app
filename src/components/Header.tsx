import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import type { Lang } from '../i18n/translations';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

type DropdownKey = 'institucional' | 'transparencia' | 'deportes' | null;

type DropdownLink =
  | { to: string; href?: never; label: string }
  | { href: string; to?: never; label: string };

type NavItem =
  | { type: 'dropdown'; key: NonNullable<DropdownKey>; label: string; links: DropdownLink[] }
  | { type: 'standalone'; to: string; label: string };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<NonNullable<DropdownKey>>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();

  const close = () => { setIsOpen(false); setOpenDropdowns(new Set()); };
  const toggleDropdown = (key: NonNullable<DropdownKey>) =>
    setOpenDropdowns((prev) => {
      if (prev.has(key)) return new Set();
      return new Set([key]);
    });

  // Fecha dropdowns ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdowns(new Set());
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Shadow dinâmico no scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu mobile ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) close(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Abre automaticamente o dropdown que contém a página ativa ao abrir o menu mobile
  useEffect(() => {
    if (!isOpen) return;
    const activeKey = navItems
      .filter((i): i is Extract<NavItem, { type: 'dropdown' }> => i.type === 'dropdown')
      .find((i) => i.links.some((l) => l.to && (pathname === l.to || pathname.startsWith(l.to + '/'))));
    if (activeKey) setOpenDropdowns(new Set([activeKey.key]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const navItems: NavItem[] = [
    {
      type: 'dropdown',
      key: 'institucional',
      label: t.nav.institutional,
      links: [
        { to: '/historia', label: t.nav.history },
        { to: '/missao', label: t.nav.mission },
        { to: '/valores', label: t.nav.values },
        { to: '/sede', label: t.nav.headquarters },
        { to: '/equipe', label: t.nav.team },
        { to: '/ex-presidentes', label: t.nav.formerPresidents },
      ],
    },
    { type: 'standalone', to: '/federacoes', label: t.nav.federations },
    { type: 'standalone', to: '/transparencia', label: t.nav.transparency },
    { type: 'standalone', to: '/noticias', label: t.nav.news },
    {
      type: 'dropdown',
      key: 'deportes',
      label: t.nav.sports,
      links: [
        { to: '/calendario', label: t.nav.calendar },
        { to: '/interclubes', label: t.nav.interclubs },
      ],
    },
    { to: '/galeria', label: t.nav.gallery, type: 'standalone' },
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-50">

      {/* ── Topbar institucional ─────────────────────────────────────────── */}
      <div className="bg-[#002D5E] dark:bg-[#001630]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
          <p className="text-white/80 text-[10px] font-medium tracking-[0.18em] uppercase hidden sm:block select-none">
            {t.topbar}
          </p>
          <div className="flex items-center">
            <a
              href="https://webmail.hostinger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#D9A441] text-[10px] font-medium tracking-widest transition-colors duration-150 pr-2.5 border-r border-white/10"
            >
              Webmail
            </a>
            {LANGS.map(({ code, label }, i) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 text-[10px] font-bold tracking-widest transition-colors duration-150 ${
                  lang === code ? 'text-[#D9A441]' : 'text-white/80 hover:text-[#D9A441]'
                } ${i < LANGS.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                {label}
              </button>
            ))}
            <div className="w-px h-3.5 bg-white/15 mx-2" />
            <button
              data-testid="theme-toggle"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-[#D9A441] transition-colors"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navbar principal ─────────────────────────────────────────────── */}
      <div
        className={`bg-white dark:bg-[#0a1220] transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_2px_20px_rgba(0,45,94,0.10)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.40)] border-b border-transparent'
            : 'border-b border-[#003B73]/8 dark:border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* Logo */}
            <Link to="/" onClick={close} className="flex-shrink-0 group" aria-label="CONSUDES – Página inicial">
              <img
                src="/logo-novo-consudes-removebg-preview-1.webp"
                alt=""
                width={546}
                height={457}
                className="h-12 sm:h-[56px] w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-stretch h-full">
              {navItems.map((item) =>
                item.type === 'dropdown' ? (
                  <div
                    key={item.key}
                    className="relative flex items-stretch"
                    onMouseEnter={() => setOpenDropdowns(new Set([item.key]))}
                    onMouseLeave={() => setOpenDropdowns(new Set())}
                  >
                    {(() => {
                      const hasActiveChild = item.links.some(
                        (l) => l.to && (pathname === l.to || pathname.startsWith(l.to + '/')),
                      );
                      const isOpen = openDropdowns.has(item.key);
                      const showIndicator = isOpen || hasActiveChild;
                      return (
                        <button
                          onClick={() => toggleDropdown(item.key)}
                          className={`relative flex items-center gap-1 px-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-150 ${
                            isOpen || hasActiveChild
                              ? 'text-[#0057A8] dark:text-white'
                              : 'text-[#1a3a5c] hover:text-[#0057A8] dark:text-white/70 dark:hover:text-white'
                          }`}
                        >
                          {showIndicator && (
                            <span className="absolute bottom-0 inset-x-3 h-[2px] bg-[#D9A441] rounded-t-full" />
                          )}
                          {item.label}
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      );
                    })()}
                    {openDropdowns.has(item.key) && (
                      <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white dark:bg-[#0d1624] border border-[#003B73]/10 dark:border-white/8 rounded-b-xl rounded-tr-xl shadow-[0_8px_32px_rgba(0,45,94,0.13)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.40)] py-2 z-50">
                        {item.links.map((link) =>
                          link.href ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenDropdowns(new Set())}
                              className="block px-5 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap text-[#1a3a5c] hover:text-[#0057A8] hover:bg-[#0057A8]/5 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/5"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <NavLink
                              key={link.to}
                              to={link.to!}
                              onClick={() => setOpenDropdowns(new Set())}
                              className={({ isActive }) =>
                                `block px-5 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                                  isActive
                                    ? 'text-[#0057A8] bg-[#0057A8]/6 border-l-2 border-[#D9A441] dark:text-white dark:bg-white/8'
                                    : 'text-[#1a3a5c] hover:text-[#0057A8] hover:bg-[#0057A8]/5 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/5'
                                }`
                              }
                            >
                              {link.label}
                            </NavLink>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    aria-label={item.to === '/' ? 'Navegar para a página inicial' : undefined}
                    className={({ isActive }) =>
                      `relative flex items-center px-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-150 ${
                        isActive
                          ? 'text-[#0057A8] dark:text-white'
                          : 'text-[#1a3a5c] hover:text-[#0057A8] dark:text-white/70 dark:hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute bottom-0 inset-x-3 h-[2px] bg-[#D9A441] rounded-t-full" />
                        )}
                        {item.label}
                      </>
                    )}
                  </NavLink>
                )
              )}
            </nav>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <NavLink
                to="/contato"
                className="hidden lg:inline-flex items-center bg-[#D9A441] hover:bg-[#c99030] text-[#002D5E] font-bold px-5 py-2 text-[13px] rounded-sm tracking-wide transition-colors duration-150"
              >
                {t.nav.cta}
              </NavLink>

              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center text-[#003B73] hover:bg-[#003B73]/6 rounded transition-colors dark:text-white/80 dark:hover:bg-white/8"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={1.75} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0a1220] border-t border-[#003B73]/8 dark:border-white/5 overflow-y-auto max-h-[calc(100svh-104px)] shadow-[0_8px_32px_rgba(0,45,94,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          <div className="py-1">
            {navItems.map((item) =>
              item.type === 'dropdown' ? (
                <div key={item.key} className="border-b border-[#003B73]/5 dark:border-white/5 last:border-0">
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-150 ${
                      openDropdowns.has(item.key) ||
                      item.links.some((l) => l.to && (pathname === l.to || pathname.startsWith(l.to + '/')))
                        ? 'text-[#D9A441]'
                        : 'text-[#003B73]/75 dark:text-white/40 hover:text-[#D9A441] dark:hover:text-[#D9A441]'
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${openDropdowns.has(item.key) ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdowns.has(item.key) && (
                    <div className="bg-[#003B73]/3 dark:bg-white/3 pb-2">
                      {item.links.map((link) =>
                        link.href ? (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={close}
                            className="flex items-center gap-2.5 pl-8 pr-5 py-3 text-[13px] font-medium text-[#1a3a5c] hover:text-[#0057A8] dark:text-white/60 dark:hover:text-white transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-[#D9A441]/50 flex-shrink-0" />
                            {link.label}
                          </a>
                        ) : (
                          <NavLink
                            key={link.to}
                            to={link.to!}
                            onClick={close}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 pl-8 pr-5 py-3 text-[13px] transition-colors ${
                                isActive
                                  ? 'font-semibold text-[#003B73] bg-[#003B73]/10 border-l-2 border-l-[#D9A441] dark:text-white dark:bg-white/8'
                                  : 'font-medium text-[#1a3a5c] hover:text-[#0057A8] dark:text-white/60 dark:hover:text-white'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive ? 'bg-[#D9A441]' : 'bg-[#D9A441]/40'}`} />
                                {link.label}
                              </>
                            )}
                          </NavLink>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  end={item.to === '/'}
                  aria-label={item.to === '/' ? 'Navegar para a página inicial' : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3.5 text-[13px] border-b border-[#003B73]/5 dark:border-white/5 last:border-0 transition-colors duration-150 ${
                      isActive
                        ? 'font-bold text-[#003B73] bg-[#003B73]/10 border-l-2 border-l-[#D9A441] dark:text-white dark:bg-white/8'
                        : 'font-semibold text-[#1a3a5c] hover:text-[#0057A8] dark:text-white/65 dark:hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>
          <div className="px-5 py-4 border-t border-[#003B73]/8 dark:border-white/5">
            <NavLink
              to="/contato"
              onClick={close}
              className="flex items-center justify-center bg-[#D9A441] hover:bg-[#c99030] text-[#002D5E] font-bold px-4 py-3.5 rounded-sm text-[13px] tracking-wide transition-colors duration-150"
            >
              {t.nav.cta}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
