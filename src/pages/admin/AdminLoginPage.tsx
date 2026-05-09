import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Já autenticado → redireciona direto
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError('Credenciais inválidas. Verifique e-mail e senha.');
      setLoading(false);
    } else {
      navigate('/admin', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + título */}
        <div className="text-center mb-8">
          <img
            src="/logo-novo-consudes-removebg-preview-1.png"
            alt="CONSUDES"
            className="h-16 w-auto mx-auto mb-4"
          />
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#0057A8]/60 font-['Inter']">
            Área Administrativa
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-xl font-['Cormorant_Garamond'] font-semibold text-[#1F2937] mb-6">
            Acesso restrito
          </h1>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1F2937] mb-1.5"
              >
                E-mail
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1F2937] mb-1.5"
              >
                Senha
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
              className="w-full py-3 rounded-lg bg-[#D9A441] text-[#1F2937] text-sm font-semibold tracking-wide hover:bg-[#c8942e] active:bg-[#b88326] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          CONSUDES &middot; Acesso interno
        </p>
      </div>
    </div>
  );
}
