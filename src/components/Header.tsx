import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
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
  const { theme, toggle } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const close = () => setIsOpen(false);

  const navLinks = [
    { href: '#sobre', label: t.nav.about },
    { href: '#programas', label: t.nav.programs },
    { href: '#noticias', label: t.nav.news },
    { href: '#contato', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 transition-colors duration-200">

      {/* ── Topbar institucional ─────────────────────────────────────────── */}
      <div className="bg-[#003B73] dark:bg-[#001f42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <p className="text-white/70 text-[11px] font-medium tracking-widest uppercase hidden sm:block">
            {t.topbar}
          </p>
          {/* Idioma + toggle dark/light */}
          <div className="flex items-center gap-px">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-2.5 py-1 text-[11px] font-bold tracking-wider transition-colors ${
                  lang === code
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
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
                className="h-16 sm:h-25 w-auto object-contain block"
              />
            </Link>

            {/* Desktop nav — centro */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-2 text-sm font-semibold transition-colors text-[#003B73] hover:text-[#0057A8] hover:bg-[#0057A8]/8 rounded dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Ações direita */}
            <div className="flex items-center gap-2">
              <a
                href="#contato"
                className="hidden md:flex items-center gap-2 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-5 py-2 rounded text-sm transition-colors"
              >
                {t.nav.cta}
              </a>

              <button
                className="md:hidden w-10 h-10 flex items-center justify-center rounded text-[#003B73] hover:bg-[#003B73]/8 transition-colors dark:text-white dark:hover:bg-white/10"
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
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-1 animate-fade-in dark:bg-[#0d1624] dark:border-gray-800">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={close}
              className="px-4 py-3.5 rounded text-sm font-medium transition-colors text-[#003B73] hover:bg-[#0057A8]/8 hover:text-[#0057A8] dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={close}
            className="flex items-center justify-center mt-2 bg-[#D9A441] hover:bg-[#c49038] text-[#003B73] font-bold px-4 py-3.5 rounded text-sm transition-colors"
          >
            {t.nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}
