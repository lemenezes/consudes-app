import { useState } from 'react';
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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const close = () => { setIsOpen(false); setMoreOpen(false); };

  const primaryLinks = [
    { to: '/sobre', label: t.nav.about },
    { to: '/programas', label: t.nav.programs },
    { to: '/federacoes', label: t.nav.federations },
    { to: '/noticias', label: t.nav.news },
    { to: '/eventos', label: t.nav.events },
  ];

  const moreLinks = [
    { to: '/transparencia', label: t.nav.transparency },
    { to: '/galeria', label: t.nav.gallery },
    { to: '/contato', label: t.nav.contact },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-semibold transition-colors rounded ${
      isActive
        ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/15'
        : 'text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10'
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

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {primaryLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={navLinkClass}>
                  {label}
                </NavLink>
              ))}
              {/* Dropdown "Mais" */}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 rounded transition-colors dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                >
                  ···
                  <ChevronDown size={13} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-[#0d1624] border border-gray-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-50">
                    {moreLinks.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'text-[#0057A8] bg-[#0057A8]/8 dark:text-white dark:bg-white/10'
                              : 'text-[#003B73] hover:text-[#0057A8] hover:bg-gray-50 dark:text-white/80 dark:hover:bg-white/5'
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
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
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-1 dark:bg-[#0d1624] dark:border-gray-800">
          {[...primaryLinks, ...moreLinks].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `px-4 py-3.5 rounded text-sm font-medium transition-colors ${
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
            className="flex items-center justify-center mt-2 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-4 py-3.5 rounded text-sm transition-colors"
          >
            {t.nav.cta}
          </NavLink>
        </div>
      )}
    </header>
  );
}
