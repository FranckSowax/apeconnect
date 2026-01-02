# Tech Stack Document

## 1. Frontend Technologies

We chose a modern, accessible and mobile-friendly setup to make the user interface fast, responsive and easy to use for parents, teachers and administrators alike.

- **Next.js 14 (App Router)**
  - Provides server-side rendering (SSR) for fast initial load and SEO benefits.
  - Supports client-side navigation for a smooth, app-like experience.
- **TypeScript**
  - Adds simple type checks to JavaScript, reducing runtime errors and improving code readability.
- **Tailwind CSS**
  - A utility-first CSS framework that speeds up styling by using pre-built classes.
  - Ensures consistent, responsive design without writing custom CSS from scratch.
- **shadcn/ui**
  - A set of accessible, pre-built React components styled with Tailwind.
  - Helps maintain a coherent look and feel while respecting accessibility standards.
- **PWA (Progressive Web App)**
  - Allows parents to “install” the platform on their phone or desktop.
  - Caches key data (like absence history) for partial offline use.
  - Delivers push-style notifications when online.

These choices combine to give a clean, fast and reliable user interface on both web and mobile.

## 2. Backend Technologies

The backend is designed to handle business logic, data storage and real-time messaging with WhatsApp.

- **Node.js**
  - Runs our server and webhooks that process incoming WhatsApp messages via Whapi.cloud.
  - Manages form submissions, bot conversations and notification triggers.
- **Supabase**
  - **PostgreSQL Database**: Stores user accounts, absence records, announcements and role permissions.
    - Row-Level Security (RLS) ensures each user sees only their own data.
  - **Auth**: Handles secure sign-up, sign-in (email/password, plus optional Google/Apple OAuth).
  - **Storage**: Keeps uploaded images or PDF justifications in encrypted buckets.
- **Webhooks & Business Logic**
  - Incoming and outgoing WhatsApp messages flow through a Node.js webhook.
  - Workflows create or update records in Supabase and trigger notifications.

Together, these components power all core features—authentication, data management, WhatsApp integration and administrative workflows.

## 3. Infrastructure and Deployment

We rely on modern hosting and deployment practices for reliability and easy scaling.

- **Vercel** (Frontend)
  - Automatically builds and deploys the Next.js PWA on every code push.
  - Provides global CDN edge caching for fast page loads worldwide.
- **Supabase** (Backend & Storage)
  - Hosted PostgreSQL database, Auth and Storage in a managed environment.
  - Handles scaling of database and file storage without manual intervention.
- **Version Control & CI/CD**
  - **GitHub** for source code management.
  - **Vercel’s integration** triggers previews and production deploys on every merge.
  - (Optional) GitHub Actions can run tests or lint checks before deployment.

This setup ensures continuous delivery, minimal downtime and effortless scaling as usage grows.

## 4. Third-Party Integrations

To add specialized capabilities quickly, we integrate best-in-class services:

- **Whapi.cloud (WhatsApp Gateway)**
  - Sends notifications and runs a conversational bot for absence reports or ad posting.
  - Manages message templates, media (photos/PDFs) and delivers real-time updates.
- **GPT-4o**
  - Assists in moderating shop listings by flagging inappropriate or incomplete content automatically.
  - Provides optional writing assistance when parents create or refine listings.
- **OAuth Providers**
  - Google and Apple sign-in (via Supabase Auth) for users who prefer social login.
- **Mobile Money (future)**
  - Planned integration to notify parents of transaction statuses once in-app payments are supported.

These services enrich the core platform without the need to build complex features from scratch.

## 5. Security and Performance Considerations

We’ve applied multiple layers of protection and optimization to keep data safe and the UI snappy:

- **Authentication & Authorization**
  - Supabase Auth with encrypted tokens, optional OAuth flows.
  - Row-Level Security in PostgreSQL ensures role-based data access (parents, teachers, censeur, super-admin).
- **Data Protection**
  - All sensitive data is encrypted at rest (database and file storage).
  - HTTPS everywhere via Vercel and Supabase endpoints.
- **Rate Limiting & Quotas**
  - Whapi.cloud message quotas are monitored to handle 500–800 messages/day per establishment.
  - Node.js webhooks include basic throttling to prevent abuse.
- **Performance Optimizations**
  - Next.js image optimization, code splitting and caching of static assets.
  - PWA caching strategies for offline read-only views of absence history and listings.
  - Tailwind’s small generated CSS footprint.

These measures guarantee a smooth experience even under load and maintain high trust with our users.

## 6. Conclusion and Overall Tech Stack Summary

In summary, our platform combines a **Next.js & TypeScript** frontend with **Node.js** and **Supabase** on the backend, all deployed seamlessly on **Vercel**. We leverage **Whapi.cloud** for WhatsApp messaging and plan to use **GPT-4o** to automate moderation.

Key benefits:
- **User-friendly interface** across web and mobile (PWA).
- **Secure, role-based access** with Supabase Auth and RLS.
- **Real-time communication** via WhatsApp for fast notifications.
- **Scalable, managed hosting** requiring minimal DevOps overhead.

This technology mix aligns perfectly with our goals: make school-home communication modern, interactive and reliable, while keeping administration simple and secure.