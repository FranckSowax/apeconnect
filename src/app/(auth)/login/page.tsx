"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
  const { signIn, signInWithOAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("Erreur de connexion", {
          description: error.message || "Email ou mot de passe incorrect",
        });
      } else {
        toast.success("Connexion reussie");
        router.push(redirect);
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
    <Card className="w-full max-w-md border-border/50 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-accent-yellow flex items-center justify-center mb-6 shadow-sm">
          <span className="text-primary font-bold text-2xl font-hagrid">A</span>
        </div>
        <CardTitle className="text-3xl font-hagrid font-bold">Connexion</CardTitle>
        <CardDescription className="text-base">
          Connectez-vous à votre compte APE+
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
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-accent-blue hover:underline font-medium"
              >
                Oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-secondary/10 border-transparent focus:bg-white transition-colors"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Se connecter
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-8">
        <p className="text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-accent-blue font-bold hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md border-border/50 shadow-lg bg-white/80">
      <CardHeader className="space-y-1 text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full mb-6" />
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F3E7] p-4 bg-[radial-gradient(#E6E1D6_1px,transparent_1px)] [background-size:20px_20px]">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
