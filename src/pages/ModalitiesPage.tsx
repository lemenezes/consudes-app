import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import PageShell from "../components/PageShell";
import { useSEO } from "../hooks/useSEO";
import { getModalityIcon } from "../components/icons/SportIcons";
import {
  modalities,
  getModalityName,
  getModalityDescription
} from "../data/modalitiesData";

export default function ModalitiesPage() {
  const { lang, t } = useLanguage();

  const pageTitle = {
    es: "Modalidades",
    pt: "Modalidades",
    en: "Sports"
  }[lang];

  const pageSubtitle = {
    es: "Conoce las modalidades deportivas promovidas por CONSUDES.",
    pt: "Conheça as modalidades esportivas promovidas pela CONSUDES.",
    en: "Discover the sports promoted by CONSUDES."
  }[lang];

  useSEO({
    title: pageTitle,
    url: "/esportes/modalidades"
  });

  return (
    <PageShell
      title={pageTitle}
      breadcrumbs={[{ label: t.nav.sports }, { label: pageTitle }]}>
      <section className="bg-[#F5F7FA] dark:bg-[#080e1a] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="text-[#1F2937]/75 dark:text-white/65 text-base sm:text-[17px] leading-relaxed">
              {pageSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modalities.map(modality => {
              const Icon = getModalityIcon(modality.slug);

              return (
                <Link
                  key={modality.slug}
                  to={`/esportes/modalidades/${modality.slug}`}
                  className="group flex flex-col p-6 rounded-2xl bg-white dark:bg-[#0d1624] border border-[#003B73]/8 dark:border-white/8 hover:border-[#D9A441]/50 dark:hover:border-[#D9A441]/40 hover:shadow-[0_4px_20px_rgba(0,57,115,0.10)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.30)] transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-[#0057A8]/8 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:bg-[#0057A8]/12 dark:group-hover:bg-white/10 transition-colors">
                    <Icon
                      size={21}
                      className="text-[#0057A8] dark:text-white/60 group-hover:text-[#D9A441] transition-colors"
                    />
                  </div>

                  <h2 className="font-semibold text-[#003B73] dark:text-white/90 text-base mb-2">
                    {getModalityName(modality, lang)}
                  </h2>

                  <p className="text-[#1F2937]/55 dark:text-white/40 text-[12px] leading-relaxed flex-1">
                    {getModalityDescription(modality, lang)}
                  </p>

                  <div className="flex items-center gap-1.5 mt-5 text-[#0057A8] dark:text-white/60 text-xs font-medium">
                    <span>
                      {
                        {
                          es: "Conocer modalidad",
                          pt: "Conhecer modalidade",
                          en: "View sport"
                        }[lang]
                      }
                    </span>
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
