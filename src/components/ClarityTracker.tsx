import { useEffect } from "react";
import { useCookieConsent } from "../context/CookieConsentContext";
import { initClarity } from "../lib/analytics";

/**
 * Carrega o Microsoft Clarity sob demanda, apenas após consentimento
 * de analytics. O módulo não é importado antes do consentimento.
 */
export default function ClarityTracker() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent.analytics) return;
    void initClarity();
  }, [consent.analytics]);

  return null;
}
