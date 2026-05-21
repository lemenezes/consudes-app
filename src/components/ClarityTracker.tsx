import { useEffect } from "react";

/**
 * Integração profissional do Microsoft Clarity para SPA React.
 * Compatível com React StrictMode e evita duplicidade.
 * Usa o pacote oficial @microsoft/clarity.
 */
export default function ClarityTracker() {
  useEffect(() => {
    // Só inicializa se ainda não foi carregado
    if (!(window as any).__clarity_injected) {
      import("@microsoft/clarity").then((ClarityModule) => {
        const Clarity = ClarityModule.default;
        Clarity.init("wum5ve2eiu");
        (window as any).__clarity_injected = true;
      });
    }
  }, []);
  return null;
}
