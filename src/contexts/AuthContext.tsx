"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback, useRef, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js";
import type { User, UserRole } from "@/types";
import { toast } from "sonner";

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
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create supabase client outside component to ensure stable reference
let supabaseInstance: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Stable supabase reference
  const supabase = useMemo(() => getSupabase(), []);

  // Track initialization state and current user ID
  const initializedRef = useRef(false);
  const userIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    console.log("[AUTH] fetchUserProfile called for user:", supabaseUser.id);

    // Create fallback user from metadata
    const fallbackUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      full_name: supabaseUser.user_metadata?.full_name || null,
      role: (supabaseUser.user_metadata?.role as UserRole) || "parent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      establishment_id: supabaseUser.user_metadata?.establishment_id || null,
      phone: supabaseUser.user_metadata?.phone || null,
      phone_verified: false,
      avatar_url: null,
    };

    try {
      console.log("[AUTH] Fetching user profile from database...");

      // Add timeout to prevent infinite hang
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Profile fetch timeout")), 5000)
      );

      const fetchPromise = supabase
        .from("users")
        .select(`
          *,
          establishment:establishments(*)
        `)
        .eq("id", supabaseUser.id)
        .single();

      const result = await Promise.race([fetchPromise, timeoutPromise]);

      if (!result) {
        console.warn("[AUTH] Profile fetch timed out, using fallback");
        return fallbackUser;
      }

      const { data, error } = result;

      if (error) {
        console.error("[AUTH] Error fetching user profile:", error);
        console.log("[AUTH] Returning fallback user data");
        return fallbackUser;
      }

      console.log("[AUTH] User profile fetched successfully:", data);
      return data as User;
    } catch (err) {
      console.error("[AUTH] Unexpected error fetching profile:", err);
      console.log("[AUTH] Returning fallback user data due to exception");
      return fallbackUser;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    const profile = await fetchUserProfile(session.user);
    setUser(profile);
  }, [session, fetchUserProfile]);

  useEffect(() => {
    console.log("[AUTH] useEffect triggered, initializedRef:", initializedRef.current);

    // Prevent re-initialization using ref (survives re-renders)
    if (initializedRef.current) {
      console.log("[AUTH] Already initialized, skipping");
      return;
    }
    initializedRef.current = true;
    console.log("[AUTH] Starting initialization...");

    let mounted = true;

    const initializeAuth = async () => {
      console.log("[AUTH] initializeAuth called");
      try {
        console.log("[AUTH] Calling supabase.auth.getSession()...");
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        console.log("[AUTH] getSession result - session:", initialSession ? "exists" : "null", "error:", error);

        if (error) {
          console.error("[AUTH] Error getting session:", error);
          if (mounted) {
            console.log("[AUTH] Setting loading to false (error path)");
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          console.log("[AUTH] Setting session:", initialSession ? initialSession.user?.email : "null");
          setSession(initialSession);
          if (initialSession?.user) {
            console.log("[AUTH] Session has user, fetching profile...");
            const profile = await fetchUserProfile(initialSession.user);
            if (mounted) {
              console.log("[AUTH] Setting user profile:", profile?.email);
              setUser(profile);
            }
          } else {
            console.log("[AUTH] No user in session");
          }
          console.log("[AUTH] Setting loading to false (success path)");
          setLoading(false);
        }
      } catch (error) {
        console.error("[AUTH] Auth initialization error:", error);
        if (mounted) {
          console.log("[AUTH] Setting loading to false (catch path)");
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    console.log("[AUTH] Setting up onAuthStateChange listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        console.log("[AUTH] onAuthStateChange fired - event:", event, "mounted:", mounted);
        if (!mounted) {
          console.log("[AUTH] Component unmounted, ignoring event");
          return;
        }

        // Skip INITIAL_SESSION as we handle it above
        if (event === 'INITIAL_SESSION') {
          console.log("[AUTH] Skipping INITIAL_SESSION event");
          return;
        }

        console.log("[AUTH] Processing auth state change:", event);
        setSession(newSession);

        if (newSession?.user) {
          console.log("[AUTH] New session has user:", newSession.user.email);
          // Only fetch profile if user changed or on sign in
          if (event === 'SIGNED_IN' || userIdRef.current !== newSession.user.id) {
            console.log("[AUTH] Fetching profile for new/changed user");
            const profile = await fetchUserProfile(newSession.user);
            if (mounted) setUser(profile);
          } else {
            console.log("[AUTH] User unchanged, skipping profile fetch");
          }
        } else {
          console.log("[AUTH] No user in new session, clearing user");
          setUser(null);
        }

        console.log("[AUTH] Setting loading to false (auth state change)");
        setLoading(false);
      }
    );

    return () => {
      console.log("[AUTH] Cleanup - unmounting");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  }, [supabase]);

  const signUp = useCallback(async (email: string, password: string, metadata?: Record<string, unknown>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error ? (error as Error) : null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  }, [supabase]);

  const signInWithOAuth = useCallback(async (provider: "google" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error ? (error as Error) : null };
  }, [supabase]);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: error ? (error as Error) : null };
  }, [supabase]);

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error: error ? (error as Error) : null };
  }, [supabase]);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
    refreshProfile,
  }), [user, session, loading, signIn, signUp, signOut, signInWithOAuth, resetPassword, updatePassword, hasRole, isAdmin, isSuperAdmin, refreshProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
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
