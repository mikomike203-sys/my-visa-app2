import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabase";
import { signIn, signUp, signInWithGoogle, signOut, getProfile, updateProfile } from "./auth";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    let p = await getProfile(user.id);
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    if (p && avatar && p.avatar_url !== avatar) {
      p = await updateProfile(user.id, { avatar_url: avatar });
    }
    setProfile(p);
  }, [user]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
        getProfile(user.id)
          .then(async (p) => (p && avatar && p.avatar_url !== avatar ? updateProfile(user.id, { avatar_url: avatar }) : p))
          .then(setProfile)
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        getProfile(session.user.id)
          .then(async (p) => (p && avatar && p.avatar_url !== avatar ? updateProfile(session.user.id, { avatar_url: avatar }) : p))
          .then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await signIn(email, password);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    await signUp(email, password, fullName);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, loginWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
