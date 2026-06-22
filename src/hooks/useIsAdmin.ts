import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const ADMIN_ROLES = [
  "super_admin",
  "presidente",
  "secretaria",
  "diretor_esportes",
  "financeiro",
  "editor"
] as const;

type KnownRole = (typeof ADMIN_ROLES)[number] | "user";

async function fetchUserRole(userId: string): Promise<KnownRole> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error || !data) return "user";
  return (data.role as KnownRole) ?? "user";
}

/**
 * Returns whether the currently logged-in user has the 'admin' role.
 * Returns `null` while loading.
 */
export function useIsAdmin(): boolean | null {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }

    fetchUserRole(user.id).then(role =>
      setIsAdmin(ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]))
    );
  }, [user, authLoading]);

  return isAdmin;
}
