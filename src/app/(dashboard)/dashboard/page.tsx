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
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 bg-[#2D5016] text-white rounded-xl sm:rounded-2xl md:rounded-[24px] p-4 sm:p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
            Bonjour, {user?.full_name?.split(" ")[0] || "Parent"} !
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            Bienvenue sur votre espace APE Connect. Gérez la vie scolaire de vos enfants et accédez au marketplace.
          </p>
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full w-1/3 bg-white/10 transform skew-x-12 translate-x-12" />
        <div className="relative z-10 flex flex-wrap gap-2 sm:gap-3">
          <Button variant="secondary" className="rounded-full font-bold bg-white text-[#2D5016] hover:bg-white/90 h-9 sm:h-10 px-3 sm:px-4 text-sm">
            <Sparkles className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F7D66E]" />
            Nouveautés
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
          <span className="w-1.5 sm:w-2 h-6 sm:h-8 rounded-full bg-[#2D5016]" />
          Accès Rapide
        </h2>
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/connect/new" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#2D5016]" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 group-hover:text-[#2D5016] transition-colors" />
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                <CardTitle className="text-base sm:text-lg font-bold mb-1">Signaler une absence</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Déclarez une absence en quelques secondes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#F7D66E]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#F7D66E]" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 group-hover:text-[#2D5016] transition-colors" />
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                <CardTitle className="text-base sm:text-lg font-bold mb-1">Marketplace</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Achetez ou vendez des manuels scolaires
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop/new" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#FFB2DD]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFB2DD]" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 group-hover:text-[#2D5016] transition-colors" />
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                <CardTitle className="text-base sm:text-lg font-bold mb-1">Publier une annonce</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Mettez en vente vos livres inutilisés
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/connect/history" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 bg-white group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#B6CAEB]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#B6CAEB]" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 group-hover:text-[#2D5016] transition-colors" />
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                <CardTitle className="text-base sm:text-lg font-bold mb-1">Historique</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Consultez vos demandes passées
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats for Admin */}
      {isAdmin && (
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Absences en attente
              </CardTitle>
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#F7D66E]" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold">12</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-[#2D5016]" />
                +2 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Absences approuvées
              </CardTitle>
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2D5016]" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold">156</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Annonces actives
              </CardTitle>
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#B6CAEB]" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold">48</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-[#2D5016]" />
                +5 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Messages WhatsApp
              </CardTitle>
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2D5016]" />
            </CardHeader>
            <CardContent className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0">
              <div className="text-2xl sm:text-3xl font-bold">324</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Aujourd&apos;hui</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-2">
        {/* Recent Absences */}
        <Card className="border-border/50 bg-white overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold">Absences récentes</CardTitle>
              <Button variant="ghost" className="text-xs sm:text-sm text-[#2D5016] hover:text-[#2D5016]/80 rounded-full h-8 sm:h-9 px-2 sm:px-3" asChild>
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
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/10 transition-colors gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                      absence.student === "Marie Dupont" ? "bg-[#FFB2DD]/20 text-[#E91E8C]" : "bg-[#B6CAEB]/20 text-[#2D5016]"
                    }`}>
                      {absence.student.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm truncate">{absence.student}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{absence.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium hidden sm:block">{absence.date}</span>
                    <Badge
                      variant="secondary"
                      className={`border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 ${
                        absence.status === "approved"
                          ? "bg-[#2D5016]/10 text-[#2D5016]"
                          : absence.status === "pending"
                          ? "bg-[#F7D66E]/20 text-[#B8860B]"
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
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg sm:text-xl font-bold">Mes annonces</CardTitle>
              <Button variant="ghost" className="text-xs sm:text-sm text-[#2D5016] hover:text-[#2D5016]/80 rounded-full h-8 sm:h-9 px-2 sm:px-3" asChild>
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
                <div key={i} className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/10 transition-colors gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs sm:text-sm truncate">{ad.title}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-bold text-[#2D5016]">
                        {ad.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {ad.views > 0 && (
                      <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 hidden sm:flex">
                        <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> {ad.views}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className={`border-0 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 ${
                        ad.status === "published"
                          ? "bg-[#B6CAEB]/20 text-[#2D5016]"
                          : ad.status === "pending_review"
                          ? "bg-[#F7D66E]/20 text-[#B8860B]"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {ad.status === "published"
                        ? "En ligne"
                        : ad.status === "pending_review"
                        ? "Révision"
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
