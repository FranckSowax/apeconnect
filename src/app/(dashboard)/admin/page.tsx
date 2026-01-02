"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  pendingAbsences: number;
  approvedAbsences: number;
  rejectedAbsences: number;
  pendingAds: number;
  publishedAds: number;
  totalUsers: number;
  messageVolume: number;
}

export default function AdminDashboardPage() {
  const { user, hasRole } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasRole(["censeur", "admin", "super_admin"])) {
      router.push("/dashboard");
      return;
    }

    const fetchStats = async () => {
      // In a real app, these would be aggregated queries or API calls
      // For now, we'll use mock data
      setStats({
        pendingAbsences: 12,
        approvedAbsences: 156,
        rejectedAbsences: 8,
        pendingAds: 5,
        publishedAds: 48,
        totalUsers: 234,
        messageVolume: 324,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, [hasRole, router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 rounded-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-accent-pink/20 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-accent-pink" />
        </div>
        <div>
          <h1 className="text-3xl font-hagrid font-bold text-foreground">Administration</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble et gestion de l'établissement
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-white hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absences en attente
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-accent-yellow/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-accent-yellow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-hagrid font-bold">{stats?.pendingAbsences}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              À traiter aujourd&apos;hui
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-white hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annonces en attente
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-accent-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-hagrid font-bold">{stats?.pendingAds}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              À modérer
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-white hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-accent-green/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-accent-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-hagrid font-bold">{stats?.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Inscrits sur la plateforme
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-white hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages WhatsApp
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-hagrid font-bold">{stats?.messageVolume}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Aujourd&apos;hui
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/absences" className="group">
          <Card className="h-full border-border/50 bg-white hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-hagrid text-lg">
                <Clock className="h-5 w-5 text-accent-yellow" />
                Gestion Absences
              </CardTitle>
              <CardDescription>
                {stats?.pendingAbsences} demande(s) en attente de validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-full bg-accent-yellow text-primary hover:bg-accent-yellow/90 font-bold group-hover:shadow-md transition-all">
                Gérer les absences
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ads" className="group">
          <Card className="h-full border-border/50 bg-white hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-hagrid text-lg">
                <BookOpen className="h-5 w-5 text-accent-blue" />
                Modération Shop
              </CardTitle>
              <CardDescription>
                {stats?.pendingAds} annonce(s) à vérifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full rounded-full bg-accent-blue text-primary hover:bg-accent-blue/90 font-bold group-hover:shadow-md transition-all">
                Modérer les annonces
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/stats" className="group">
          <Card className="h-full border-border/50 bg-white hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-hagrid text-lg">
                <TrendingUp className="h-5 w-5 text-accent-green" />
                Statistiques
              </CardTitle>
              <CardDescription>
                Analyse détaillée de l'activité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-full border-2 group-hover:bg-accent-green/10 group-hover:text-accent-green group-hover:border-accent-green transition-all font-bold">
                Voir le rapport
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Activity Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-white">
          <CardHeader>
            <CardTitle className="font-hagrid text-xl">Résumé des absences</CardTitle>
            <CardDescription>Performance du mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-green shadow-[0_0_8px_rgba(154,171,101,0.5)]" />
                  <span className="font-medium">Approuvées</span>
                </div>
                <span className="font-bold font-hagrid text-lg">{stats?.approvedAbsences}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-yellow shadow-[0_0_8px_rgba(247,214,110,0.5)]" />
                  <span className="font-medium">En attente</span>
                </div>
                <span className="font-bold font-hagrid text-lg">{stats?.pendingAbsences}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="font-medium">Refusées</span>
                </div>
                <span className="font-bold font-hagrid text-lg">{stats?.rejectedAbsences}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-white">
          <CardHeader>
            <CardTitle className="font-hagrid text-xl">Résumé du Shop</CardTitle>
            <CardDescription>État du marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-green shadow-[0_0_8px_rgba(154,171,101,0.5)]" />
                  <span className="font-medium">Publiées</span>
                </div>
                <span className="font-bold font-hagrid text-lg">{stats?.publishedAds}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-accent-yellow shadow-[0_0_8px_rgba(247,214,110,0.5)]" />
                  <span className="font-medium">En révision</span>
                </div>
                <span className="font-bold font-hagrid text-lg">{stats?.pendingAds}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
