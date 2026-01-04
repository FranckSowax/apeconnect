"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Debug logs
  console.log("[DASHBOARD] Render - loading:", loading, "user:", user?.email || "null");

  useEffect(() => {
    console.log("[DASHBOARD] useEffect - loading:", loading, "user:", user?.email || "null");
    if (!loading && !user) {
      console.log("[DASHBOARD] No user and not loading, redirecting to login");
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    console.log("[DASHBOARD] Showing spinner because loading is true");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("[DASHBOARD] No user, returning null (waiting for redirect)");
    return null;
  }

  console.log("[DASHBOARD] Rendering dashboard for user:", user.email);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 relative">
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
