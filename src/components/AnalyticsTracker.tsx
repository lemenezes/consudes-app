import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

/**
 * Componente para registrar pageviews do Google Analytics 4
 * em toda mudança de rota do React Router (SPA).
 * Compatível com React StrictMode.
 */
export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Envia pageview para o GA4
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location.pathname, location.search]);

  return null;
}
