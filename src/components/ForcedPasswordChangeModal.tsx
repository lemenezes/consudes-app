import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface ForcedPasswordChangeModalProps {
  loading: boolean;
  onConfirm: (newPassword: string) => Promise<string | null>;
}

export default function ForcedPasswordChangeModal({
  loading,
  onConfirm
}: ForcedPasswordChangeModalProps) {
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const newPasswordError = useMemo(() => {
    if (!submitAttempted) return "";
    if (!newPassword) return t.admin.forcedPassword.validation.newRequired;
    if (newPassword.length < 8) {
      return t.admin.forcedPassword.validation.minLength;
    }
    return "";
  }, [newPassword, submitAttempted, t.admin.forcedPassword.validation]);

  const confirmPasswordError = useMemo(() => {
    if (!submitAttempted) return "";
    if (!confirmPassword)
      return t.admin.forcedPassword.validation.confirmRequired;
    if (confirmPassword !== newPassword) {
      return t.admin.forcedPassword.validation.mismatch;
    }
    return "";
  }, [
    confirmPassword,
    newPassword,
    submitAttempted,
    t.admin.forcedPassword.validation
  ]);

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

    setSubmitError("");
    const error = await onConfirm(newPassword);
    if (error) {
      setSubmitError(error);
    }
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
            {t.admin.forcedPassword.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            {t.admin.forcedPassword.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-[#1F2937] mb-1.5">
              {t.admin.forcedPassword.newPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  if (submitError) setSubmitError("");
                }}
                aria-invalid={newPasswordError ? "true" : "false"}
                aria-describedby={
                  newPasswordError ? "new-password-error" : undefined
                }
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-[#1F2937] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  newPasswordError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#0057A8] focus:ring-[#0057A8]/25"
                }`}
                placeholder={t.admin.forcedPassword.newPasswordPlaceholder}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(v => !v)}
                aria-label={
                  showNewPassword
                    ? t.admin.forcedPassword.actions.hidePassword
                    : t.admin.forcedPassword.actions.showPassword
                }
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-[#1F2937]">
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
              {t.admin.forcedPassword.confirmPasswordLabel}
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  if (submitError) setSubmitError("");
                }}
                aria-invalid={confirmPasswordError ? "true" : "false"}
                aria-describedby={
                  confirmPasswordError ? "confirm-password-error" : undefined
                }
                className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-[#1F2937] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  confirmPasswordError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-gray-200 focus:border-[#0057A8] focus:ring-[#0057A8]/25"
                }`}
                placeholder={t.admin.forcedPassword.confirmPasswordPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                aria-label={
                  showConfirmPassword
                    ? t.admin.forcedPassword.actions.hidePassword
                    : t.admin.forcedPassword.actions.showPassword
                }
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-[#1F2937]">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p
                id="confirm-password-error"
                className="mt-1.5 text-sm text-red-600">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#0057A8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004A90] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? t.admin.forcedPassword.submitting
              : t.admin.forcedPassword.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
