import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// Admin emails always get full access regardless of purchase
const ADMIN_EMAILS = ['jack@parrishaviation.com', 'titiusmclaughlin@gmail.com'];

async function fetchPurchaseTier(userId, userEmail) {
  if (!userId) return 'free';
  // Admins bypass paywall
  if (ADMIN_EMAILS.includes(userEmail)) return 'cfi_mentorship';
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('plan, cfi_access_expires_at')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error || !data?.length) return 'free';

    // Prefer highest tier
    if (data.some(p => {
      if (p.plan !== 'cfi_mentorship') return false;
      if (!p.cfi_access_expires_at) return true;
      return new Date(p.cfi_access_expires_at) > new Date();
    })) return 'cfi_mentorship';

    if (data.some(p => p.plan === 'full_access')) return 'full_access';

    return 'free';
  } catch {
    return 'free';
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [user, setUser] = useState(null);
  // 'free' | 'full_access' | 'cfi_mentorship'
  const [purchaseTier, setPurchaseTier] = useState('free');
  const [tierLoading, setTierLoading] = useState(false);

  const refreshTier = useCallback(async (u) => {
    if (!u) { setPurchaseTier('free'); return; }
    setTierLoading(true);
    const tier = await fetchPurchaseTier(u.id, u.email);
    setPurchaseTier(tier);
    setTierLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      refreshTier(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      refreshTier(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [refreshTier]);

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username: email.split('@')[0] } },
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // hasPaid = true for full_access or cfi_mentorship
  const hasPaid = purchaseTier === 'full_access' || purchaseTier === 'cfi_mentorship';

  return (
    <AuthContext.Provider value={{
      session, user,
      purchaseTier, hasPaid, tierLoading, refreshTier,
      signUp, signIn, signOut,
      loading: session === undefined,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
