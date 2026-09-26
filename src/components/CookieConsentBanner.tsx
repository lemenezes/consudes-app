import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useCookieConsent } from "../context/CookieConsentContext";

/**
 * URL da Política de Privacidade e Cookies.
 * Enquanto a página não existir, o link não é exibido.
 */
const PRIVACY_POLICY_URL = "/politica-de-privacidade";

function Toggle({
  checked,
  disabled,
  label,
  onChange
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-consudes-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50 dark:focus-visible:ring-offset-[#0F2744] ${
        checked
          ? "bg-consudes-blue dark:bg-consudes-gold"
          : "bg-slate-300 dark:bg-slate-600"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function CookieConsentBanner() {
  const { t } = useLanguage();
  const {
    consent,
    isBannerOpen,
    openedInSettings,
    closeBanner,
    acceptAll,
    rejectOptional,
    savePreferences
  } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);

  useEffect(() => {
    if (isBannerOpen) {
      setAnalytics(consent.analytics);
      setShowSettings(openedInSettings);
    }
  }, [isBannerOpen, openedInSettings, consent.analytics]);

  if (!isBannerOpen) return null;

  const c = t.cookies;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={c.title}
      className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-4xl rounded-2xl bg-blue-50 shadow-[0_10px_30px_-10px_rgba(0,45,94,0.30)] dark:bg-[#0F2744] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.70)]">
        <div className="p-3">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-consudes-blue/10 text-consudes-blue ring-1 ring-consudes-blue/15 dark:bg-consudes-gold/15 dark:text-consudes-gold dark:ring-consudes-gold/25">
              <Cookie size={20} aria-hidden="true" />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold tracking-tight text-consudes-blue dark:text-white">
                {c.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300/90">
                {c.description}
              </p>
              {PRIVACY_POLICY_URL && (
                <a
                  href={PRIVACY_POLICY_URL}
                  className="mt-2 inline-block text-[12px] font-medium text-consudes-blue underline underline-offset-2 hover:text-consudes-gold dark:text-consudes-gold dark:hover:text-white">
                  {c.policyLink}
                </a>
              )}
            </div>
            {showSettings && (
              <button
                type="button"
                onClick={() =>
                  openedInSettings ? closeBanner() : setShowSettings(false)
                }
                aria-label={c.close}
                className="rounded-md p-1 text-slate-400 transition-colors hover:bg-consudes-blue/10 hover:text-consudes-blue dark:hover:bg-white/10 dark:hover:text-white">
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {showSettings && (
            <div className="mt-5 space-y-3 border-t border-consudes-blue/10 pt-4 dark:border-white/10">
              <h3 className="sr-only">{c.settingsTitle}</h3>

              <div className="flex items-start gap-3 rounded-xl border border-consudes-blue/10 bg-white/70 p-3.5 dark:border-white/5 dark:bg-white/5">
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-consudes-blue dark:text-white">
                    {c.necessaryTitle}
                    <span className="ml-2 align-middle text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {c.necessaryAlwaysOn}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {c.necessaryDescription}
                  </p>
                </div>
                <Toggle checked disabled label={c.necessaryTitle} />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-consudes-blue/10 bg-white/70 p-3.5 dark:border-white/5 dark:bg-white/5">
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-consudes-blue dark:text-white">
                    {c.analyticsTitle}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {c.analyticsDescription}
                  </p>
                </div>
                <Toggle
                  checked={analytics}
                  label={c.analyticsTitle}
                  onChange={setAnalytics}
                />
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2.5">
            {showSettings ? (
              <button
                type="button"
                onClick={() => savePreferences({ analytics })}
                className="w-full rounded-lg bg-consudes-blue px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-consudes-blue-mid sm:w-auto dark:bg-consudes-gold dark:text-consudes-blue dark:hover:bg-consudes-gold-dark">
                {c.save}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="w-full rounded-lg border border-consudes-blue/20 bg-transparent px-4 py-2.5 text-[13px] font-medium text-consudes-blue/80 transition-colors hover:border-consudes-blue/40 hover:bg-consudes-blue/5 hover:text-consudes-blue sm:w-auto dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:bg-white/5 dark:hover:text-white">
                  {c.reject}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  aria-expanded={showSettings}
                  className="w-full rounded-lg border border-consudes-blue/20 bg-transparent px-4 py-2.5 text-[13px] font-medium text-consudes-blue/80 transition-colors hover:border-consudes-blue/40 hover:bg-consudes-blue/5 hover:text-consudes-blue sm:w-auto dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:bg-white/5 dark:hover:text-white">
                  {c.settings}
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="w-full rounded-lg bg-consudes-blue px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-consudes-blue-mid sm:w-auto dark:bg-consudes-gold dark:text-consudes-blue dark:hover:bg-consudes-gold-dark">
                  {c.acceptAll}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
