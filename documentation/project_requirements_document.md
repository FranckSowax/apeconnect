# Project Requirements Document

## 1. Project Overview

We are building a web and mobile Progressive Web App (PWA) that modernizes how parents, teachers, and school administrators communicate and collaborate. Instead of juggling emails, paper notes, and phone calls, everyone uses a single platform to report and validate student absences, manage school-life updates, and buy or sell textbooks. To make it even smoother, the platform ties into WhatsApp (via Whapi.cloud) so parents can send reports or browse listings by chat, and receive real-time notifications without switching apps.

This solution is driven by two main goals: (1) drastically speed up and simplify absence reporting and confirmation, and (2) create a lightweight, peer-to-peer marketplace for school books without handling payments ourselves. Success will be measured by high adoption rates across multiple schools, sub-30-second notification times, >80% of absence reports validated within 24 hours, and a vibrant, low-friction textbook exchange.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (MVP / Version 1)

*   Secure authentication and role-based access for Parents, Teachers, Censeur/Vie Scolaire, Administration, and Super-Admin

*   **Module Connect**:

    *   Parent-driven absence reporting via web form or WhatsApp bot (date, reason, JPG/PDF).
    *   Admin validation or rejection, with automatic WhatsApp confirmation.
    *   History of all reports, filtered by user role.

*   **Module Shop**:

    *   Parents post textbook ads via web form or WhatsApp (photo, price, description).
    *   Filterable, searchable catalog by subject, level, school.
    *   “Buy via WhatsApp” button that opens a preformatted chat.
    *   GPT-4o assisted content check + manual moderation workflow.

*   **Admin Dashboard**:

    *   Overview of pending absence requests and ad approvals.
    *   Global statistics (daily message volume, adoption metrics).

*   WhatsApp integration through Whapi.cloud webhooks for two-way messaging.

*   Supabase backend (PostgreSQL) with RLS, Auth, and Storage.

*   PWA front end built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui.

*   Deployment: Frontend on Vercel; Backend & Database on Supabase.

### Out-of-Scope (Later Phases)

*   Built-in payment processing or commission handling.
*   Alternative notification channels (SMS, email) if WhatsApp is down.
*   Fully offline mode beyond read-only history.
*   Integration with school ERPs, payroll, or internal class messaging.
*   Mobile-money or other payment gateway (planned for v2+).

## 3. User Flow

When a new parent arrives, they open the PWA and select their school from a dropdown of registered establishments. They sign up with email/password (or OAuth) using Supabase Auth. The system sends a WhatsApp message via Whapi.cloud to verify their number and link their chat channel. Once verified, they land on a dashboard showing two main tiles: “Connect” for absences and “Shop” for textbooks. Teachers, censeurs, and admins follow a similar flow but see role-specific menus.

To report an absence, a parent clicks “Connect,” fills in date, reason, and uploads a JPG/PDF or simply messages the WhatsApp bot. The data is saved as a draft in Supabase, and the admin gets a WhatsApp alert. An administrator or censeur reviews the request in the dashboard and clicks Approve or Reject, triggering an immediate WhatsApp notification back to the parent. For textbooks, a parent visits “Shop,” browses or searches listings, then taps “Buy via WhatsApp” to start a chat with the seller. To post an ad, they fill a form or message the bot; GPT-4o flags potential issues, then the censeur approves it before it goes live.

## 4. Core Features

*   **Authentication & Roles**

    *   Supabase Auth with email/password, OAuth options.
    *   Five roles: Parent, Teacher, Censeur/Vie Scolaire, Admin, Super-Admin.
    *   Row-Level Security (RLS) ensures each role sees only its data.

*   **Absence Management (Module Connect)**

    *   Web form + WhatsApp bot for reporting.
    *   Upload supporting JPG/PDF.
    *   Admin approval workflow with automatic WhatsApp notifications.

*   **Textbook Marketplace (Module Shop)**

    *   Web form + WhatsApp bot for creating draft ads.
    *   Filterable catalog (subject, level, school).
    *   Direct WhatsApp chat link for purchase.
    *   GPT-4o content review + manual moderation.

*   **Admin Dashboard**

    *   Pending absence requests and ads.
    *   Approval/rejection controls.
    *   Real-time stats (message volume, response times).

*   **WhatsApp Integration**

    *   Whapi.cloud for sending/receiving messages.
    *   Node.js webhook handlers for business logic.

*   **Data Storage & Security**

    *   Supabase PostgreSQL for structured data.
    *   Supabase Storage for uploads (encrypted).
    *   GDPR-friendly data handling.

*   **PWA & Offline Support**

    *   shadcn/ui + Next.js 14 app router for mobile/desktop.
    *   Cache recent absence history and listings for read-only access offline.

## 5. Tech Stack & Tools

*   Frontend:

    *   Next.js 14 (app router), TypeScript, Tailwind CSS, shadcn/ui, PWA

*   Backend:

    *   Node.js for API routes & webhook handlers

*   Database & Auth:

    *   Supabase (PostgreSQL, Auth, RLS, Storage)

*   Messaging:

    *   Whapi.cloud for WhatsApp gateway

*   AI & Moderation:

    *   OpenAI GPT-4o for automatic ad moderation

*   Hosting & Deployment:

    *   Vercel (frontend), Supabase serverless (backend & DB)

*   Future Integrations:

    *   Mobile Money API (later version)

## 6. Non-Functional Requirements

*   **Performance**:

    *   First-paint under 2 seconds on 3G.
    *   WhatsApp notifications delivered <30 seconds after event.

*   **Scalability**:

    *   Handle 500–800 messages per day per establishment.
    *   Ability to onboard 10+ schools without reconfiguration.

*   **Security & Compliance**:

    *   TLS for all network traffic.
    *   Encryption at rest for stored files.
    *   GDPR data retention and deletion policies.

*   **Usability**:

    *   Mobile-first responsive design.
    *   Clear, intuitive forms and chat flows.
    *   Accessible color contrast and font sizes.

*   **Reliability**:

    *   99.9% uptime SLA for core services.
    *   Partial offline read access for cached data.

## 7. Constraints & Assumptions

*   **Constraints**:

    *   WhatsApp is the sole critical notification channel—no fallback.
    *   GPT-4o API availability and rate limits apply.
    *   Supabase free tier quotas may need upgrading as usage grows.

*   **Assumptions**:

    *   Schools will supply list of establishments beforehand.
    *   Parents have smartphone with WhatsApp installed.
    *   No heavy regulatory constraints beyond GDPR.

## 8. Known Issues & Potential Pitfalls

*   **WhatsApp Rate Limits**

    *   Mitigation: Monitor message volume; batch non-critical updates or upgrade Whapi plan.

*   **Offline Sync Conflicts**

    *   Mitigation: Use timestamp-based merge; queue updates client-side until reconnected.

*   **GPT-4o False Positives**

    *   Mitigation: Always include a human-in-the-loop moderation step before publishing.

*   **File Upload Size**

    *   Mitigation: Enforce max 5 MB per upload; downsize images client-side if needed.

*   **Role Misconfiguration**

    *   Mitigation: Implement comprehensive RLS test suite in Supabase before launch.

This document serves as the definitive blueprint for building a seamless, multi-role PWA that bridges web, mobile, and WhatsApp to modernize school communications and marketplace interactions. All subsequent technical specs—frontend guidelines, backend architecture, app flowcharts—should align precisely with these requirements.
