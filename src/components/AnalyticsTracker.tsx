import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";
import { isGoogleAnalyticsReady, trackPageview } from "../lib/analytics";

/**
 * Registra pageviews do Google Analytics 4 em cada mudança de rota (SPA),
 * somente quando o usuário consentiu com cookies de analytics.
 */
export default function AnalyticsTracker() {
  const location = useLocation();
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent.analytics || !isGoogleAnalyticsReady()) return;
    trackPageview(location.pathname + location.search);
  }, [consent.analytics, location.pathname, location.search]);

  return null;
}
