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
        { to: '/equipe', label: t.nav.team },
        { to: '/federacoes', label: t.nav.federations },
      ],
    },
    {
      heading: t.nav.championships,
      links: [
        { to: '/campeonatos', label: t.nav.championships },
        { to: '/interclubes', label: t.nav.interclubs },
        { to: '/jogos-sul-americanos', label: t.nav.southAmericanGames },
        { to: '/rankings', label: t.nav.rankings },
        { to: '/calendario', label: t.nav.calendar },
      ],
    },
    {
      heading: t.footer.colContent,
      links: [
        { to: '/noticias', label: t.nav.news },
        { to: '/galeria', label: t.nav.gallery },
        { to: '/esportes', label: t.nav.sports },
        { to: '/transparencia', label: t.nav.transparency },
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
    <footer className="bg-[#003B73] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Grid principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center bg-white rounded px-2 py-1.5 w-fit">
              <img
                src="/logo-novo-consudes-removebg-preview-1.png"
                alt="CONSUDES"
                className="h-14 w-auto object-contain block"
              />
            </span>
            <p className="text-white/50 text-xs leading-relaxed max-w-[180px]">
              {t.topbar}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <Mail size={12} />
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Colunas de links */}
          {cols.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-[#D9A441] text-[10px] font-bold tracking-widest uppercase mb-4">
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} CONSUDES · {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] text-white/20 hover:text-white/50 transition-colors group"
            >
              <svg
                className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Área administrativa
            </Link>
            <span className="w-6 h-0.5 bg-[#D9A441] rounded" />
          </div>
        </div>

      </div>
    </footer>
  );
}
