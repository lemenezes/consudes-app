import { Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CONTACT_EMAIL = 'contato@consudes.org.br';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#003B73] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

          {/* Brand */}
          <div className="inline-flex items-center">
            <span className="inline-flex items-center bg-white rounded px-2 py-1.5 transition-colors">
              <img
                src="/logo-novo-consudes-removebg-preview-1.png"
                alt="CONSUDES"
                className="h-16 sm:h-20 w-auto object-contain block"
              />
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-white/70 flex-wrap">
            <a href="#sobre" className="hover:text-white transition-colors">
              {t.nav.about}
            </a>
            <a href="#programas" className="hover:text-white transition-colors">
              {t.nav.programs}
            </a>
            <a href="#noticias" className="hover:text-white transition-colors">
              {t.nav.news}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail size={13} />
              {t.nav.contact}
            </a>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CONSUDES · {t.footer.rights}
          </p>
          <span className="w-6 h-0.5 bg-[#D9A441] rounded" />
        </div>

      </div>
    </footer>
  );
}
