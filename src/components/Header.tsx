import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const close = () => setIsOpen(false);

  const navLinks = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#programas', label: 'Programas' },
    { href: '#noticias', label: 'Notícias' },
    { href: '#contato', label: 'Contato' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFCFB]/92 dark:bg-[#0a1f2e]/90 backdrop-blur-xl border-b border-[#EEF2F7] dark:border-white/5 shadow-[0_1px_12px_rgba(12,90,134,0.04)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" onClick={close} className="flex items-center gap-3 min-w-0">
            <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 flex-shrink-0" aria-hidden="true">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0C5A86"/>
                  <stop offset="100%" stopColor="#1DAFD9"/>
                </linearGradient>
              </defs>
              <circle cx="20" cy="18" r="14" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" opacity="0.5"/>
              <ellipse cx="20" cy="29" rx="8" ry="2.2" stroke="url(#logoGrad)" strokeWidth="1.2" fill="none"/>
              <ellipse cx="20" cy="29" rx="4.5" ry="1.3" stroke="url(#logoGrad)" strokeWidth="0.8" fill="none"/>
              <line x1="20" y1="29" x2="20" y2="19" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20 19 C17 15.5 14 13.5 13.5 10" stroke="url(#logoGrad)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <path d="M20 19 C23 15.5 26 13.5 26.5 10" stroke="url(#logoGrad)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
              <path d="M20 19 C18.8 15 18 12.5 20 10" stroke="url(#logoGrad)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M20 8 C19 10 18.2 11.2 18.2 12C18.2 12.88 19 13.6 20 13.6C21 13.6 21.8 12.88 21.8 12C21.8 11.2 21 10 20 8Z" fill="url(#logoGrad)"/>
            </svg>
            <div className="leading-tight min-w-0">
              <span className="block text-base font-bold tracking-wide text-[#0C5A86] dark:text-white">
                CONSUDES
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-widest uppercase truncate">
                Conselho de Entidades
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              data-testid="theme-toggle"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a
              href="#contato"
              className="hidden md:flex items-center gap-2 bg-[#0C5A86] hover:bg-[#09476B] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Fale conosco
            </a>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-1 animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={close}
              className="px-4 py-3.5 rounded-xl text-sm font-medium transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={close}
            className="flex items-center justify-center mt-1 bg-[#0C5A86] hover:bg-[#09476B] text-white px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Fale conosco
          </a>
        </div>
      )}
    </header>
  );
}
