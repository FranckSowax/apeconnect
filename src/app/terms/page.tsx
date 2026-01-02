"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#2D5016] flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-[#2D5016]">APE Connect</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2D5016] mb-8">
          Conditions Générales d&apos;Utilisation
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour : Janvier 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              1. Objet
            </h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent
              l&apos;utilisation de la plateforme APE Connect, un service de communication
              entre parents et établissements scolaires au Gabon.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              2. Inscription et Compte
            </h2>
            <p>
              Pour utiliser APE Connect, vous devez créer un compte en fournissant
              des informations exactes et à jour. Vous êtes responsable de la
              confidentialité de vos identifiants de connexion.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous devez avoir au moins 18 ans pour créer un compte</li>
              <li>Un seul compte par personne est autorisé</li>
              <li>Vous devez fournir un numéro de téléphone valide</li>
              <li>Vous êtes responsable de toutes les activités sur votre compte</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              3. Module Connect - Gestion des Absences
            </h2>
            <p>Le module Connect permet aux parents de :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Déclarer les absences de leurs enfants</li>
              <li>Joindre des justificatifs (documents, photos)</li>
              <li>Suivre le statut de leurs demandes</li>
              <li>Recevoir des notifications de confirmation</li>
            </ul>
            <p>
              Les déclarations d&apos;absence sont soumises à validation par
              l&apos;établissement scolaire. APE Connect ne garantit pas
              l&apos;approbation automatique des demandes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              4. Module Shop - Marketplace
            </h2>
            <p>
              Le marketplace permet l&apos;achat et la vente de manuels scolaires
              entre utilisateurs de la même communauté scolaire.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les annonces doivent concerner uniquement des manuels scolaires</li>
              <li>Les photos doivent être authentiques et représenter le produit réel</li>
              <li>Les prix doivent être raisonnables et en FCFA</li>
              <li>Toute annonce est soumise à modération avant publication</li>
              <li>APE Connect n&apos;est pas partie aux transactions entre utilisateurs</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              5. Comportement des Utilisateurs
            </h2>
            <p>Les utilisateurs s&apos;engagent à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respecter les autres utilisateurs et le personnel scolaire</li>
              <li>Ne pas publier de contenu offensant, frauduleux ou illégal</li>
              <li>Ne pas utiliser la plateforme à des fins commerciales non autorisées</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              6. Modération
            </h2>
            <p>
              APE Connect se réserve le droit de modérer, modifier ou supprimer tout
              contenu qui viole ces conditions d&apos;utilisation. En cas de violation
              répétée, le compte de l&apos;utilisateur pourra être suspendu ou supprimé.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              7. Limitation de Responsabilité
            </h2>
            <p>
              APE Connect est fourni &quot;tel quel&quot;. Nous ne garantissons pas que le
              service sera ininterrompu ou exempt d&apos;erreurs. Nous ne sommes pas
              responsables des transactions entre utilisateurs sur le marketplace.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              8. Propriété Intellectuelle
            </h2>
            <p>
              Tous les éléments de la plateforme APE Connect (logo, design, code)
              sont protégés par le droit de la propriété intellectuelle et
              appartiennent à APE Connect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              9. Modifications
            </h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions à tout moment.
              Les utilisateurs seront informés des changements significatifs par
              email ou notification dans l&apos;application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              10. Contact
            </h2>
            <p>
              Pour toute question concernant ces conditions d&apos;utilisation,
              contactez-nous à :
            </p>
            <p className="font-medium">
              Email : contact@apeconnect.ga
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 APE Connect. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-[#2D5016] font-medium">
                Conditions d&apos;utilisation
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-[#2D5016]">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
