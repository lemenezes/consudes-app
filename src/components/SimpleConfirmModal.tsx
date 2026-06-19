import { useEffect } from "react";

interface SimpleConfirmModalProps {
  /** Título exibido no modal */
  title: string;
  /** Mensagem descritiva */
  message: string;
  /** Chamado quando o usuário confirma */
  onConfirm: () => void | Promise<void>;
  /** Chamado quando o usuário cancela ou fecha o modal */
  onCancel: () => void;
  /** Rótulo do botão de confirmação (padrão: "Confirmar") */
  confirmLabel?: string;
  /** Rótulo do botão de cancelamento (padrão: "Cancelar") */
  cancelLabel?: string;
  /** Se true, botão de confirmação fica em vermelho */
  isDangerous?: boolean;
  /** Se true, mostra state de loading no botão de confirmação */
  isLoading?: boolean;
}

/**
 * Modal de confirmação simples.
 * Sem exigência de motivo, apenas confirm/cancel.
 */
export default function SimpleConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isDangerous = false,
  isLoading = false
}: SimpleConfirmModalProps) {
  // Fechar com Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onCancel();
      }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="confirm-modal-title"
              className="text-lg font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mensagem */}
        <p className="text-sm text-gray-600">{message}</p>

        {/* Botões */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
              isDangerous
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 mr-2 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2a10 10 0 1 0 10 10"
                  />
                </svg>
                Processando...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
