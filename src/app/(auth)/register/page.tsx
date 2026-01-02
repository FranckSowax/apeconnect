"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useEstablishment } from "@/contexts/EstablishmentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Phone, Building, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    establishmentId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const { signUp, signInWithOAuth } = useAuth();
  const { establishments, loading: establishmentsLoading } = useEstablishment();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }

    if (!formData.establishmentId) {
      toast.error("Veuillez selectionner un etablissement");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        establishment_id: formData.establishmentId,
        role: "parent", // Default role
      });

      if (error) {
        toast.error("Erreur lors de l'inscription", {
          description: error.message,
        });
      } else {
        toast.success("Inscription reussie!", {
          description: "Verifiez votre email pour confirmer votre compte.",
        });
        router.push("/login");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setIsOAuthLoading(provider);
    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        toast.error("Erreur de connexion", {
          description: error.message,
        });
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsOAuthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3E7] p-4 bg-[radial-gradient(#E6E1D6_1px,transparent_1px)] [background-size:20px_20px]">
      <Card className="w-full max-w-md border-border/50 shadow-lg bg-white/80 backdrop-blur-sm my-8">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-accent-green flex items-center justify-center mb-6 shadow-sm">
            <span className="text-primary font-bold text-2xl font-hagrid">A</span>
          </div>
          <CardTitle className="text-3xl font-hagrid font-bold">Créer un compte</CardTitle>
          <CardDescription className="text-base">
            Rejoignez la communauté APE+ Connect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="rounded-full h-12 border-border/50 hover:bg-white hover:text-foreground hover:border-accent-blue/50 transition-all"
              onClick={() => handleOAuth("google")}
              disabled={isOAuthLoading !== null}
            >
              {isOAuthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="rounded-full h-12 border-border/50 hover:bg-white hover:text-foreground hover:border-accent-pink/50 transition-all"
              onClick={() => handleOAuth("apple")}
              disabled={isOAuthLoading !== null}
            >
              {isOAuthLoading === "apple" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
              )}
              Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-medium">
                Ou continuez avec email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="establishmentId">Etablissement</Label>
              <Select
                value={formData.establishmentId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, establishmentId: value }))
                }
                disabled={establishmentsLoading}
              >
                <SelectTrigger className="h-12 rounded-2xl bg-secondary/10 border-transparent focus:bg-white transition-colors">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Selectionnez votre etablissement" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {establishments.map((establishment) => (
                    <SelectItem key={establishment.id} value={establishment.id}>
                      {establishment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telephone (WhatsApp)</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+237 6XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 pr-12 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-12 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              S&apos;inscrire
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            En vous inscrivant, vous acceptez nos{" "}
            <Link href="/terms" className="text-primary hover:underline font-medium">
              conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="text-primary hover:underline font-medium">
              politique de confidentialite
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <p className="text-sm text-muted-foreground">
            Deja un compte?{" "}
            <Link href="/login" className="text-accent-green font-bold hover:underline">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
