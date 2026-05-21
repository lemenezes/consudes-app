import { useState } from "react";
import { Mail, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const CONTACT_EMAIL = "contato@consudes.com";

export default function Footer() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cols = [
    {
      heading: t.footer.colInstitutional,
      links: [
        { to: "/historia", label: t.nav.history },
        { to: "/missao", label: t.nav.mission },
        { to: "/valores", label: t.nav.values },
        { to: "/equipe", label: t.nav.team },
        { to: "/ex-presidentes", label: t.nav.formerPresidents },
        { to: "/federacoes", label: t.nav.federations }
      ]
    },
    {
      heading: t.nav.transparency,
      links: [
        { to: "/relatorios", label: t.nav.reports },
        { href: "https://webmail.hostinger.com", label: "Webmail" }
      ]
    },
    {
      heading: t.footer.colContent,
      links: [
        { to: "/noticias", label: t.nav.news },
        { to: "/galeria", label: t.nav.gallery },
        { to: "/esportes", label: t.nav.sports },
        { to: "/calendario", label: t.nav.calendar },
        { to: "/interclubes", label: t.nav.interclubs }
      ]
    },
    {
      heading: t.footer.colContact,
      links: [{ to: "/contato", label: t.nav.contact }]
    }
  ];

  return (
    <footer className="bg-consudes-blue">
      {/* Faixa decorativa topo */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-consudes-gold/70 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8">
        {/* Grid principal — brand fixo + nav agrupado */}
        <div className="flex flex-col lg:flex-row gap-7 lg:gap-14 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:w-[240px] flex-shrink-0">
            <Link to="/" className="inline-block w-fit group">
              <span className="inline-flex items-center justify-center bg-white/95 rounded-md px-4 py-2.5 shadow-[0_1px_8px_rgba(0,0,0,0.20)] group-hover:bg-white transition-colors duration-200">
                <img
                  src="/logo-novo-consudes-removebg-preview-1.webp"
                  alt="CONSUDES"
                  width={546}
                  height={457}
                  className="h-[68px] w-auto object-contain block"
                />
              </span>
            </Link>
            <p className="text-white/65 text-[13px] leading-[1.75] font-light tracking-wide">
              {t.topbar}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-[12px] text-white/65 hover:text-consudes-gold transition-colors duration-150 group w-fit">
              <Mail
                size={13}
                className="opacity-60 group-hover:opacity-100 transition-opacity"
              />
              {CONTACT_EMAIL}
            </a>
            {/* Redes sociais oficiais CONSUDES */}
            <div className="flex gap-3 mt-2 mb-1" aria-label="Redes sociais CONSUDES">
              <a
                href="https://www.instagram.com/consudes.info/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram CONSUDES"
                className="group/social text-white/60 hover:text-[#D4A63A] transition-colors duration-150 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A63A]"
              >
                {/* SVG Instagram (outline, círculo no canto) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/consudes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook CONSUDES"
                className="group/social text-white/60 hover:text-[#D4A63A] transition-colors duration-150 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A63A]"
              >
                {/* SVG Facebook (filled, padrão fmds-app) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://x.com/consudes11"
                rel="noopener noreferrer"
                aria-label="X (Twitter) CONSUDES"
                className="group/social text-white/60 hover:text-[#D4A63A] transition-colors duration-150 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A63A]"
                target="_blank"
              >
                {/* SVG X/Twitter */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M17.5 6.5l-11 11" />
                  <path d="M6.5 6.5l11 11" />
                </svg>
              </a>
            </div>
            {/* Filiada a — alinhada com a logo CONSUDES */}
            <div className="pt-1">
              <p className="text-consudes-gold text-[9px] font-bold tracking-[0.2em] uppercase mb-3">
                {t.footer.colRecognized}
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.deaflympics.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-white/95 hover:bg-white rounded-lg px-3 py-1.5 border border-white/10 hover:border-consudes-gold/40 shadow-[0_1px_6px_rgba(0,0,0,0.25)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200"
                  aria-label="Deaflympics">
                  <img
                    src="/images/logo-deaflympics.jpg"
                    alt="Deaflympics"
                    className="h-7 w-auto object-contain"
                  />
                </a>
                <a
                  href="https://panamdes.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-white/95 hover:bg-white rounded-lg px-3 py-1.5 border border-white/10 hover:border-consudes-gold/40 shadow-[0_1px_6px_rgba(0,0,0,0.25)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all duration-200"
                  aria-label="PANAMDES">
                  <img
                    src="/images/logo-panamdes.png"
                    alt="PANAMDES"
                    className="h-7 w-auto object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Colunas de links — accordion no mobile, grid no desktop */}
          <div className="flex-1">
            {/* Mobile: accordion */}
            <div className="sm:hidden divide-y divide-white/8">
              {cols.map(({ heading, links }, i) => (
                <div key={heading}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    aria-expanded={openIndex === i}
                    aria-controls={`footer-col-${i}`}
                    className="w-full flex items-center justify-between py-3.5 text-left">
                    <span className="text-consudes-gold text-[9px] font-bold tracking-[0.2em] uppercase">
                      {heading}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-white/40 transition-transform duration-200 flex-shrink-0 ${openIndex === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    id={`footer-col-${i}`}
                    className={`overflow-hidden transition-all duration-200 ${openIndex === i ? "max-h-64 pb-3" : "max-h-0"}`}>
                    <ul className="flex flex-col gap-3 pl-1">
                      {links.map(link => (
                        <li key={link.href ?? link.to}>
                          {link.href ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide">
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              to={link.to!}
                              className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide">
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: grid normal */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-8">
              {cols.map(({ heading, links }) => (
                <div key={heading}>
                  <p className="text-consudes-gold text-[9px] font-bold tracking-[0.2em] uppercase mb-4">
                    {heading}
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {links.map(link => (
                      <li key={link.href ?? link.to}>
                        {link.href ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide">
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.to!}
                            className="text-[13px] text-white/65 hover:text-white transition-colors duration-150 font-light tracking-wide">
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
        </div>

        {/* Divisória */}
        <div className="h-px w-16 bg-white/15" />

        {/* Bottom */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-white/60 tracking-wide font-light flex flex-wrap items-center gap-x-2">
            © {new Date().getFullYear()} CONSUDES
            <span aria-hidden="true" className="mx-1 text-white/25 select-none">·</span>
            {t.footer.rights}
            <span aria-hidden="true" className="mx-1 text-white/25 select-none">·</span>
            <span className="inline-flex items-center gap-1 text-white/40">
              <span className="sr-only">Desenvolvido por</span>
              <a
                href="https://www.leandrom.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[#D4A63A] transition-colors duration-200 underline-offset-2 decoration-dotted underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A63A] rounded-sm px-0.5"
                style={{ fontWeight: 500, opacity: 0.55, fontSize: "11px", letterSpacing: "0.01em" }}
              >
                Desenvolvido por Leandro M.
              </a>
            </span>
          </p>
          <a
            href="/admin/login"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-white/55 hover:text-white/60 transition-colors duration-150 group">
            <svg
              className="w-3 h-3 group-hover:opacity-100 opacity-60 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
              aria-hidden="true">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            {t.footer.adminArea}
          </a>
        </div>
      </div>
    </footer>
  );
}
