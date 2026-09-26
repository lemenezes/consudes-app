import ReactGA from "react-ga4";

export const GA_MEASUREMENT_ID = "G-LR5VPGLW76";
export const CLARITY_PROJECT_ID = "wum5ve2eiu";

let gaInitialized = false;
let clarityInitialized = false;
let clarityLoading = false;

type ClarityApi = typeof import("@microsoft/clarity").default;
let clarityApi: ClarityApi | null = null;

/** Flag suportada pelo gtag.js para desativar o envio de hits de uma propriedade. */
function setGaDisableFlag(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[
    `ga-disable-${GA_MEASUREMENT_ID}`
  ] = disabled;
}

export function isGoogleAnalyticsReady() {
  return gaInitialized;
}

export function initGoogleAnalytics() {
  setGaDisableFlag(false);
  if (gaInitialized) return;
  ReactGA.initialize(GA_MEASUREMENT_ID);
  gaInitialized = true;
}

export function disableGoogleAnalytics() {
  if (!gaInitialized) return;
  setGaDisableFlag(true);
  try {
    ReactGA.gtag("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied"
    });
  } catch {
    /* gtag pode não estar disponível */
  }
}

export function trackPageview(page: string) {
  if (!gaInitialized) return;
  ReactGA.send({ hitType: "pageview", page });
}

export async function initClarity() {
  if (clarityInitialized || clarityLoading) {
    clarityApi?.consent(true);
    return;
  }
  clarityLoading = true;
  try {
    const module = await import("@microsoft/clarity");
    clarityApi = module.default;
    clarityApi.init(CLARITY_PROJECT_ID);
    clarityApi.consent(true);
    clarityInitialized = true;
  } catch {
    /* falha de rede/bloqueio não deve quebrar a aplicação */
  } finally {
    clarityLoading = false;
  }
}

export function disableClarity() {
  try {
    clarityApi?.consent(false);
  } catch {
    /* API pode não estar disponível */
  }
}
