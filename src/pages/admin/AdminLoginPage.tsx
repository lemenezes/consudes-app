import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { isAdminEmail } from '../../utils/adminAllowlist';
import type { Lang } from '../../i18n/translations';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

export default function AdminLoginPage() {
  const { user, signIn } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAdminEmail(email)) {
      setError(t.admin.login.errorUnauthorized);
      return;
    }

    setLoading(true);
    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(t.admin.login.errorInvalid);
      setLoading(false);
    } else {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo + título */}
        <div className="text-center mb-6">
          <img
            src="/logo-novo-consudes-removebg-preview-1.png"
            alt="CONSUDES"
            className="h-24 w-auto mx-auto mb-5"
          />
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#0057A8]/60 font-['Inter']">
            {t.admin.login.adminArea}
          </p>
        </div>

        {/* Seletor de idioma */}
        <div className="flex justify-center gap-1 mb-6">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                lang === code
                  ? 'bg-[#003B73] text-white'
                  : 'text-gray-300 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-10 py-10">
          <h1 className="text-lg font-['Cormorant_Garamond'] font-semibold text-[#1F2937] mb-1">
            {t.admin.login.restricted}
          </h1>
          <div className="w-10 h-px bg-[#D9A441] mb-7 mt-3" />

          {error && (
            <div
              role="alert"
              className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1F2937] mb-2">
                {t.admin.login.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1F2937] mb-2">
                {t.admin.login.password}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-[#1F2937] bg-[#F5F7FA] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0057A8]/25 focus:border-[#0057A8] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold tracking-wide hover:bg-[#c8942e] active:bg-[#b88326] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-1"
            >
              {loading ? t.admin.login.signingIn : t.admin.login.signIn}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {t.admin.login.internalAccess}
        </p>
      </div>
    </div>
  );
}
