import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  disableClarity,
  disableGoogleAnalytics,
  initClarity,
  initGoogleAnalytics
} from "../lib/analytics";

export const COOKIE_CONSENT_STORAGE_KEY = "consudes-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1;

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  version: number;
}

const DEFAULT_CONSENT: CookieConsent = {
  necessary: true,
  analytics: false,
  version: COOKIE_CONSENT_VERSION
};

interface CookieConsentContextType {
  consent: CookieConsent;
  /** true enquanto o usuário nunca salvou uma preferência válida. */
  hasDecided: boolean;
  isBannerOpen: boolean;
  /** true quando o banner foi aberto pelo link de preferências do rodapé. */
  openedInSettings: boolean;
  openBanner: () => void;
  openPreferences: () => void;
  closeBanner: () => void;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (preferences: { analytics: boolean }) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(
  null
);

function readStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed?.version !== COOKIE_CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: parsed.analytics === true,
      version: COOKIE_CONSENT_VERSION
    };
  } catch {
    return null;
  }
}

function persistConsent(consent: CookieConsent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* modo privado / storage indisponível */
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [stored] = useState<CookieConsent | null>(readStoredConsent);
  const [consent, setConsent] = useState<CookieConsent>(
    stored ?? DEFAULT_CONSENT
  );
  const [hasDecided, setHasDecided] = useState(stored !== null);
  const [isBannerOpen, setIsBannerOpen] = useState(stored === null);
  const [openedInSettings, setOpenedInSettings] = useState(false);

  useEffect(() => {
    if (consent.analytics) {
      initGoogleAnalytics();
      void initClarity();
    } else {
      disableGoogleAnalytics();
      disableClarity();
    }
  }, [consent.analytics]);

  const apply = useCallback((analytics: boolean) => {
    const next: CookieConsent = {
      necessary: true,
      analytics,
      version: COOKIE_CONSENT_VERSION
    };
    persistConsent(next);
    setConsent(next);
    setHasDecided(true);
    setIsBannerOpen(false);
    setOpenedInSettings(false);
  }, []);

  const value = useMemo<CookieConsentContextType>(
    () => ({
      consent,
      hasDecided,
      isBannerOpen,
      openedInSettings,
      openBanner: () => {
        setOpenedInSettings(false);
        setIsBannerOpen(true);
      },
      openPreferences: () => {
        setOpenedInSettings(true);
        setIsBannerOpen(true);
      },
      closeBanner: () => {
        setIsBannerOpen(false);
        setOpenedInSettings(false);
      },
      acceptAll: () => apply(true),
      rejectOptional: () => apply(false),
      savePreferences: ({ analytics }) => apply(analytics)
    }),
    [consent, hasDecided, isBannerOpen, openedInSettings, apply]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx)
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider"
    );
  return ctx;
}
