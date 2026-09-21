import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Loader2,
  TriangleAlert,
  X
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import PageShell from "../components/PageShell";
import { useSEO } from "../hooks/useSEO";
import { getModalityIcon } from "../components/icons/SportIcons";
import {
  modalities,
  getModalityName,
  getModalityDescription
} from "../data/modalitiesData";

const MODALITIES_LABEL = { es: "Modalidades", pt: "Modalidades", en: "Sports" };

const REGULATION_TITLE = {
  es: "Reglamento Técnico",
  pt: "Regulamento Técnico",
  en: "Technical Regulations"
};
const REGULATION_PENDING = {
  es: "El documento del reglamento técnico será publicado próximamente en esta área.",
  pt: "O documento do regulamento técnico será disponibilizado em breve nesta área.",
  en: "The technical regulation document will be made available here soon."
};
const VIEW_BTN = { es: "Visualizar", pt: "Visualizar", en: "View" };
const DOWNLOAD_BTN = { es: "Descargar", pt: "Baixar", en: "Download" };
const BACK_TO_MODALITIES = {
  es: "Volver a Modalidades",
  pt: "Voltar para Modalidades",
  en: "Back to Sports Disciplines"
};

const NOT_FOUND_TITLE = {
  es: "Modalidad no encontrada",
  pt: "Modalidade não encontrada",
  en: "Sport not found"
};
const NOT_FOUND_SUBTITLE = {
  es: "No encontramos la modalidad que buscás. Revisá el enlace o volvé a la lista de modalidades.",
  pt: "Não encontramos a modalidade buscada. Verifique o link ou volte para a lista de modalidades.",
  en: "We couldn't find the sport you're looking for. Check the link or go back to the sports list."
};
const NOT_FOUND_BACK = {
  es: "Volver a modalidades",
  pt: "Voltar para modalidades",
  en: "Back to sports"
};

/**
 * Mesma estratégia usada em TransparencyPage: abre o PDF via Google Docs Viewer
 * para evitar que o Content-Disposition: attachment do CDN force um download.
 */
function RegulationPdfModal({
  url,
  title,
  onClose
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const tp = t.transparencyPage;
  const [iframeLoading, setIframeLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!iframeLoading) return;
    const timer = setTimeout(() => setTimedOut(true), 15000);
    return () => clearTimeout(timer);
  }, [iframeLoading]);

  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className="flex items-center justify-between px-4 py-3 bg-[#002D5E] shrink-0">
        <p className="text-white text-sm font-semibold truncate max-w-[calc(100%-3rem)]">
          {title}
        </p>
        <button
          onClick={onClose}
          aria-label={tp.pdfCloseLabel}
          className="text-white/60 hover:text-white transition-colors p-1">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
      <div className="relative flex-1 w-full">
        {iframeLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-4 z-10">
            {!timedOut ? (
              <>
                <Loader2
                  className="w-8 h-8 text-[#003B73] animate-spin"
                  aria-hidden="true"
                />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    {tp.pdfLoading}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {tp.pdfLoadingNote}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center px-6 max-w-sm">
                <TriangleAlert
                  className="w-10 h-10 text-amber-400 mx-auto mb-3"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {tp.pdfTimeout}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {tp.pdfTimeoutDesc}
                </p>
                <a
                  href={url}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#003B73] text-white text-sm font-semibold hover:bg-[#0057A8] transition-colors">
                  <Download size={15} />
                  {tp.pdfDownload}
                </a>
              </div>
            )}
          </div>
        )}
        <iframe
          src={viewerUrl}
          title={title}
          className="w-full h-full border-0"
          allow="fullscreen"
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
}

export default function ModalityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useLanguage();
  const [previewOpen, setPreviewOpen] = useState(false);

  const modality = modalities.find(m => m.slug === slug);

  useSEO({
    title: modality ? getModalityName(modality, lang) : NOT_FOUND_TITLE[lang],
    url: `/esportes/modalidades/${slug ?? ""}`
  });

  if (!modality) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#003B73] dark:text-white mb-3">
          {NOT_FOUND_TITLE[lang]}
        </h1>
        <p className="text-[#1F2937]/55 dark:text-white/40 text-sm max-w-sm mb-8">
          {NOT_FOUND_SUBTITLE[lang]}
        </p>
        <Link
          to="/esportes/modalidades"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0057A8] hover:bg-[#003B73] text-white text-sm font-semibold transition-colors">
          {NOT_FOUND_BACK[lang]}
        </Link>
      </div>
    );
  }

  const name = getModalityName(modality, lang);
  const description = getModalityDescription(modality, lang);
  const Icon = getModalityIcon(modality.slug);

  return (
    <PageShell
      title={name}
      breadcrumbs={[
        { label: t.nav.sports, href: "/esportes" },
        { label: MODALITIES_LABEL[lang], href: "/esportes/modalidades" },
        { label: name }
      ]}>
      {previewOpen && modality.regulationUrl && (
        <RegulationPdfModal
          url={modality.regulationUrl}
          title={REGULATION_TITLE[lang]}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      <section className="bg-[#F5F7FA] dark:bg-[#080e1a] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12 sm:space-y-14">
          {/* A) Apresentação */}
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#0057A8]/8 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
              <Icon size={26} className="text-[#0057A8] dark:text-white/70" />
            </div>
            <p className="text-[#1F2937]/80 dark:text-white/65 text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* B) Regulamento Técnico */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D9A441] mb-3">
              {REGULATION_TITLE[lang]}
            </h3>
            <div className="rounded-2xl border border-[#003B73]/10 dark:border-white/10 bg-white dark:bg-[#0d1624] p-6">
              {modality.regulationUrl ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#003B73]/6 dark:bg-white/8 flex items-center justify-center flex-shrink-0">
                      <FileText
                        size={19}
                        className="text-[#003B73] dark:text-white/70"
                      />
                    </div>
                    <span className="font-semibold text-[#003B73] dark:text-white/90 text-sm truncate">
                      {REGULATION_TITLE[lang]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      aria-label={`${VIEW_BTN[lang]} ${REGULATION_TITLE[lang]}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#003B73] hover:bg-[#0057A8] text-white text-[12px] font-semibold tracking-wide transition-colors duration-150">
                      <Eye size={15} />
                      <span>{VIEW_BTN[lang]}</span>
                    </button>
                    <a
                      href={modality.regulationUrl}
                      download
                      aria-label={`${DOWNLOAD_BTN[lang]} ${REGULATION_TITLE[lang]}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#003B73]/20 hover:border-[#003B73]/50 text-[#003B73] hover:bg-[#003B73]/5 dark:border-white/20 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/5 text-[12px] font-semibold tracking-wide transition-colors duration-150">
                      <Download size={15} />
                      <span>{DOWNLOAD_BTN[lang]}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <p className="flex items-center gap-2 text-[#1F2937]/65 dark:text-white/55 text-sm">
                  <FileText size={15} className="flex-shrink-0" />
                  {REGULATION_PENDING[lang]}
                </p>
              )}
            </div>
          </div>

          {/* Voltar para a listagem de modalidades */}
          <div>
            <Link
              to="/esportes/modalidades"
              className="inline-flex items-center gap-1.5 text-[#1F2937]/55 dark:text-white/45 hover:text-[#003B73] dark:hover:text-white/80 text-sm font-medium transition-colors">
              <ArrowLeft size={15} />
              <span>{BACK_TO_MODALITIES[lang]}</span>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
