"use client";

import { useEffect } from "react";
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
  BookOpen,
  MessageSquare,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Star,
  FileText,
  Smartphone,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#2D5016]"></div>
      </div>
    );
  }

  const features = [
    {
      icon: MessageSquare,
      title: "Signalement WhatsApp",
      description:
        "Signalez les absences de vos enfants directement via WhatsApp. Simple, rapide et accessible.",
    },
    {
      icon: FileText,
      title: "Justificatifs en ligne",
      description:
        "Uploadez vos justificatifs (certificats, ordonnances) directement depuis votre smartphone.",
    },
    {
      icon: BookOpen,
      title: "Marketplace scolaire",
      description:
        "Achetez et vendez des manuels scolaires entre parents du même établissement.",
    },
    {
      icon: Shield,
      title: "Modération IA",
      description:
        "Toutes les annonces sont vérifiées par notre IA pour garantir un environnement sûr.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Créez votre compte",
      description:
        "Inscrivez-vous gratuitement et rattachez vos enfants à leur établissement.",
    },
    {
      number: "02",
      title: "Signalez via WhatsApp",
      description:
        "Envoyez un simple message WhatsApp pour signaler une absence. Notre bot fait le reste.",
    },
    {
      number: "03",
      title: "Suivez en temps réel",
      description:
        "Consultez le statut de vos demandes et recevez des notifications de validation.",
    },
  ];

  const testimonials = [
    {
      name: "Marie Nguema",
      role: "Parent d'élève - Lycée Léon Mba",
      content:
        "APE Connect a révolutionné ma façon de communiquer avec l'école. Plus besoin de me déplacer pour un simple justificatif !",
      rating: 5,
    },
    {
      name: "Jean-Pierre Ondo",
      role: "Parent d'élève - Collège Bessieux",
      content:
        "Le marketplace m'a permis d'économiser sur les manuels scolaires. Excellente initiative pour les familles.",
      rating: 5,
    },
    {
      name: "Sylvie Mbadinga",
      role: "Censeur - Lycée National",
      content:
        "La gestion des absences est devenue fluide. Nous gagnons un temps précieux au quotidien.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Comment signaler une absence via WhatsApp ?",
      answer:
        "Ajoutez simplement notre numéro WhatsApp officiel (+241 XX XX XX XX) et envoyez un message avec le nom de votre enfant et le motif de l'absence. Notre assistant virtuel vous guidera pour compléter la déclaration.",
    },
    {
      question: "L'inscription est-elle gratuite ?",
      answer:
        "Oui, l'inscription et l'utilisation de la plateforme sont entièrement gratuites pour les parents. Seules les transactions sur le marketplace sont à la charge des utilisateurs.",
    },
    {
      question: "Comment fonctionne le marketplace de manuels ?",
      answer:
        "Vous pouvez publier des annonces pour vendre vos manuels ou parcourir les offres disponibles. Les échanges se font directement entre parents via WhatsApp, en toute sécurité.",
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer:
        "Absolument. Nous utilisons un chiffrement de bout en bout et respectons les normes RGPD. Vos données personnelles ne sont jamais partagées avec des tiers.",
    },
    {
      question: "Quels établissements sont concernés ?",
      answer:
        "APE Connect est disponible pour tous les établissements scolaires du Gabon. Si votre école n'est pas encore inscrite, contactez-nous pour l'ajouter.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#E6E1D6]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2D5016] flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-[#1A3D1A]">
                APE Connect
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium"
              >
                Fonctionnalités
              </a>
              <a
                href="#how-it-works"
                className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium"
              >
                Comment ça marche
              </a>
              <a
                href="#testimonials"
                className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium"
              >
                Témoignages
              </a>
              <a
                href="#faq"
                className="text-[#1A3D1A]/70 hover:text-[#2D5016] transition-colors font-medium"
              >
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-[#1A3D1A] hover:bg-[#F5F1E8]"
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#2D5016] hover:bg-[#4A7C23] text-white rounded-full px-6">
                  S&apos;inscrire gratuitement
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            <div className="md:hidden pt-4 pb-2 border-t border-[#E6E1D6] mt-4">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-[#1A3D1A]/70 hover:text-[#2D5016] py-2"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#how-it-works"
                  className="text-[#1A3D1A]/70 hover:text-[#2D5016] py-2"
                >
                  Comment ça marche
                </a>
                <a
                  href="#testimonials"
                  className="text-[#1A3D1A]/70 hover:text-[#2D5016] py-2"
                >
                  Témoignages
                </a>
                <a
                  href="#faq"
                  className="text-[#1A3D1A]/70 hover:text-[#2D5016] py-2"
                >
                  FAQ
                </a>
                <div className="flex gap-4 pt-4">
                  <Link href="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#2D5016] text-[#2D5016]"
                    >
                      Se connecter
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-[#2D5016] hover:bg-[#4A7C23] text-white">
                      S&apos;inscrire
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#9AAB65]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F7D66E]/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#F5F1E8] px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-[#2D5016] rounded-full animate-pulse"></span>
              <span className="text-sm text-[#1A3D1A] font-medium">
                Disponible dans tous les établissements du Gabon
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1A3D1A] leading-tight mb-6">
              La communication{" "}
              <span className="text-[#2D5016]">parents-école</span>
              <br />
              simplifiée
            </h1>

            <p className="text-lg md:text-xl text-[#1A3D1A]/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Signalez les absences via WhatsApp, gérez les justificatifs et
              échangez des manuels scolaires sur une seule plateforme.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#2D5016] hover:bg-[#4A7C23] text-white rounded-full h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white rounded-full h-14 px-8 text-lg font-semibold transition-all"
                >
                  Voir la démo
                </Button>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-[#1A3D1A]/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#2D5016]" />
                <span>100% gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#2D5016]" />
                <span>Données sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[#2D5016]" />
                <span>Via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F5F1E8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#2D5016] font-semibold text-sm uppercase tracking-wider">
              Fonctionnalités
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A3D1A] mt-4 mb-6">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              Une plateforme complète pour gérer la vie scolaire de vos enfants
              et communiquer efficacement avec l&apos;école.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-[#2D5016]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#2D5016] transition-colors">
                    <feature.icon className="h-7 w-7 text-[#2D5016] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3D1A] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#1A3D1A]/60 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#2D5016] font-semibold text-sm uppercase tracking-wider">
              Comment ça marche
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A3D1A] mt-4 mb-6">
              Simple comme 1, 2, 3
            </h2>
            <p className="text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              Commencez à utiliser APE Connect en quelques minutes seulement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D5016] text-white rounded-full text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3D1A] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[#1A3D1A]/60">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-[#2D5016]/30"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#2D5016] hover:bg-[#4A7C23] text-white rounded-full h-14 px-8"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#2D5016]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <div className="text-white/70">Familles inscrites</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                15
              </div>
              <div className="text-white/70">Établissements</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                2000+
              </div>
              <div className="text-white/70">Absences traitées</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                98%
              </div>
              <div className="text-white/70">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[#F5F1E8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#2D5016] font-semibold text-sm uppercase tracking-wider">
              Témoignages
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1A3D1A] mt-4 mb-6">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-[#1A3D1A]/70 max-w-2xl mx-auto">
              Découvrez ce que les parents et les établissements pensent
              d&apos;APE Connect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-[#F7D66E] text-[#F7D66E]"
                      />
                    ))}
                  </div>
                  <p className="text-[#1A3D1A]/80 mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#2D5016]/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#2D5016]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A3D1A]">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[#1A3D1A]/60">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#FDFBF7]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#2D5016] font-semibold text-sm uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#1A3D1A] mt-4 mb-6">
                Questions fréquentes
              </h2>
              <p className="text-lg text-[#1A3D1A]/70">
                Vous avez des questions ? Nous avons les réponses.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border-0 shadow-sm px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-[#1A3D1A] hover:text-[#2D5016] py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#1A3D1A]/70 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2D5016]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à simplifier votre quotidien ?
            </h2>
            <p className="text-lg text-white/80 mb-10">
              Rejoignez les centaines de familles qui utilisent APE Connect pour
              une meilleure communication avec l&apos;école.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-[#2D5016] hover:bg-[#F5F1E8] rounded-full h-14 px-8 text-lg font-semibold"
                >
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#2D5016] rounded-full h-14 px-8 text-lg font-semibold"
                >
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1A3D1A]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#2D5016] font-bold text-lg">A</span>
                </div>
                <span className="font-bold text-xl text-white">
                  APE Connect
                </span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                La plateforme de communication parents-école du Gabon.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-white/60 hover:text-white text-sm"
                  >
                    Témoignages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#faq"
                    className="text-white/60 hover:text-white text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white text-sm">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white text-sm">
                    Aide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/60 hover:text-white text-sm">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white text-sm">
                    CGU
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/60 hover:text-white text-sm">
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/60 text-sm">
                &copy; 2026 APE Connect. Tous droits réservés.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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
