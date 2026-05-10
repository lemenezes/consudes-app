import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

async function fetchUserRole(userId: string): Promise<'admin' | 'user'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  if (error || !data) return 'user';
  return (data.role as 'admin' | 'user') ?? 'user';
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
    if (!user) { setIsAdmin(false); return; }

    fetchUserRole(user.id).then((role) => setIsAdmin(role === 'admin'));
  }, [user, authLoading]);

  return isAdmin;
}
