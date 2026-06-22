import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

interface DeleteConfirmModalProps {
  /** Título exibido no modal, ex: "Apagar notícia" */
  title: string;
  /** Descrição do item sendo apagado, ex: título da notícia */
  itemLabel: string;
  /** Chamado com o motivo digitado quando o usuário confirma */
  onConfirm: (reason: string) => void | Promise<void>;
  /** Chamado quando o usuário cancela ou fecha o modal */
  onCancel: () => void;
}

/**
 * Modal de confirmação para exclusões destrutivas.
 * Exige que o usuário digite um motivo antes de confirmar.
 */
export default function DeleteConfirmModal({
  title,
  itemLabel,
  onConfirm,
  onCancel
}: DeleteConfirmModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [reasonTouched, setReasonTouched] = useState(false);
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  // Foco no campo ao abrir
  useEffect(() => {
    reasonRef.current?.focus();
  }, []);

  // Fechar com Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setReasonTouched(true);
      reasonRef.current?.focus();
      return;
    }
    setLoading(true);
    await onConfirm(reason.trim());
    setLoading(false);
    setReason("");
    setReasonTouched(false);
  };

  const trimmed = reason.trim();
  const reasonError = reasonTouched && !trimmed;

  return (
    // Overlay
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onCancel();
      }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="delete-modal-title"
              className="text-lg font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-medium text-[#1F2937]">
                &ldquo;{itemLabel}&rdquo;
              </span>{" "}
              será removido permanentemente.
            </p>
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

        {/* Aviso visual */}
        <div className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
          <svg
            className="w-4 h-4 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          Esta ação não pode ser desfeita.
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="delete-reason"
              className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Motivo da exclusão <span className="text-red-500">*</span>
            </label>
            <textarea
              id="delete-reason"
              ref={reasonRef}
              value={reason}
              onChange={e => setReason(e.target.value)}
              onBlur={() => setReasonTouched(true)}
              rows={3}
              required
              aria-invalid={reasonError ? "true" : "false"}
              aria-describedby={reasonError ? "delete-reason-error" : undefined}
              placeholder="Descreva o motivo para registrar no log de auditoria…"
              className={`w-full resize-none rounded-lg border px-4 py-3 text-sm text-[#1F2937] placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                reasonError
                  ? "border-red-400 bg-white focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 bg-white focus:border-[#D9A441] focus:ring-[#D9A441]/35"
              }`}
            />
            {reasonError && (
              <p
                id="delete-reason-error"
                className="mt-1.5 text-sm text-red-600">
                Informe o motivo da exclusão.
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!trimmed || loading}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-700 hover:bg-red-800 active:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? "Apagando…" : "Confirmar exclusão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
