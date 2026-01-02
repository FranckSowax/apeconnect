"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
          Politique de Confidentialité
        </h1>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-muted-foreground">
            Dernière mise à jour : Janvier 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              1. Introduction
            </h2>
            <p>
              APE Connect s&apos;engage à protéger la vie privée des utilisateurs de notre
              plateforme de communication parent-école. Cette politique de confidentialité
              explique comment nous collectons, utilisons et protégeons vos informations
              personnelles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              2. Données Collectées
            </h2>
            <p>Nous collectons les types de données suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Informations d&apos;identification :</strong> nom, prénom, adresse
                email, numéro de téléphone
              </li>
              <li>
                <strong>Informations scolaires :</strong> établissement, classe des enfants,
                niveau scolaire
              </li>
              <li>
                <strong>Données d&apos;absence :</strong> dates, motifs, justificatifs
              </li>
              <li>
                <strong>Données marketplace :</strong> annonces de livres, photos, prix
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              3. Utilisation des Données
            </h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Faciliter la communication entre parents et établissements scolaires</li>
              <li>Gérer les déclarations d&apos;absence et leur suivi</li>
              <li>Permettre les transactions sur le marketplace de manuels scolaires</li>
              <li>Envoyer des notifications importantes via WhatsApp ou email</li>
              <li>Améliorer nos services et l&apos;expérience utilisateur</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              4. Protection des Données
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles
              appropriées pour protéger vos données personnelles contre tout accès non
              autorisé, modification, divulgation ou destruction.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chiffrement des données en transit et au repos</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Authentification sécurisée</li>
              <li>Audits de sécurité réguliers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              5. Vos Droits
            </h2>
            <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l&apos;effacement de vos données</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d&apos;opposition au traitement</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D5016]">
              6. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour
              exercer vos droits, vous pouvez nous contacter à :
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
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-[#2D5016]">
                Conditions d&apos;utilisation
              </Link>
              <Link href="/privacy" className="text-sm text-[#2D5016] font-medium">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
