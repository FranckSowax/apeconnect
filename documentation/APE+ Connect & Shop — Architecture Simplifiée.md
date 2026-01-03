# **APE+ Connect & Shop — Architecture Simplifiée**

## **Parfait \! C'est une approche beaucoup plus pragmatique. Voici l'architecture épurée.**

## ---

## **🎯 Nouvelle architecture**

## **┌─────────────────────────────────────────────────────────────────────────┐**

## **│                    APE+ CONNECT \- ARCHITECTURE SIMPLIFIÉE               │**

## **├─────────────────────────────────────────────────────────────────────────┤**

## **│                                                                         │**

## **│    👨‍👩‍👧 PARENTS                                                           │**

## **│       │                                                                 │**

## **│       ├──────────────────────┐                                          │**

## **│       │                      │                                          │**

## **│       ▼                      ▼                                          │**

## **│  ┌──────────────┐     ┌──────────────┐                                  │**

## **│  │  🌐 WEB APP  │     │  📲 PWA      │                                  │**

## **│  │  (Next.js)   │     │  Mobile      │                                  │**

## **│  │              │     │              │                                  │**

## **│  │ • Inscription│     │ • Même app   │                                  │**

## **│  │ • Suivi      │     │ • Installable│                                  │**

## **│  │ • Shop       │     │ • Hors-ligne │                                  │**

## **│  │ • Paiements  │     │              │                                  │**

## **│  └──────┬───────┘     └──────┬───────┘                                  │**

## **│         │                    │                                          │**

## **│         └─────────┬──────────┘                                          │**

## **│                   │                                                     │**

## **│                   ▼                                                     │**

## **│         ┌─────────────────────────────────────────┐                     │**

## **│         │              SUPABASE                   │                     │**

## **│         │  • Base de données                      │                     │**

## **│         │  • Auth (OTP SMS ou Magic Link)         │                     │**

## **│         │  • Edge Functions                       │                     │**

## **│         │  • Realtime                             │                     │**

## **│         └─────────────────┬───────────────────────┘                     │**

## **│                           │                                             │**

## **│                           │ Triggers DB                                 │**

## **│                           ▼                                             │**

## **│         ┌─────────────────────────────────────────┐                     │**

## **│         │              WHAPI                       │                     │**

## **│         │     (Notifications sortantes ONLY)      │                     │**

## **│         │                                         │                     │**

## **│         │  📤 Absence signalée                    │                     │**

## **│         │  📤 Rappel cotisation                   │                     │**

## **│         │  📤 Nouvel événement                    │                     │**

## **│         │  📤 Message de l'école                  │                     │**

## **│         └─────────────────────────────────────────┘                     │**

## **│                           │                                             │**

## **│                           ▼                                             │**

## **│                    📱 WhatsApp Parent                                   │**

## **│                    (Réception passive)                                  │**

## **│                                                                         │**

## **└─────────────────────────────────────────────────────────────────────────┘**

## ---

## **📱 Parcours utilisateur simplifié**

## **┌─────────────────────────────────────────────────────────────────────┐**

## **│  PARCOURS PARENT                                                    │**

## **├─────────────────────────────────────────────────────────────────────┤**

## **│                                                                     │**

## **│  1️⃣ INSCRIPTION (QR Code à l'école ou lien)                         │**

## **│     │                                                               │**

## **│     ▼                                                               │**

## **│     https://ape-mandela.app/inscription                             │**

## **│     • Nom, Prénom                                                   │**

## **│     • Numéro WhatsApp (+241...)                                     │**

## **│     • Enfant(s) \+ Classe(s)                                         │**

## **│     • ✅ Accepte de recevoir les notifications                      │**

## **│     │                                                               │**

## **│     ▼                                                               │**

## **│  2️⃣ VÉRIFICATION (OTP par SMS ou WhatsApp)                          │**

## **│     │                                                               │**

## **│     ▼                                                               │**

## **│  3️⃣ ACCÈS PLATEFORME                                                │**

## **│     • Tableau de bord famille                                       │**

## **│     • Suivi enfants                                                 │**

## **│     • Paiement cotisations                                          │**

## **│     • APE+ Shop                                                     │**

## **│     • Calendrier événements                                         │**

## **│     │                                                               │**

## **│     ▼                                                               │**

## **│  4️⃣ NOTIFICATIONS WHATSAPP (automatiques)                           │**

## **│     ← Reçoit alertes importantes sur son téléphone                  │**

## **│                                                                     │**

## **└─────────────────────────────────────────────────────────────────────┘**

## ---

## **🔔 Types de notifications Whapi**

