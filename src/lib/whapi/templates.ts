// WhatsApp message templates for APE Connect

export const templates = {
  // Phone verification
  verification: (code: string) => `
Bienvenue sur APE Connect!

Votre code de verification est: *${code}*

Ce code expire dans 10 minutes.
Ne partagez jamais ce code avec personne.
`,

  // Absence confirmation (for parent)
  absenceReceived: (studentName: string, date: string) => `
Votre demande d'absence a bien ete recue.

Eleve: *${studentName}*
Date: *${date}*

Un membre de l'administration examinera votre demande dans les plus brefs delais.
`,

  // Absence approved notification
  absenceApproved: (studentName: string, date: string) => `
Bonne nouvelle!

L'absence de *${studentName}* pour le *${date}* a ete *approuvee*.

Cordialement,
L'equipe APE Connect
`,

  // Absence rejected notification
  absenceRejected: (studentName: string, date: string, reason?: string) => `
Votre demande d'absence a ete refusee.

Eleve: *${studentName}*
Date: *${date}*
${reason ? `Motif: ${reason}` : ""}

Veuillez contacter l'administration pour plus d'informations.
`,

  // New absence notification for admin
  newAbsenceForAdmin: (
    parentName: string,
    studentName: string,
    date: string,
    reason: string
  ) => `
Nouvelle demande d'absence

Parent: ${parentName}
Eleve: *${studentName}*
Date: *${date}*
Motif: ${reason}

Connectez-vous a APE Connect pour valider cette demande.
`,

  // Ad published notification
  adPublished: (title: string) => `
Votre annonce a ete publiee!

*${title}*

Elle est maintenant visible par tous les parents de l'etablissement.
`,

  // Ad rejected notification
  adRejected: (title: string, reason?: string) => `
Votre annonce n'a pas ete approuvee.

*${title}*
${reason ? `Motif: ${reason}` : ""}

Veuillez modifier votre annonce et la soumettre a nouveau.
`,

  // Contact seller message
  contactSeller: (adTitle: string, buyerName: string) => `
Un parent est interesse par votre annonce!

*${adTitle}*

${buyerName} souhaite vous contacter. Vous pouvez echanger directement via WhatsApp.
`,

  // Welcome message
  welcome: (userName: string) => `
Bienvenue sur *APE Connect*, ${userName}!

Vous pouvez maintenant:
- Signaler les absences de vos enfants
- Acheter et vendre des manuels scolaires
- Recevoir des notifications instantanees

Tapez *aide* pour voir les commandes disponibles.
`,

  // Help message
  help: () => `
*Commandes disponibles:*

*absence* - Signaler une nouvelle absence
*mes absences* - Voir l'historique de vos absences
*aide* - Afficher ce message

Pour le Shop, visitez notre application web.
`,

  // Absence bot flow messages
  absenceBot: {
    askStudent: (students: string[]) => `
Pour quel eleve souhaitez-vous signaler une absence?

${students.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Repondez avec le numero correspondant.
`,
    askDate: () => `
Quelle est la date de l'absence?

Repondez au format: *JJ/MM/AAAA*
Ou tapez *aujourd'hui* pour la date du jour.
`,
    askReason: () => `
Quel est le motif de l'absence?

Exemples: maladie, rendez-vous medical, raison familiale...
`,
    askJustification: () => `
Avez-vous un justificatif a joindre?

Envoyez une photo ou un document PDF, ou tapez *non* pour continuer sans justificatif.
`,
    confirm: (studentName: string, date: string, reason: string) => `
Veuillez confirmer votre demande:

Eleve: *${studentName}*
Date: *${date}*
Motif: *${reason}*

Repondez *oui* pour confirmer ou *non* pour annuler.
`,
    success: () => `
Votre demande d'absence a ete enregistree avec succes.

Vous recevrez une notification des que l'administration aura traite votre demande.
`,
    cancelled: () => `
Votre demande a ete annulee.

Tapez *absence* pour recommencer.
`,
  },
};

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // Add country code if missing (assuming Cameroon +237)
  if (!cleaned.startsWith("237") && cleaned.length === 9) {
    cleaned = "237" + cleaned;
  }

  // Ensure it starts with country code
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
