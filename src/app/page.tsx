"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Users, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl">APE Connect</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Se connecter</Button>
          </Link>
          <Link href="/register">
            <Button>S&apos;inscrire</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simplifiez la communication Parents-Ecole
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Une plateforme unique pour signaler les absences, valider les justificatifs
            et acheter ou vendre des manuels scolaires via WhatsApp.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <Users className="h-5 w-5" />
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Module Connect</CardTitle>
              <CardDescription>
                Signalez les absences via l&apos;application ou WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Formulaire web intuitif</li>
                <li>Bot WhatsApp intelligent</li>
                <li>Upload de justificatifs</li>
                <li>Notifications instantanees</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Module Shop</CardTitle>
              <CardDescription>
                Marketplace de manuels scolaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Publiez vos annonces</li>
                <li>Recherche par matiere/niveau</li>
                <li>Contact direct via WhatsApp</li>
                <li>Moderation automatique IA</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Securise</CardTitle>
              <CardDescription>
                Protection des donnees et confidentialite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Authentification securisee</li>
                <li>Donnees chiffrees</li>
                <li>Conforme RGPD</li>
                <li>Acces par role</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Multi-roles</CardTitle>
              <CardDescription>
                Adapte a chaque utilisateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Parents</li>
                <li>Enseignants</li>
                <li>Vie Scolaire / Censeur</li>
                <li>Administration</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-card rounded-2xl border">
          <h2 className="text-3xl font-bold mb-4">Pret a moderniser votre etablissement?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les etablissements qui ont deja adopte APE Connect pour
            une communication plus fluide et efficace.
          </p>
          <Link href="/register">
            <Button size="lg">Creer un compte</Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t mt-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">A</span>
            </div>
            <span className="font-semibold">APE Connect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2024 APE Connect. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}
