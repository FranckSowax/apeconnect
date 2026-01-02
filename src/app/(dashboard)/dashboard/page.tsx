"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(["censeur", "admin", "super_admin"]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-primary text-primary-foreground rounded-[24px] p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-hagrid font-bold mb-2">
            Bonjour, {user?.full_name?.split(" ")[0] || "Parent"} ! 👋
          </h1>
          <p className="text-primary-foreground/80 max-w-xl">
            Bienvenue sur votre espace APE+. Gérez la vie scolaire de vos enfants et accédez au marketplace en un clic.
          </p>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 bg-accent-yellow/10 transform skew-x-12 translate-x-12" />
        <div className="relative z-10 flex gap-3">
          <Button variant="secondary" className="rounded-full font-bold bg-white text-primary hover:bg-white/90">
            <Sparkles className="mr-2 h-4 w-4 text-accent-yellow" />
            Nouveautés
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-hagrid font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-8 rounded-full bg-accent-blue" />
          Accès Rapide
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/connect/new" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-12 w-12 rounded-full bg-accent-green/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-accent-green" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold mb-1">Signaler une absence</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Déclarez une absence en quelques secondes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-12 w-12 rounded-full bg-accent-yellow/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-accent-yellow" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold mb-1">Marketplace</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Achetez ou vendez des manuels scolaires
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop/new" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-12 w-12 rounded-full bg-accent-pink/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6 text-accent-pink" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold mb-1">Publier une annonce</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mettez en vente vos livres inutilisés
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/connect/history" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="h-12 w-12 rounded-full bg-accent-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-accent-blue" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-bold mb-1">Historique</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Consultez vos demandes passées
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats for Admin */}
      {isAdmin && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absences en attente
              </CardTitle>
              <Clock className="h-4 w-4 text-accent-yellow" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-hagrid font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-accent-green" />
                +2 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Absences approuvées
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent-green" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-hagrid font-bold">156</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Annonces actives
              </CardTitle>
              <BookOpen className="h-4 w-4 text-accent-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-hagrid font-bold">48</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-accent-green" />
                +5 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Messages WhatsApp
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-hagrid font-bold">324</div>
              <p className="text-xs text-muted-foreground mt-1">Aujourd&apos;hui</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Absences */}
        <Card className="border-border/50 bg-white overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-hagrid text-xl">Absences récentes</CardTitle>
              <Button variant="ghost" className="text-sm text-accent-blue hover:text-accent-blue/80 rounded-full" asChild>
                <Link href="/connect/history">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { date: "15 Jan", status: "approved", student: "Marie Dupont", reason: "Maladie" },
                { date: "12 Jan", status: "pending", student: "Pierre Dupont", reason: "Rendez-vous" },
                { date: "08 Jan", status: "rejected", student: "Marie Dupont", reason: "Non justifié" },
              ].map((absence, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      absence.student === "Marie Dupont" ? "bg-accent-pink/20 text-accent-pink" : "bg-accent-blue/20 text-accent-blue"
                    }`}>
                      {absence.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{absence.student}</p>
                      <p className="text-xs text-muted-foreground">{absence.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-medium">{absence.date}</span>
                    <Badge
                      variant="secondary"
                      className={`border-0 ${
                        absence.status === "approved"
                          ? "bg-accent-green/20 text-green-700"
                          : absence.status === "pending"
                          ? "bg-accent-yellow/20 text-yellow-700"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {absence.status === "approved"
                        ? "Approuvée"
                        : absence.status === "pending"
                        ? "En attente"
                        : "Refusée"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Ads */}
        <Card className="border-border/50 bg-white overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-hagrid text-xl">Mes annonces</CardTitle>
              <Button variant="ghost" className="text-sm text-accent-yellow hover:text-accent-yellow/80 rounded-full" asChild>
                <Link href="/shop/my-ads">Gérer</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { title: "Mathématiques 3ème", price: 5000, status: "published", views: 24 },
                { title: "Français 4ème", price: 3500, status: "pending_review", views: 0 },
                { title: "Physique Terminale", price: 7000, status: "draft", views: 0 },
              ].map((ad, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-sm truncate max-w-[150px]">{ad.title}</p>
                      <p className="text-xs text-muted-foreground font-bold text-primary">
                        {ad.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {ad.views > 0 && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {ad.views} vues
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={`border-0 ${
                        ad.status === "published"
                          ? "bg-accent-blue/20 text-blue-700"
                          : ad.status === "pending_review"
                          ? "bg-accent-yellow/20 text-yellow-700"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {ad.status === "published"
                        ? "En ligne"
                        : ad.status === "pending_review"
                        ? "En révision"
                        : "Brouillon"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