| Événement | Template WhatsApp |
| ----- | ----- |
| **Absence** | **"⚠️ \[Prénom\] (\[Classe\]) a été signalé absent ce jour. Si justifié, ignorez ce message."** |
| **Retard** | **"🕐 \[Prénom\] est arrivé en retard à \[Heure\]."** |
| **Incident** | **"📝 Un incident concernant \[Prénom\] a été signalé. Consultez l'app pour plus de détails."** |
| **Cotisation due** | **"💰 Rappel : votre cotisation APE (XX XXX FCFA) est en attente. Payez sur l'app."** |
| **Événement J-3** | **"📅 Rappel : \[Événement\] dans 3 jours. Confirmez votre présence sur l'app."** |
| **Nouveau message** | **"✉️ Vous avez un nouveau message de \[Expéditeur\]. Consultez l'app."** |
| **Shop : article vendu** | **"🛒 Votre article \[Titre\] a trouvé preneur \! Contactez l'acheteur."** |

## 

## 

## **Fonctionnalités à digitaliser**

### **1\. 📢 Tableau d'annonces intelligent**

| Fonction | Description |
| ----- | ----- |
| Annonces prioritaires | Publications officielles (école, APE) avec accusé de lecture |
| Catégorisation auto | IA qui classe : Urgent / Info / Événement / Administratif |
| Traduction | Français ↔ Langues locales (Fang, Punu, etc.) |
| Audio-to-text | Les parents peuvent envoyer des vocaux, convertis en texte |
| Rappels automatiques | Notifications avant dates limites (cotisations, sorties) |

### **2\. 📅 Calendrier partagé interactif**

* Événements scolaires synchronisés  
* **RSVP intégré** : "Je participe / Je ne peux pas / J'envoie quelqu'un"  
* Rappels WhatsApp/SMS automatiques J-3, J-1  
* Export vers calendriers personnels (Google, iPhone)  
* Covoiturage intégré pour les sorties scolaires

### **5\. 🗳️ Sondages et votes structurés**

Au lieu des "Qui est pour ? Levez la main 🙋" chaotiques :

* Sondages avec options claires  
* Votes anonymes ou nominatifs  
* Résultats en temps réel  
* Quorum configurable  
* PV automatique des décisions

### **6\. 📝 Carnet de liaison digital**

* Messages individuels enseignant ↔ parent  
* Suivi des devoirs et évaluations  
* Notifications d'absence  
* Demande de rendez-vous en ligne  
* Historique consultable (fini le carnet perdu \!)

  #### **Carnet de liaison digital bidirectionnel**

* ┌─────────────────────────────────────────────────┐  
* │  📓 CARNET DE LIAISON \- Mamadou NDONG (4ème B)  │  
* ├─────────────────────────────────────────────────┤  
* │                                                 │  
* │  📥 NOUVEAU MESSAGE \- Mme Ondo (Français)       │  
* │  ───────────────────────────────────────        │  
* │  "Mamadou a oublié son cahier de cours          │  
* │   aujourd'hui. Merci de vérifier son sac."      │  
* │                                                 │  
* │  \[✅ Vu\]  \[💬 Répondre\]  \[📅 RDV\]               │  
* │                                                 │  
* ├─────────────────────────────────────────────────┤  
* │  📤 Envoyer un message à :                      │  
* │  ○ Prof principal  ○ Administration  ○ CPE     │  
* │                                                 │  
* │  \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\]         │  
* │  \[🎤 Vocal\]              \[📤 Envoyer\]           │  
* └─────────────────────────────────────────────────┘  
* 

### **. 📊 Dashboard pour l'administration scolaire**

* Taux d'engagement des parents  
* Statistiques de lecture des annonces  
* Alertes sur familles "silencieuses" (potentiel décrochage)  
* Export pour conseils de classe

### **Fonctionnalités actuelles conservées**

* Signalements absences/retards/incidents  
* Tableau de bord par classe  
* Rapports automatiques

#### **Système de dons solidaires**

┌─────────────────────────────────────────────────────────┐  
│  🎁 BOURSE SOLIDAIRE APE+                               │  
│  ─────────────────────────                              │  
│  Pour les familles en difficulté                        │  
├─────────────────────────────────────────────────────────┤  
│                                                         │  
│  📦 Articles disponibles en don :                       │  
│  • 15 manuels divers                                    │  
│  • 8 uniformes (tailles variées)                        │  
│  • 23 fournitures scolaires                             │  
│                                                         │  
│  🙏 Comment en bénéficier ?                             │  
│  Demande confidentielle auprès du bureau APE            │  
│                                                         │  
│  \[🎁 Je fais un don\]  \[📋 Voir les besoins\]             │

└─────────────────────────────────────────────────────────┘

