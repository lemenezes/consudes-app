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

type DropdownKey = 'institucional' | 'conteudo' | null;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const close = () => { setIsOpen(false); setOpenDropdown(null); };
  const toggleDropdown = (key: DropdownKey) =>
    setOpenDropdown((prev) => (prev === key ? null : key));

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const groups = [
    {
      key: 'institucional' as DropdownKey,
      label: 'Institucional',
      links: [
        { to: '/sobre', label: t.nav.about },
        { to: '/programas', label: t.nav.programs },
        { to: '/federacoes', label: t.nav.federations },
      ],
    },
    {
      key: 'conteudo' as DropdownKey,
      label: 'Conteúdo',
      links: [
        { to: '/noticias', label: t.nav.news },
        { to: '/campeonatos', label: t.nav.championships },
        { to: '/galeria', label: t.nav.gallery },
      ],
    },
  ];

  const standaloneLinks = [
    { to: '/transparencia', label: t.nav.transparency },
  ];

  const dropdownItemClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
      isActive
        ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
        : 'text-[#003B73] hover:text-[#0057A8] hover:bg-gray-50 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200">

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

            {/* Desktop nav com dropdowns */}
            <nav ref={navRef} className="hidden lg:flex items-center gap-0.5">

              {/* Grupos com dropdown */}
              {groups.map(({ key, label, links }) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => toggleDropdown(key)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded transition-colors ${
                      openDropdown === key
                        ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/15'
                        : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                    }`}
                  >
                    {label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${openDropdown === key ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === key && (
                    <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-white dark:bg-[#0d1624] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-50">
                      {links.map(({ to, label: linkLabel }) => (
                        <NavLink
                          key={to}
                          to={to}
                          onClick={() => setOpenDropdown(null)}
                          className={dropdownItemClass}
                        >
                          {linkLabel}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Links standalone */}
              {standaloneLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-semibold transition-colors rounded ${
                      isActive
                        ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/15'
                        : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
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
        <div className="lg:hidden border-t border-gray-200 bg-white dark:bg-[#0d1624] dark:border-gray-800">
          {groups.map(({ key, label, links }) => (
            <div key={key}>
              <button
                onClick={() => toggleDropdown(key)}
                className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold tracking-widest uppercase text-[#D9A441]"
              >
                {label}
                <ChevronDown
                  size={13}
                  className={`transition-transform ${openDropdown === key ? 'rotate-180' : ''}`}
                />
              </button>
              {openDropdown === key && (
                <div className="pb-2">
                  {links.map(({ to, label: linkLabel }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={close}
                      className={({ isActive }) =>
                        `block px-8 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
                            : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5'
                        }`
                      }
                    >
                      {linkLabel}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-gray-100 dark:border-white/5 px-4 py-3 flex flex-col gap-1">
            {standaloneLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={close}
                className={({ isActive }) =>
                  `px-4 py-3 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
                      : 'text-[#003B73] hover:bg-[#0057A8]/8 hover:text-[#0057A8] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/contato"
              onClick={close}
              className="flex items-center justify-center mt-1 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-4 py-3.5 rounded text-sm transition-colors"
            >
              {t.nav.cta}
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
