import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CONTACT_EMAIL = 'contato@consudes.org.br';

export default function Footer() {
  const { t } = useLanguage();

  const cols = [
    {
      heading: t.footer.colInstitutional,
      links: [
        { to: '/historia', label: t.nav.history },
        { to: '/missao', label: t.nav.mission },
        { to: '/valores', label: t.nav.values },
        { to: '/sede', label: t.nav.headquarters },
        { to: '/equipe', label: t.nav.team },
        { to: '/ex-presidentes', label: t.nav.formerPresidents },
        { to: '/federacoes', label: t.nav.federations },
      ],
    },
    {
      heading: t.nav.transparency,
      links: [
        { to: '/relatorios', label: t.nav.reports },
        { href: 'https://webmail.hostinger.com', label: 'Webmail' },
      ],
    },
    {
      heading: t.footer.colContent,
      links: [
        { to: '/noticias', label: t.nav.news },
        { to: '/galeria', label: t.nav.gallery },
        { to: '/esportes', label: t.nav.sports },
        { to: '/calendario', label: t.nav.calendar },
        { to: '/interclubes', label: t.nav.interclubs },
      ],
    },
    {
      heading: t.footer.colContact,
      links: [
        { to: '/contato', label: t.nav.contact },
      ],
    },
  ];

  return (
    <footer className="bg-[#002D5E]">

      {/* Faixa decorativa topo */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#D9A441] to-transparent opacity-60" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-14 pb-10">

        {/* Grid principal — brand fixo + nav agrupado */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4 lg:w-[210px] flex-shrink-0">
            <Link to="/" className="inline-block w-fit group">
              <span className="inline-flex items-center justify-center bg-white/95 rounded-md px-3 py-2 shadow-[0_1px_6px_rgba(0,0,0,0.18)] group-hover:bg-white transition-colors duration-200">
                <img
                  src="/logo-novo-consudes-removebg-preview-1.png"
                  alt="CONSUDES"
                  className="h-12 w-auto object-contain block"
                />
              </span>
            </Link>
            <p className="text-white/55 text-[12px] leading-[1.8] font-light tracking-wide">
              {t.topbar}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-[12px] text-white/55 hover:text-[#D9A441] transition-colors duration-150 group w-fit"
            >
              <Mail size={13} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Colunas de links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-[#D9A441] text-[9px] font-bold tracking-[0.2em] uppercase mb-4 opacity-80">
                  {heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link.href ?? link.to}>
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to!}
                          className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divisória */}
        <div className="border-t border-white/8" />

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-white/40 tracking-wide font-light">
            © {new Date().getFullYear()} CONSUDES &nbsp;·&nbsp; {t.footer.rights}
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-[11px] text-white/15 hover:text-white/40 transition-colors duration-150 group"
          >
            <svg
              className="w-3 h-3 group-hover:opacity-100 opacity-60 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Área administrativa
          </Link>
        </div>

      </div>
    </footer>
  );
}
