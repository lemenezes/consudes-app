import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Profile } from "../types";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  profileLoading: false,
  refreshProfile: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfileByUserId = async (
    userId: string
  ): Promise<{ data: Profile | null; error: string | null }> => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profileData) {
      return { data: null, error: error?.message ?? "Perfil não encontrado" };
    }

    return {
      data: {
        ...(profileData as Omit<Profile, "must_change_password">),
        must_change_password: Boolean(
          (profileData as { must_change_password?: boolean })
            .must_change_password
        )
      },
      error: null
    };
  };

  useEffect(() => {
    // Listen for auth changes — includes INITIAL_SESSION on mount
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === "INITIAL_SESSION") {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async (): Promise<{ error: string | null }> => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return { error: null };
    }

    setProfileLoading(true);
    const { data, error } = await fetchProfileByUserId(user.id);
    setProfile(data);
    setProfileLoading(false);

    return { error };
  };

  // Load profile whenever user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    void refreshProfile();
  }, [user]);

  // Novo signUp para aceitar display_name
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });
    if (error || !data?.user)
      return { error: error?.message ?? "Erro ao cadastrar" };
    return { error: null };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profile,
        profileLoading,
        refreshProfile,
        signUp,
        signIn,
        signOut
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
