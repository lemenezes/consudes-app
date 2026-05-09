import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const close = () => { setIsOpen(false); setOpenDropdowns(new Set()); };
  const toggleDropdown = (key: NonNullable<DropdownKey>) =>
    setOpenDropdowns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
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

  const navItems: NavItem[] = [
    { type: 'standalone', to: '/', label: 'Home' },
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
    {
      type: 'dropdown',
      key: 'transparencia',
      label: t.nav.transparency,
      links: [
        { to: '/relatorios', label: t.nav.reports },
        { href: 'https://webmail.hostinger.com', label: 'Webmail' },
      ],
    },
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

  const dropdownItemClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
      isActive
        ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
        : 'text-[#003B73] hover:text-[#0057A8] hover:bg-gray-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
    }`;

  return (
    <header ref={navRef} className="sticky top-0 z-50 transition-colors duration-200">

      {/* ── Topbar institucional ─────────────────────────────────────────── */}
      <div className="bg-[#003B73] dark:bg-[#001f42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <p className="text-white/70 text-[11px] font-medium tracking-widest uppercase hidden sm:block">
            {t.topbar}
          </p>
          <div className="flex items-center gap-px">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors ${
                  lang === code ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
            <span className="w-px h-3.5 bg-white/20 mx-1.5" />
            <button
              data-testid="theme-toggle"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="w-7 h-7 flex items-center justify-center rounded text-white/40 hover:text-white/80 transition-colors"
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navbar principal ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm dark:bg-[#0d1624] dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[80px]">

            {/* Logo */}
            <Link to="/" onClick={close} className="flex-shrink-0">
              <img
                src="/logo-novo-consudes-removebg-preview-1.png"
                alt="CONSUDES"
                className="h-16 sm:h-20 w-auto object-contain block"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) =>
                item.type === 'dropdown' ? (
                  <div key={item.key} className="relative">
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded transition-colors ${
                        openDropdowns.has(item.key)
                          ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/15'
                          : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${openDropdowns.has(item.key) ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdowns.has(item.key) && (
                      <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white dark:bg-[#0d1624] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-50">
                        {item.links.map((link) =>
                          link.href ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setOpenDropdowns(new Set())}
                              className="block px-4 py-2.5 text-sm transition-colors whitespace-nowrap text-[#003B73] hover:text-[#0057A8] hover:bg-gray-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <NavLink
                              key={link.to}
                              to={link.to!}
                              onClick={() => setOpenDropdowns(new Set())}
                              className={dropdownItemClass}
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
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-semibold transition-colors rounded ${
                        isActive
                          ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/15'
                          : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            {/* Ações direita */}
            <div className="flex items-center gap-2">
              <NavLink
                to="/contato"
                className="hidden lg:flex items-center gap-2 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-5 py-2 rounded text-sm transition-colors"
              >
                {t.nav.cta}
              </NavLink>

              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded text-[#003B73] hover:bg-[#003B73]/8 transition-colors dark:text-white dark:hover:bg-white/10"
                onClick={() => setIsOpen((v) => !v)}
                aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white dark:bg-[#0d1624] dark:border-gray-800 overflow-y-auto max-h-[calc(100svh-116px)]">
          {navItems.map((item) =>
            item.type === 'dropdown' ? (
              <div key={item.key}>
                <button
                  onClick={() => toggleDropdown(item.key)}
                  className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold tracking-widest uppercase text-[#D9A441]"
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${openDropdowns.has(item.key) ? 'rotate-180' : ''}`}
                  />
                </button>
                {openDropdowns.has(item.key) && (
                  <div className="pb-2">
                    {item.links.map((link) =>
                      link.href ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className="block px-8 py-3 text-sm font-medium transition-colors text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <NavLink
                          key={link.to}
                          to={link.to!}
                          onClick={close}
                          className={({ isActive }) =>
                            `block px-8 py-3 text-sm font-medium transition-colors ${
                              isActive
                                ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
                                : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
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
                onClick={close}
                className={({ isActive }) =>
                  `block px-5 py-3 text-sm font-medium border-b border-gray-50 dark:border-white/5 transition-colors ${
                    isActive
                      ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
                      : 'text-[#003B73] hover:bg-[#0057A8]/8 hover:text-[#0057A8] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
          <div className="border-t border-gray-100 dark:border-white/5 px-4 py-3">
            <NavLink
              to="/contato"
              onClick={close}
              className="flex items-center justify-center bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-4 py-3.5 rounded text-sm transition-colors"
            >
              {t.nav.cta}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
