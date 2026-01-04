"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bell,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Star,
  Menu,
  X,
  Smartphone,
  ShoppingBag,
  Wallet,
  Megaphone,
  BarChart3,
  Play,
  MessageSquareOff,
  EyeOff,
  Coins,
  UserPlus,
  School,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  const painPoints = [
    {
      icon: MessageSquareOff,
      title: "Absences non signalées",
      description: "Impossible de justifier rapidement une absence. Les papiers se perdent, les délais passent, et votre enfant est pénalisé.",
      color: "bg-red-50 text-red-500",
    },
    {
      icon: EyeOff,
      title: "Communication éclatée",
      description: "WhatsApp, SMS, carnets... Les informations de l'école arrivent de partout et se perdent facilement.",
      color: "bg-orange-50 text-orange-500",
    },
    {
      icon: Coins,
      title: "Mensualités opaques",
      description: "Difficile de suivre les paiements APE, les échéances et les reçus quand tout se fait en espèces.",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Vie Scolaire",
      description: "Déclarez les absences en ligne, suivez leur statut en temps réel et recevez une notification dès validation par l'établissement.",
      badge: "Essentiel",
    },
    {
      icon: Megaphone,
      title: "Discussions de Classe",
      description: "Un groupe de discussion par classe. Échangez avec les autres parents, recevez les annonces importantes des professeurs.",
      badge: "Nouveau",
    },
    {
      icon: ShoppingBag,
      title: "Boutique Solidaire",
      description: "Achetez, vendez ou donnez : manuels scolaires, uniformes, fournitures. Le marché exclusif entre parents de l'établissement.",
      badge: "Populaire",
    },
    {
      icon: Wallet,
      title: "Mensualités APE",
      description: "Visualisez vos échéances, payez en un clic via Mobile Money et recevez automatiquement vos reçus de paiement.",
      badge: null,
    },
    {
      icon: Calendar,
      title: "Agenda Scolaire",
      description: "Réunions parents-profs, contrôles, événements... Tout le calendrier de la classe synchronisé avec votre téléphone.",
      badge: null,
    },
    {
      icon: Bell,
      title: "Alertes WhatsApp",
      description: "Recevez les notifications urgentes directement sur WhatsApp : absences validées, annonces, rappels d'événements.",
      badge: null,
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: "Créez votre compte",
      description: "Inscrivez-vous gratuitement avec votre email. Ajoutez vos enfants et leur classe.",
    },
    {
      icon: School,
      title: "Rejoignez l'école",
      description: "Sélectionnez l'établissement de vos enfants. Accès automatique aux groupes de classe.",
    },
    {
      icon: Smartphone,
      title: "Gérez tout",
      description: "Absences, discussions, paiements : tout est centralisé dans une seule application.",
    },
  ];

  const testimonials = [
    {
      name: "Marie N.",
      role: "Maman de Lucas, 6ème A",
      content: "Mon fils était malade lundi. J'ai déclaré l'absence depuis l'app en 2 minutes, avec le certificat médical en photo. Validé le jour même par le censeur !",
      initials: "MN",
    },
    {
      name: "Jean-Paul M.",
      role: "Papa de 2 enfants",
      content: "Le groupe de discussion de la classe est super pratique. Plus besoin de chercher dans 50 groupes WhatsApp. Les annonces des profs sont bien visibles.",
      initials: "JP",
    },
    {
      name: "Elodie K.",
      role: "Trésorière APE",
      content: "La boutique entre parents, c'est génial ! J'ai vendu les anciens manuels de ma fille en 24h à un parent de la même classe. Tout le monde y gagne.",
      initials: "EK",
    },
  ];

  const faqs = [
    {
      question: "Comment déclarer une absence ?",
      answer: "Depuis votre tableau de bord, cliquez sur 'Vie Scolaire' puis 'Nouvelle absence'. Remplissez les dates, le motif et joignez un justificatif si nécessaire. L'établissement est notifié instantanément.",
    },
    {
      question: "Qui peut voir mes messages dans les discussions ?",
      answer: "Seuls les parents d'élèves de la même classe et les professeurs référents ont accès au groupe de discussion. Les messages sont modérés pour garantir un espace respectueux.",
    },
    {
      question: "Comment fonctionne la boutique ?",
      answer: "Publiez une annonce avec photo et prix. Les autres parents de l'établissement peuvent vous contacter directement. La transaction se fait entre vous, APE Connect ne prend aucune commission.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Oui. Nous utilisons Supabase avec chiffrement SSL et authentification sécurisée. Vos données ne sont jamais partagées avec des tiers.",
    },
    {
      question: "L'application est-elle gratuite ?",
      answer: "Oui, APE Connect est entièrement gratuit pour les parents. Aucun frais caché, aucun abonnement. Seules les mensualités APE de votre établissement restent à votre charge.",
    },
  ];

  const pricing = [
    {
      name: "Parents",
      price: "0",
      description: "Gratuit pour tous les parents",
      features: ["Déclaration d'absences illimitée", "Discussions de classe", "Accès à la boutique", "Notifications WhatsApp", "Suivi des mensualités"],
      cta: "Créer mon compte",
      popular: false,
    },
    {
      name: "Établissement",
      price: "Sur devis",
      description: "Pour les écoles et lycées",
      features: ["Dashboard administration", "Gestion multi-classes", "Validation des absences", "Annonces et communications", "Support prioritaire"],
      cta: "Nous contacter",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-zinc-600 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <School className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                APE+ <span className="text-emerald-600">Connect</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-500">
              <a href="#features" className="hover:text-emerald-600 transition-colors">Fonctionnalités</a>
              <a href="#testimonials" className="hover:text-emerald-600 transition-colors">Témoignages</a>
              <a href="#pricing" className="hover:text-emerald-600 transition-colors">Tarifs</a>
              <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Se connecter
              </Link>
              <Link href="/register">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
                  Espace Parents
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-zinc-100">
              <div className="flex flex-col space-y-1">
                <a href="#features" onClick={handleMobileNavClick} className="px-3 py-2 rounded-lg hover:bg-zinc-50 text-zinc-600 font-medium">Fonctionnalités</a>
                <a href="#testimonials" onClick={handleMobileNavClick} className="px-3 py-2 rounded-lg hover:bg-zinc-50 text-zinc-600 font-medium">Témoignages</a>
                <a href="#pricing" onClick={handleMobileNavClick} className="px-3 py-2 rounded-lg hover:bg-zinc-50 text-zinc-600 font-medium">Tarifs</a>
                <a href="#faq" onClick={handleMobileNavClick} className="px-3 py-2 rounded-lg hover:bg-zinc-50 text-zinc-600 font-medium">FAQ</a>
                <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-zinc-100">
                  <Link href="/login" onClick={handleMobileNavClick}>
                    <Button variant="outline" className="w-full">Se connecter</Button>
                  </Link>
                  <Link href="/register" onClick={handleMobileNavClick}>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Espace Parents</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-[#FAFAFA]">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl"></div>
          <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-amber-100/40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm mb-8 animate-fade-in">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-medium text-zinc-600">Application école-parents simplifiée</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
            Absences, discussions, paiements :
            <br />
            <span className="text-emerald-500">tout en une seule app.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Déclarez les absences de vos enfants, échangez avec les autres parents de la classe et gérez vos mensualités APE depuis votre téléphone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white rounded-full h-14 px-8 text-base font-semibold shadow-xl shadow-blue-800/20 group"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900 rounded-full h-14 px-8 text-base font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Découvrir APE+
              </Button>
            </a>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-5xl rounded-2xl md:rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-zinc-100">
              <Image
                src="https://images.unsplash.com/photo-1529390003868-6c01d73923f8?q=80&w=2574&auto=format&fit=crop"
                alt="Étudiants gabonais souriants"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs border-l-4 border-amber-500">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Cotisation réglée</p>
                      <p className="text-xs text-zinc-500">Reçu envoyé par SMS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
              Les galères des parents, on connaît
            </h2>
            <p className="text-zinc-500 text-lg">
              Entre les justificatifs à fournir, les messages éparpillés et les paiements en espèces, la vie scolaire peut vite devenir un casse-tête.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {painPoints.map((point, index) => (
              <Card key={index} className="bg-white border-zinc-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${point.color} rounded-xl flex items-center justify-center mb-6`}>
                    <point.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <div className="h-8 w-px bg-zinc-200 mb-4"></div>
              <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold tracking-wide uppercase">
                La Solution APE+
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
              Une app, trois modules essentiels
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Vie Scolaire, Discussions et Boutique : tout ce dont vous avez besoin pour suivre la scolarité de vos enfants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-zinc-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-zinc-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <feature.icon className="h-6 w-6 text-zinc-600 group-hover:text-emerald-600" />
                  </div>
                  {feature.badge && (
                    <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              Simple comme bonjour
            </h2>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white border-2 border-zinc-100 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                    <step.icon className="h-8 w-8 text-zinc-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500 px-4">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-6">
                <span className="text-xs font-semibold uppercase tracking-wide">Interface intuitive</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
                Conçue pour
                <br />
                votre quotidien.
              </h2>
              <p className="text-lg text-zinc-500 mb-8 leading-relaxed">
                L'interface d'APE+ Connect a été pensée pour être ultra-rapide et économe en données mobiles.
                Accédez à l'essentiel en un clin d'œil, où que vous soyez à Libreville ou en province.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <span className="text-zinc-600 text-sm">Compatible Android et iOS</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <span className="text-zinc-600 text-sm">Mode économie de données inclus</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <span className="text-zinc-600 text-sm">Support technique local disponible sur WhatsApp</span>
                </li>
              </ul>

              <Link href="/register" className="text-emerald-600 font-medium hover:text-emerald-700 inline-flex items-center gap-2">
                Voir la démo interactive
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative mx-auto border-zinc-800 bg-zinc-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden">
                <div className="h-[32px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-zinc-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-zinc-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-zinc-50 relative">
                  {/* Fake App UI */}
                  <div className="bg-white p-6 pt-12 pb-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-zinc-400">Bonjour,</p>
                        <h4 className="font-bold text-zinc-900">Jean-Pierre D.</h4>
                      </div>
                      <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold">JP</div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl p-4 text-white mb-4">
                      <p className="text-xs text-white/70 mb-1">Prochaine Mensualité</p>
                      <div className="flex justify-between items-end">
                        <span className="text-xl font-bold">1.000 FCFA</span>
                        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded">15 Fév</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <BarChart3 className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] text-zinc-500">Absences</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                          <Megaphone className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] text-zinc-500">Discussions</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] text-zinc-500">Boutique</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                          <Bell className="h-4 w-4" />
                        </div>
                        <span className="text-[9px] text-zinc-500">Alertes</span>
                      </div>
                    </div>
                  </div>
                  {/* Notifications list mock */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">ACTIVITÉ RÉCENTE</p>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 flex gap-3">
                      <div className="h-8 w-8 bg-green-50 rounded-full flex-shrink-0 flex items-center justify-center text-green-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">Absence validée</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Lucas - 15 déc. • Approuvée</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-zinc-100 flex gap-3">
                      <div className="h-8 w-8 bg-purple-50 rounded-full flex-shrink-0 flex items-center justify-center text-purple-500">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-800">Groupe 6ème A</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">3 nouveaux messages</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements behind phone */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/50 to-blue-100/50 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-zinc-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center text-zinc-900 mb-16">
            Approuvé par les parents
            <br />
            <span className="text-amber-500">comme vous</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-zinc-100 shadow-sm rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex gap-1 text-amber-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-600 text-base leading-relaxed mb-8 flex-grow">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-zinc-50 pt-6">
                    <div className="h-12 w-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{testimonial.name}</p>
                      <p className="text-sm text-zinc-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
              Tarification simple et transparente
            </h2>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Gratuit pour les parents, sur mesure pour les établissements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                className={`rounded-2xl overflow-hidden ${
                  plan.popular
                    ? "border-2 border-emerald-500 shadow-xl shadow-emerald-500/10"
                    : "border border-zinc-200"
                }`}
              >
                {plan.popular && (
                  <div className="bg-emerald-500 text-white text-center py-2 text-sm font-semibold">
                    Recommandé
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{plan.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-zinc-900">{plan.price}</span>
                    {plan.price !== "Sur devis" && <span className="text-zinc-500 ml-1">FCFA/mois</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-zinc-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.popular ? "#" : "/register"}>
                    <Button
                      className={`w-full rounded-full h-12 font-semibold ${
                        plan.popular
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-zinc-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-zinc-500">
              Tout ce que vous devez savoir sur APE+ Connect.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-zinc-100 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-zinc-900 hover:text-emerald-600 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-500 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Prêt à simplifier votre vie de parent ?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Créez votre compte gratuitement et accédez immédiatement aux fonctionnalités : déclaration d'absences, discussions de classe et boutique solidaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-zinc-100 rounded-full h-14 px-8 text-base font-semibold shadow-xl"
              >
                Créer un compte gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 rounded-full h-14 px-8 text-base font-semibold"
              >
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <School className="h-5 w-5" />
                </div>
                <span className="text-base font-bold text-zinc-900">APE+ Connect</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                La première plateforme communautaire pour les associations de parents d'élèves au Gabon.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 text-sm mb-4">Plateforme</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#features" className="hover:text-emerald-600 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Sécurité</a></li>
                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Pour les écoles</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Signaler un bug</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 text-sm mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><Link href="/privacy" className="hover:text-emerald-600 transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">CGU</Link></li>
                <li><a href="#" className="hover:text-emerald-600 transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-400">© 2026 APE+ Connect. Tous droits réservés. Libreville, Gabon.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-zinc-500">Systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
