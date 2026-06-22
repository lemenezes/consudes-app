import { useMemo, useState } from "react";
import type { FormEvent } from "react";

interface ForcedPasswordChangeModalProps {
  loading: boolean;
  onConfirm: (newPassword: string) => Promise<void>;
}

export default function ForcedPasswordChangeModal({
  loading,
  onConfirm
}: ForcedPasswordChangeModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const newPasswordError = useMemo(() => {
    if (!submitAttempted) return "";
    if (!newPassword) return "A nova senha é obrigatória.";
    if (newPassword.length < 8) {
      return "A nova senha deve ter no mínimo 8 caracteres.";
    }
    return "";
  }, [newPassword, submitAttempted]);

  const confirmPasswordError = useMemo(() => {
    if (!submitAttempted) return "";
    if (!confirmPassword) return "Confirme a nova senha.";
    if (confirmPassword !== newPassword) {
      return "As senhas não coincidem.";
    }
    return "";
  }, [confirmPassword, newPassword, submitAttempted]);

  const isValid =
    newPassword.length >= 8 &&
    confirmPassword.length > 0 &&
    confirmPassword === newPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isValid || loading) {
      return;
    }

    await onConfirm(newPassword);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forced-password-change-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div>
          <h2
            id="forced-password-change-title"
            className="text-lg font-['Cormorant_Garamond'] font-semibold text-[#1F2937]">
            Alteração obrigatória de senha
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Sua senha inicial é temporária e deve ser alterada antes de utilizar
            o sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Nova Senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              aria-invalid={newPasswordError ? "true" : "false"}
              aria-describedby={
                newPasswordError ? "new-password-error" : undefined
              }
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#1F2937] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                newPasswordError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#0057A8] focus:ring-[#0057A8]/25"
              }`}
              placeholder="No mínimo 8 caracteres"
              required
              minLength={8}
            />
            {newPasswordError && (
              <p
                id="new-password-error"
                className="mt-1.5 text-sm text-red-600">
                {newPasswordError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-[#1F2937] mb-1.5">
              Confirmar Senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              aria-invalid={confirmPasswordError ? "true" : "false"}
              aria-describedby={
                confirmPasswordError ? "confirm-password-error" : undefined
              }
              className={`w-full rounded-lg border px-3 py-2 text-sm text-[#1F2937] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                confirmPasswordError
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-gray-200 focus:border-[#0057A8] focus:ring-[#0057A8]/25"
              }`}
              placeholder="Repita a nova senha"
              required
            />
            {confirmPasswordError && (
              <p
                id="confirm-password-error"
                className="mt-1.5 text-sm text-red-600">
                {confirmPasswordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#0057A8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004A90] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Atualizando senha..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
