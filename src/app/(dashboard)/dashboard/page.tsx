"use client";

export const dynamic = "force-dynamic";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(["censeur", "admin", "super_admin"]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Bonjour, {user?.full_name?.split(" ")[0] || "Utilisateur"}!
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur APE Connect. Voici un apercu de votre activite.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/connect/new">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Signaler une absence
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Declarez une absence pour votre enfant
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/shop">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Parcourir le Shop
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Trouvez des manuels scolaires
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/shop/new">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Publier une annonce
              </CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Vendez vos manuels scolaires
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/connect/history">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Historique
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Consultez vos absences passees
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Stats for Admin */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Absences en attente
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Absences approuvees
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Annonces actives
              </CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +5 cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Messages WhatsApp
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">
                Aujourd&apos;hui
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Absences */}
        <Card>
          <CardHeader>
            <CardTitle>Absences recentes</CardTitle>
            <CardDescription>
              Vos dernieres demandes d&apos;absence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "15/01/2024", status: "approved", student: "Marie Dupont" },
                { date: "12/01/2024", status: "pending", student: "Pierre Dupont" },
                { date: "08/01/2024", status: "rejected", student: "Marie Dupont" },
              ].map((absence, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{absence.student}</p>
                    <p className="text-xs text-muted-foreground">{absence.date}</p>
                  </div>
                  <Badge
                    variant={
                      absence.status === "approved"
                        ? "default"
                        : absence.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {absence.status === "approved"
                      ? "Approuvee"
                      : absence.status === "pending"
                      ? "En attente"
                      : "Refusee"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <Link href="/connect/history">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* My Ads */}
        <Card>
          <CardHeader>
            <CardTitle>Mes annonces</CardTitle>
            <CardDescription>
              Vos annonces de manuels scolaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Mathematiques 3eme", price: 5000, status: "published" },
                { title: "Francais 4eme", price: 3500, status: "pending_review" },
                { title: "Physique Terminale", price: 7000, status: "draft" },
              ].map((ad, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{ad.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ad.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <Badge
                    variant={
                      ad.status === "published"
                        ? "default"
                        : ad.status === "pending_review"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {ad.status === "published"
                      ? "Publiee"
                      : ad.status === "pending_review"
                      ? "En revision"
                      : "Brouillon"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" asChild>
              <Link href="/shop/my-ads">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
