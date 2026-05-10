import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  profileLoading: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

// ─── Mock para testes E2E (VITE_USE_MOCK_AUTH=true) ─────────────────────────
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const MOCK_USER = {
  id: 'mock-user-id',
  email: 'usuario@consudes.org.br',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
} as unknown as User;

const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  full_name: 'Usuário Teste',
  email: 'usuario@consudes.org.br',
  block: 'A',
  apartment: '101',
  role: 'resident',
  status: 'approved',
  created_at: '2026-01-01T00:00:00Z',
};
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(USE_MOCK ? MOCK_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [profile, setProfile] = useState<Profile | null>(USE_MOCK ? MOCK_PROFILE : null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (USE_MOCK) return; // não chama Supabase em modo mock

    // Listen for auth changes — includes INITIAL_SESSION on mount
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'INITIAL_SESSION') {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load profile whenever user changes
  useEffect(() => {
    // Tabela profiles não existe neste projeto — skip silencioso
    setProfile(null);
    setProfileLoading(false);
  }, [user]);

  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, profileLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
