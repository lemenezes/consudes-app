import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { X, Sun, Moon, ChevronDown } from 'lucide-react';
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
  | { type: 'dropdown'; key: NonNullable<DropdownKey>; label: string; to?: string; links: DropdownLink[] }
  | { type: 'standalone'; to: string; label: string };

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<NonNullable<DropdownKey>>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { pathname } = useLocation();

  const close = () => {
    const top = document.body.style.top;
    document.body.style.cssText = '';
    if (top) window.scrollTo(0, -parseInt(top));
    setIsOpen(false);
    setOpenDropdowns(new Set());
  };

  const openMenu = () => {
    const y = window.scrollY;
    document.body.style.cssText = `overflow:hidden;position:fixed;top:-${y}px;width:100%`;
    setIsOpen(true);
    setTimeout(() => closeBtnRef.current?.focus(), 80);
  };

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

  // Fecha drawer ao pressionar Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        setTimeout(() => hamburgerRef.current?.focus(), 50);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
      to: '/institucional',
      links: [
        { to: '/historia', label: t.nav.history },
        { to: '/missao', label: t.nav.mission },
        { to: '/valores', label: t.nav.values },
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
      to: '/esportes',
      links: [
                { to: '/calendario',  label: t.nav.calendar },
                { to: '/interclubes', label: t.nav.interclubs },
      ],
    },
    { to: '/galeria', label: t.nav.gallery, type: 'standalone' },
  ];

  return (
    <header ref={navRef} className="sticky top-0 z-50">

      {/* ── Topbar institucional ─────────────────────────────────────────── */}
      <div className="bg-consudes-blue dark:bg-consudes-dark-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
          <p className="text-white/80 text-[10px] font-medium tracking-[0.18em] uppercase hidden sm:block select-none">
            {t.topbar}
          </p>
          <div className="flex items-center">
            <a
              href="https://webmail.hostinger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-consudes-gold text-[10px] font-medium tracking-widest transition-colors duration-150 pr-2.5 border-r border-white/10"
            >
              Webmail
            </a>
            {LANGS.map(({ code, label }, i) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 text-[10px] font-bold tracking-widest transition-colors duration-150 ${
                  lang === code ? 'text-consudes-gold' : 'text-white/80 hover:text-consudes-gold'
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
              className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-consudes-gold transition-colors"
            >
              {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navbar principal ─────────────────────────────────────────────── */}
      <div
        className={`bg-white dark:bg-consudes-dark transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_2px_20px_rgba(0,45,94,0.10)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.40)] border-b border-transparent'
            : 'border-b border-consudes-navy/8 dark:border-white/5'
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
                      const cls = `relative flex items-center gap-1 px-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-150 ${
                        isOpen || hasActiveChild
                          ? 'text-consudes-blue-mid dark:text-white'
                          : 'text-consudes-blue-text hover:text-consudes-blue-mid dark:text-white/70 dark:hover:text-white'
                      }`;
                      const indicator = showIndicator && (
                        <span className="absolute bottom-0 inset-x-3 h-[2px] bg-consudes-gold rounded-t-full" />
                      );
                      const chevron = (
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 opacity-50 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      );
                      return item.to ? (
                        <Link
                          to={item.to}
                          className={cls}
                        >
                          {indicator}
                          {item.label}
                          {chevron}
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleDropdown(item.key)}
                          className={cls}
                        >
                          {indicator}
                          {item.label}
                          {chevron}
                        </button>
                      );
                    })()}
                    {openDropdowns.has(item.key) && (
                      <div className="absolute top-full left-0 mt-0 min-w-[200px] bg-white dark:bg-consudes-dark-body border border-consudes-navy/10 dark:border-white/8 rounded-b-xl rounded-tr-xl shadow-[0_8px_32px_rgba(0,45,94,0.13)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.40)] py-2 z-50">
                        {item.links.map((link) =>
                          link.href ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenDropdowns(new Set())}
                              className="block px-5 py-2.5 text-[13px] font-medium transition-colors whitespace-nowrap text-consudes-blue-text hover:text-consudes-blue-mid hover:bg-consudes-blue-mid/5 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/5"
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
                                    ? 'text-consudes-blue-mid bg-consudes-blue-mid/6 border-l-2 border-consudes-gold dark:text-white dark:bg-white/8'
                                    : 'text-consudes-blue-text hover:text-consudes-blue-mid hover:bg-consudes-blue-mid/5 dark:text-white/65 dark:hover:text-white dark:hover:bg-white/5'
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
                          ? 'text-consudes-blue-mid dark:text-white'
                          : 'text-consudes-blue-text hover:text-consudes-blue-mid dark:text-white/70 dark:hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute bottom-0 inset-x-3 h-[2px] bg-consudes-gold rounded-t-full" />
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
                className="hidden lg:inline-flex items-center bg-consudes-gold hover:bg-consudes-gold-dark text-consudes-blue font-bold px-5 py-2 text-[13px] rounded tracking-wide transition-colors duration-150"
              >
                {t.nav.cta}
              </NavLink>

              <button
                ref={hamburgerRef}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] text-consudes-navy dark:text-white/80 hover:bg-consudes-navy/6 dark:hover:bg-white/8 rounded transition-colors"
                onClick={() => isOpen ? close() : openMenu()}
                aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-drawer"
              >
                <span className={`block h-0.5 w-[18px] bg-current rounded-full transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-0.5 w-[18px] bg-current rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 w-[18px] bg-current rounded-full transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overlay ───────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-[105] bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => { close(); setTimeout(() => hamburgerRef.current?.focus(), 50); }}
      />

      {/* ── Drawer mobile ─────────────────────────────────────────────────── */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`lg:hidden fixed top-0 right-0 z-[110] h-full w-[min(320px,88vw)] bg-consudes-navy flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-[-8px_0_40px_rgba(0,0,0,0.35)]' : 'translate-x-full'
        }`}
      >
        {/* Cabeçalho do drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <Link to="/" onClick={close} aria-label="CONSUDES – Página inicial">
            <div className="bg-white rounded-lg px-3 py-1.5">
              <img
                src="/logo-novo-consudes-removebg-preview-1.webp"
                alt="CONSUDES"
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>
          <button
            ref={closeBtnRef}
            onClick={() => { close(); setTimeout(() => hamburgerRef.current?.focus(), 50); }}
            aria-label="Fechar menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegação */}
        <nav aria-label="Menu principal" className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) =>
            item.type === 'dropdown' ? (
              <div key={item.key} className="border-b border-white/8 last:border-0">
                <div className="flex items-stretch">
                  {item.to ? (
                    <Link
                      to={item.to}
                      onClick={close}
                      className={`flex-1 flex items-center px-5 py-4 text-[15px] font-semibold transition-colors ${
                        item.links.some((l) => l.to && (pathname === l.to || pathname.startsWith(l.to + '/')))
                          ? 'text-consudes-gold'
                          : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="flex-1 flex items-center px-5 py-4 text-[15px] font-semibold text-white/85">
                      {item.label}
                    </span>
                  )}
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    aria-expanded={openDropdowns.has(item.key)}
                    aria-controls={`submenu-${item.key}`}
                    aria-label={`${openDropdowns.has(item.key) ? 'Recolher' : 'Expandir'} submenu ${item.label}`}
                    className="px-4 text-white/50 hover:text-consudes-gold transition-colors"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdowns.has(item.key) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {/* Submenu animado */}
                <div
                  id={`submenu-${item.key}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openDropdowns.has(item.key) ? 'max-h-[400px]' : 'max-h-0'
                  }`}
                >
                  <div className="pb-2 bg-black/20">
                    {item.links.map((link) =>
                      link.href ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className="flex items-center gap-3 pl-8 pr-5 py-3 text-sm text-white/65 hover:text-white transition-colors"
                        >
                          <span className="w-1 h-1 rounded-full bg-consudes-gold/50 flex-shrink-0" />
                          {link.label}
                        </a>
                      ) : (
                        <NavLink
                          key={link.to}
                          to={link.to!}
                          onClick={close}
                          className={({ isActive }) =>
                            `flex items-center gap-3 pl-8 pr-5 py-3 text-sm transition-colors ${
                              isActive
                                ? 'font-semibold text-white bg-white/5 border-l-2 border-l-consudes-gold'
                                : 'text-white/65 hover:text-white'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className={`w-1 h-1 rounded-full flex-shrink-0 ${isActive ? 'bg-consudes-gold' : 'bg-white/30'}`} />
                              {link.label}
                            </>
                          )}
                        </NavLink>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center px-5 py-4 text-[15px] font-semibold border-b border-white/8 last:border-0 transition-colors duration-150 ${
                    isActive ? 'text-white bg-white/5' : 'text-white/85 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 inset-y-0 w-0.5 bg-consudes-gold" aria-hidden="true" />
                    )}
                    {item.label}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* Rodapé do drawer */}
        <div className="flex-shrink-0 border-t border-white/10 px-5 py-4 space-y-3">
          <NavLink
            to="/contato"
            onClick={close}
            className="flex items-center justify-center gap-2 bg-consudes-gold hover:bg-consudes-gold-dark text-consudes-navy font-bold px-4 py-3.5 rounded-lg text-sm tracking-wide transition-colors duration-150"
          >
            {t.nav.cta}
          </NavLink>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center">
              {LANGS.map(({ code, label }, i) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 font-bold tracking-widest transition-colors ${
                    lang === code ? 'text-consudes-gold' : 'text-white/45 hover:text-white'
                  } ${i < LANGS.length - 1 ? 'border-r border-white/15' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://webmail.hostinger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 hover:text-white transition-colors"
              >
                Webmail
              </a>
              <button
                onClick={toggle}
                aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                className="text-white/45 hover:text-consudes-gold transition-colors"
              >
                {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
