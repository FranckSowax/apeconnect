"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: "google" | "apple") => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Auth loading timed out, forcing loading to false");
        setLoading(false);
      }
    }, 5000); // 5 seconds timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          if (mounted) setLoading(false);
          return;
        }

        console.log("Session retrieved:", session ? "Found" : "Null", session?.user?.id);
        if (mounted) setSession(session);

        if (session?.user) {
          await ensureUserProfile(session.user);
        }
      } catch (err) {
        console.error("Error in getInitialSession:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state change:", event, session?.user?.id);
        if (!mounted) return;
        
        try {
          setSession(session);

          if (session?.user) {
            await ensureUserProfile(session.user);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Error in onAuthStateChange:", err);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (supabaseUser: SupabaseUser, retryCount = 0) => {
    if (!supabaseUser) return;

    try {
      console.log(`Fetching user profile for ${supabaseUser.id} (Attempt ${retryCount + 1})`);
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          establishment:establishments(*)
        `)
        .eq("id", supabaseUser.id)
        .single();

      if (error || !data) {
        console.warn("User profile not found or error:", error);
        
        // Self-healing: Attempt to create the user profile if it doesn't exist
        // This handles cases where the database trigger failed
        if (retryCount < 2) {
          console.log("Attempting self-healing: creating user profile...");
          const metadata = supabaseUser.user_metadata || {};
          
          const newProfile: Partial<User> = {
            id: supabaseUser.id,
            email: supabaseUser.email || "",
            full_name: metadata.full_name || "",
            phone: metadata.phone || "",
            establishment_id: metadata.establishment_id || null,
            role: (metadata.role as UserRole) || "parent",
            updated_at: new Date().toISOString(),
          };

          const { error: insertError } = await supabase
            .from("users")
            .upsert(newProfile)
            .select()
            .single();

          if (insertError) {
            console.error("Self-healing failed:", insertError);
            // Fallback to minimal user object if database write fails
            setFallbackUser(supabaseUser);
          } else {
            console.log("Self-healing successful! Retrying fetch...");
            // Add a small delay before retrying to allow DB to settle
            setTimeout(() => ensureUserProfile(supabaseUser, retryCount + 1), 500);
            return;
          }
        } else {
          console.error("Max retries reached. Using fallback user.");
          setFallbackUser(supabaseUser);
        }
        return;
      }

      console.log("User profile loaded successfully:", data.id);
      setUser(data as User);
    } catch (err) {
      console.error("Error in ensureUserProfile:", err);
      setFallbackUser(supabaseUser);
    }
  };

  const setFallbackUser = (supabaseUser: SupabaseUser) => {
    const fallbackUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      full_name: supabaseUser.user_metadata?.full_name || null,
      avatar_url: null,
      phone: supabaseUser.user_metadata?.phone || null,
      phone_verified: false,
      role: (supabaseUser.user_metadata?.role as UserRole) || "parent",
      establishment_id: supabaseUser.user_metadata?.establishment_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(fallbackUser);
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
    }

    // If login successful, immediately ensure user profile
    if (!error && data.session?.user) {
      console.log("Sign in successful, ensuring profile...");
      await ensureUserProfile(data.session.user);
      setSession(data.session);
    }

    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, unknown>
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signInWithOAuth = async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithOAuth,
        resetPassword,
        updatePassword,
        hasRole,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
