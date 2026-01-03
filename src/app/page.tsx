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
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  Smartphone,
  Menu,
  X,
  Gift,
  ClipboardList,
  Vote,
  QrCode,
  Send,
  Zap,
  Heart,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-[#2D5016]"></div>
      </div>
    );
  }

  const modules = [
    {
      icon: MessageSquare,
      title: "Module Connect",
      subtitle: "Gestion des absences",
      description: "Signalez absences et retards avec notifications WhatsApp automatiques vers les parents.",
      color: "bg-[#2D5016]",
      features: ["Signalement rapide", "Justificatifs en ligne", "Notifications temps-r\u00e9el"],
    },
    {
      icon: ShoppingBag,
      title: "Module Shop",
      subtitle: "Marketplace scolaire",
      description: "Achetez et vendez manuels, uniformes et fournitures entre parents du m\u00eame \u00e9tablissement.",
      color: "bg-[#F7D66E]",
      features: ["Mod\u00e9ration IA", "Paiements s\u00e9curis\u00e9s", "Bourse solidaire"],
    },
  ];

  const features = [
    {
      icon: Bell,
      title: "Tableau d'annonces",
      description: "Publications officielles avec cat\u00e9gorisation IA : Urgent, Info, \u00c9v\u00e9nement, Administratif.",
      color: "from-[#2D5016] to-[#4A7C23]",
    },
    {
      icon: Calendar,
      title: "Calendrier partag\u00e9",
      description: "RSVP int\u00e9gr\u00e9, rappels automatiques J-3/J-1, export vers calendriers personnels.",
      color: "from-[#F7D66E] to-[#E5C55D]",
    },
    {
      icon: ClipboardList,
      title: "Carnet de liaison",
      description: "Messages enseignant-parent, suivi des devoirs, demande de RDV en ligne.",
      color: "from-[#B6CAEB] to-[#9AB8E2]",
    },
    {
      icon: Vote,
      title: "Sondages & Votes",
      description: "Votes anonymes ou nominatifs, r\u00e9sultats temps-r\u00e9el, PV automatique.",
      color: "from-[#FFB2DD] to-[#F799CC]",
    },
    {
      icon: Gift,
      title: "Bourse solidaire",
      description: "Syst\u00e8me de dons pour familles en difficult\u00e9 : manuels, uniformes, fournitures.",
      color: "from-[#9AAB65] to-[#7D9150]",
    },
    {
      icon: Shield,
      title: "S\u00e9curit\u00e9 avanc\u00e9e",
      description: "Chiffrement bout-en-bout, conformit\u00e9 RGPD, donn\u00e9es h\u00e9berg\u00e9es en Europe.",
      color: "from-[#1A3D1A] to-[#2D5016]",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: QrCode,
      title: "Inscription",
      description: "Scannez le QR Code \u00e0 l'\u00e9cole ou utilisez le lien d'inscription. Renseignez vos enfants et classes.",
    },
    {
      number: "02",
      icon: Smartphone,
      title: "V\u00e9rification",
      description: "Validez votre num\u00e9ro WhatsApp par OTP SMS. Simple et s\u00e9curis\u00e9.",
    },
    {
      number: "03",
      icon: GraduationCap,
      title: "Acc\u00e8s plateforme",
      description: "Acc\u00e9dez au tableau de bord famille, suivi enfants, paiements et APE+ Shop.",
    },
    {
      number: "04",
      icon: Send,
      title: "Notifications",
      description: "Recevez les alertes importantes directement sur WhatsApp : absences, \u00e9v\u00e9nements, rappels.",
    },
  ];

  const notifications = [
    { type: "Absence", message: "\u26a0\ufe0f [Pr\u00e9nom] a \u00e9t\u00e9 signal\u00e9 absent ce jour.", icon: "warning" },
    { type: "Retard", message: "\ud83d\udd50 [Pr\u00e9nom] est arriv\u00e9 en retard \u00e0 [Heure].", icon: "clock" },
    { type: "Cotisation", message: "\ud83d\udcb0 Rappel : votre cotisation APE est en attente.", icon: "money" },
    { type: "\u00c9v\u00e9nement", message: "\ud83d\udcc5 Rappel : [Event] dans 3 jours.", icon: "calendar" },
    { type: "Shop", message: "\ud83d\uded2 Votre article a trouv\u00e9 preneur !", icon: "shop" },
  ];

  const testimonials = [
    {
      name: "Marie Nguema",
      role: "Parent d'\u00e9l\u00e8ve - Lyc\u00e9e L\u00e9on Mba",
      content: "APE Connect a r\u00e9volutionn\u00e9 ma fa\u00e7on de communiquer avec l'\u00e9cole. Plus besoin de me d\u00e9placer !",
      rating: 5,
    },
    {
      name: "Jean-Pierre Ondo",
      role: "Parent - Coll\u00e8ge Bessieux",
      content: "Le marketplace m'a permis d'\u00e9conomiser sur les manuels. Excellente initiative !",
      rating: 5,
    },
    {
      name: "Sylvie Mbadinga",
      role: "Censeur - Lyc\u00e9e National",
      content: "La gestion des absences est devenue fluide. Nous gagnons un temps pr\u00e9cieux.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Comment fonctionne le syst\u00e8me de notifications WhatsApp ?",
      answer: "Apr\u00e8s inscription et v\u00e9rification de votre num\u00e9ro, vous recevez automatiquement les alertes importantes : absences de vos enfants, rappels d'\u00e9v\u00e9nements, messages de l'\u00e9cole. Aucune action requise de votre part.",
    },
    {
      question: "L'inscription est-elle gratuite ?",
      answer: "Oui, l'inscription et l'utilisation de la plateforme sont enti\u00e8rement gratuites pour les parents. Seules les transactions sur le marketplace sont \u00e0 la charge des utilisateurs.",
    },
    {
      question: "Comment fonctionne la Bourse solidaire ?",
      answer: "Les parents peuvent faire don d'articles (manuels, uniformes, fournitures) pour les familles en difficult\u00e9. Les demandes sont trait\u00e9es confidentiellement par le bureau APE.",
    },
    {
      question: "Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et respectons les normes RGPD. Vos donn\u00e9es personnelles ne sont jamais partag\u00e9es avec des tiers.",
    },
    {
      question: "Quels \u00e9tablissements sont concern\u00e9s ?",
      answer: "APE Connect est disponible pour tous les \u00e9tablissements scolaires du Gabon. Si votre \u00e9cole n'est pas encore inscrite, contactez-nous pour l'ajouter.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E6E1D6]/50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-[#2D5016] to-[#4A7C23] flex items-center justify-center shadow-lg shadow-[#2D5016]/20">
                <span className="text-white font-bold text-base sm:text-lg">A+</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg text-[#1A3D1A] leading-tight">
                  APE Connect
                </span>
                <span className="text-[10px] sm:text-xs text-[#2D5016]/60 font-medium hidden sm:block">
                  Connect & Shop
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <a href="#modules" className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium text-sm">
                Modules
              </a>
              <a href="#features" className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium text-sm">
                Fonctionnalit\u00e9s
              </a>
              <a href="#how-it-works" className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium text-sm">
                Comment \u00e7a marche
              </a>
              <a href="#faq" className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium text-sm">
                FAQ
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-[#1A3D1A] hover:bg-[#2D5016]/5 font-medium">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-[#2D5016] to-[#4A7C23] hover:opacity-90 text-white rounded-full px-6 shadow-lg shadow-[#2D5016]/20">
                  S'inscrire gratuitement
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -mr-2 rounded-xl hover:bg-[#2D5016]/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#1A3D1A]" />
              ) : (
                <Menu className="h-6 w-6 text-[#1A3D1A]" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pt-4 pb-4 border-t border-[#E6E1D6] mt-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-1">
                <a href="#modules" onClick={handleMobileNavClick} className="text-[#1A3D1A]/70 hover:text-[#2D5016] hover:bg-[#2D5016]/5 py-3 px-3 rounded-xl transition-colors font-medium">
                  Modules
                </a>
                <a href="#features" onClick={handleMobileNavClick} className="text-[#1A3D1A]/70 hover:text-[#2D5016] hover:bg-[#2D5016]/5 py-3 px-3 rounded-xl transition-colors font-medium">
                  Fonctionnalit\u00e9s
                </a>
                <a href="#how-it-works" onClick={handleMobileNavClick} className="text-[#1A3D1A]/70 hover:text-[#2D5016] hover:bg-[#2D5016]/5 py-3 px-3 rounded-xl transition-colors font-medium">
                  Comment \u00e7a marche
                </a>
                <a href="#faq" onClick={handleMobileNavClick} className="text-[#1A3D1A]/70 hover:text-[#2D5016] hover:bg-[#2D5016]/5 py-3 px-3 rounded-xl transition-colors font-medium">
                  FAQ
                </a>
                <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-[#E6E1D6]">
                  <Link href="/login" onClick={handleMobileNavClick}>
                    <Button variant="outline" className="w-full h-12 border-[#2D5016] text-[#2D5016] rounded-xl font-medium">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register" onClick={handleMobileNavClick}>
                    <Button className="w-full h-12 bg-gradient-to-r from-[#2D5016] to-[#4A7C23] text-white rounded-xl font-medium">
                      S'inscrire gratuitement
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-gradient-to-br from-[#9AAB65]/20 to-[#2D5016]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-tr from-[#F7D66E]/20 to-[#FFB2DD]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(45,80,22,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6 sm:mb-8 shadow-sm border border-[#E6E1D6]/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5016] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D5016]"></span>
              </span>
              <span className="text-xs sm:text-sm text-[#1A3D1A] font-medium">
                Nouvelle g\u00e9n\u00e9ration de communication scolaire
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A3D1A] leading-[1.1] mb-6 px-2">
              La plateforme
              <span className="relative inline-block mx-2 sm:mx-3">
                <span className="relative z-10 text-[#2D5016]">parents-\u00e9cole</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" stroke="#F7D66E" strokeWidth="4" fill="none" />
                </svg>
              </span>
              <br className="hidden sm:block" />
              du Gabon
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#1A3D1A]/70 mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Gestion des absences, marketplace scolaire et communication instantan\u00e9e via WhatsApp.
              <span className="font-semibold text-[#2D5016]"> Une seule app pour tout.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#2D5016] to-[#4A7C23] hover:opacity-90 text-white rounded-full h-14 px-8 text-lg font-semibold shadow-xl shadow-[#2D5016]/25 hover:shadow-2xl hover:shadow-[#2D5016]/30 transition-all hover:-translate-y-0.5"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-[#2D5016]/20 text-[#2D5016] hover:bg-[#2D5016]/5 hover:border-[#2D5016]/40 rounded-full h-14 px-8 text-lg font-semibold transition-all"
                >
                  D\u00e9couvrir le parcours
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 px-4">
              <div className="flex items-center gap-2 text-sm text-[#1A3D1A]/60">
                <div className="h-8 w-8 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-[#2D5016]" />
                </div>
                <span>100% gratuit</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1A3D1A]/60">
                <div className="h-8 w-8 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#2D5016]" />
                </div>
                <span>S\u00e9curis\u00e9 RGPD</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1A3D1A]/60">
                <div className="h-8 w-8 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-[#2D5016]" />
                </div>
                <span>Notifications WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[#2D5016] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#2D5016]/10 px-4 py-2 rounded-full mb-4">
              Nos modules
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3D1A] mb-4">
              Deux modules, une plateforme
            </h2>
            <p className="text-base sm:text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              APE+ Connect combine gestion scolaire et marketplace pour simplifier votre quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {modules.map((module, index) => (
              <Card
                key={index}
                className="group bg-gradient-to-br from-white to-[#FDFBF7] border border-[#E6E1D6]/50 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-1"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`h-14 w-14 rounded-2xl ${module.color} flex items-center justify-center shadow-lg ${module.color === "bg-[#2D5016]" ? "shadow-[#2D5016]/20" : "shadow-[#F7D66E]/30"} group-hover:scale-110 transition-transform`}>
                      <module.icon className={`h-7 w-7 ${module.color === "bg-[#2D5016]" ? "text-white" : "text-[#2D5016]"}`} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#1A3D1A] mb-1">{module.title}</h3>
                      <p className="text-sm text-[#2D5016] font-medium">{module.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[#1A3D1A]/70 mb-6 leading-relaxed">{module.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-[#2D5016]/5 text-[#2D5016] text-sm font-medium px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[#2D5016] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#2D5016]/10 px-4 py-2 rounded-full mb-4">
              Fonctionnalit\u00e9s
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3D1A] mb-4">
              Tout pour faciliter le quotidien
            </h2>
            <p className="text-base sm:text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              Des outils modernes pour une communication fluide entre parents, enseignants et administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A3D1A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#1A3D1A]/60 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - User Journey */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[#2D5016] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#2D5016]/10 px-4 py-2 rounded-full mb-4">
              Parcours utilisateur
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3D1A] mb-4">
              D\u00e9marrez en 4 \u00e9tapes
            </h2>
            <p className="text-base sm:text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              De l'inscription aux notifications WhatsApp automatiques.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E6E1D6]/50 h-full hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-[#2D5016]/20">
                        {step.number}
                      </div>
                      <step.icon className="h-6 w-6 text-[#2D5016]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A3D1A] mb-2">{step.title}</h3>
                    <p className="text-sm text-[#1A3D1A]/60 leading-relaxed">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-[#2D5016]/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Notifications Preview */}
          <div className="mt-16 sm:mt-20 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#2D5016] to-[#1A3D1A] rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Notifications WhatsApp</h3>
                  <p className="text-white/70 text-sm">Recevez automatiquement</p>
                </div>
              </div>
              <div className="space-y-3">
                {notifications.map((notif, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-start gap-3 hover:bg-white/15 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{notif.type.charAt(0)}</span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{notif.type}</span>
                      <p className="text-sm text-white/90 mt-1">{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-[#2D5016]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white">500+</div>
              <div className="text-white/70 text-sm sm:text-base">Familles inscrites</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white">15</div>
              <div className="text-white/70 text-sm sm:text-base">\u00c9tablissements</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white">2000+</div>
              <div className="text-white/70 text-sm sm:text-base">Absences trait\u00e9es</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl font-bold text-white">98%</div>
              <div className="text-white/70 text-sm sm:text-base">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block text-[#2D5016] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#2D5016]/10 px-4 py-2 rounded-full mb-4">
              T\u00e9moignages
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3D1A] mb-4">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-sm rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-lg transition-all">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#F7D66E] text-[#F7D66E]" />
                    ))}
                  </div>
                  <p className="text-[#1A3D1A]/80 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2D5016] to-[#4A7C23] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A3D1A]">{testimonial.name}</div>
                      <div className="text-sm text-[#1A3D1A]/60">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-[#2D5016] font-bold text-xs sm:text-sm uppercase tracking-wider bg-[#2D5016]/10 px-4 py-2 rounded-full mb-4">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A3D1A] mb-4">
                Questions fr\u00e9quentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-[#FDFBF7] rounded-2xl border-0 px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-[#1A3D1A] hover:text-[#2D5016] py-5 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#1A3D1A]/70 pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#2D5016] to-[#1A3D1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiIHN0cm9rZS13aWR0aD0iMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Heart className="h-4 w-4 text-[#FFB2DD]" />
              <span className="text-white/90 text-sm font-medium">Rejoignez la communaut\u00e9 APE+</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Pr\u00eat \u00e0 simplifier votre quotidien ?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Rejoignez les centaines de familles qui utilisent APE Connect pour une meilleure communication avec l'\u00e9cole.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#2D5016] hover:bg-[#F5F1E8] rounded-full h-14 px-8 text-lg font-semibold shadow-xl"
                >
                  Cr\u00e9er un compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 rounded-full h-14 px-8 text-lg font-semibold"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 bg-[#1A3D1A]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
                  <span className="text-[#2D5016] font-bold">A+</span>
                </div>
                <span className="font-bold text-xl text-white">APE Connect</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                La plateforme de communication parents-\u00e9cole du Gabon. Connect & Shop.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#modules" className="text-white/60 hover:text-white text-sm transition-colors">Modules</a></li>
                <li><a href="#features" className="text-white/60 hover:text-white text-sm transition-colors">Fonctionnalit\u00e9s</a></li>
                <li><a href="#how-it-works" className="text-white/60 hover:text-white text-sm transition-colors">Parcours</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#faq" className="text-white/60 hover:text-white text-sm transition-colors">FAQ</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Contact</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Aide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">L\u00e9gal</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Confidentialit\u00e9</Link></li>
                <li><Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">CGU</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                &copy; 2026 APE Connect. Tous droits r\u00e9serv\u00e9s.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
