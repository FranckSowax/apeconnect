# Backend Structure Document

This document outlines the backend setup for the school communication platform. It describes how the system is built, how data is stored and accessed, how the different parts talk to each other, and how we keep everything secure, reliable, and scalable.

## 1. Backend Architecture

**Overview**
- The backend is split into small, focused services (often called microservices or modules). Each handles one area of responsibility:
  - **Authentication & User Management**
  - **Absence Management**
  - **Textbook Marketplace (Shop)**
  - **WhatsApp Webhook Handling**
  - **Admin Dashboard Services**
- We use Node.js with TypeScript for custom logic, hosted as serverless functions. Many routines are also handled by Supabase Edge Functions.
- RESTful APIs connect the frontend and backend. Webhooks manage incoming WhatsApp events.

**Design Patterns & Frameworks**
- **Layered (N-Tier) Architecture**:
  1. API Layer: HTTP endpoints (Next.js API routes or Supabase Edge Functions)
  2. Service Layer: Business logic (absence reporting, ad moderation, notifications)
  3. Data Access Layer: Queries to Supabase PostgreSQL and Storage
- **Observer Pattern** for event-driven flows (e.g., when an absence is reported, notify the admin and the parent via WhatsApp).
- **Strategy Pattern** for pluggable notification channels (today WhatsApp, future SMS or email).

**Scalability, Maintainability, Performance**
- Serverless functions auto-scale based on demand (Supabase and Vercel handle provisioning).
- Clear separation of modules makes it easy to update one feature without touching others.
- Caching of static assets and common queries reduces database load.
- Horizontal scaling on the database layer (read replicas) can be added when needed.

## 2. Database Management

**Technologies Used**
- Relational database: **PostgreSQL** (via Supabase)
- File storage: **Supabase Storage** (encrypted at rest)

**Data Structuring & Access**
- Tables represent core entities: users, roles, establishments, absences, ads, etc.
- Row-Level Security (RLS) rules enforce data isolation per user role and per establishment.
- Supabase Auth issues JWT tokens. Every API request must include a valid token.
- Files (justifications, ad photos) are stored in private buckets. URLs are signed for secure temporary access.

**Data Management Practices**
- Regular backups (daily snapshots) of the PostgreSQL database.
- Lifecycle policies on Storage buckets to archive or delete files older than a certain period.
- Database migration scripts tracked in version control (using a tool like Flyway or Supabase Migrations).

## 3. Database Schema

### Human-Readable Schema

1. **users**
   - id, email, hashed_password, role, full_name, establishment_id, created_at
2. **establishments**
   - id, name, address, created_at
3. **absences**
   - id, user_id (parent), student_name, date, reason_text, status (pending/approved/rejected), created_at, updated_at
4. **absence_justifications**
   - id, absence_id, file_path, uploaded_at
5. **ads**
   - id, user_id (seller), title, description, price, status (draft/published/rejected), created_at, updated_at
6. **ad_photos**
   - id, ad_id, file_path, uploaded_at
7. **moderation_logs**
   - id, entity_type (absence/ad), entity_id, moderator_id, action (approved/rejected), comments, created_at
8. **whatsapp_messages**
   - id, direction (inbound/outbound), payload, status, created_at

### SQL Schema (PostgreSQL)

```sql
-- users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text,
  role text NOT NULL,
  full_name text,
  establishment_id uuid REFERENCES establishments(id),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- establishments table
CREATE TABLE establishments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- absences table
CREATE TABLE absences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  student_name text NOT NULL,
  date date NOT NULL,
  reason_text text,
  status text DEFAULT 'pending',
  created_at timestamp WITH TIME ZONE DEFAULT now(),
  updated_at timestamp WITH TIME ZONE DEFAULT now()
);

-- absence_justifications table
CREATE TABLE absence_justifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  absence_id uuid REFERENCES absences(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  uploaded_at timestamp WITH TIME ZONE DEFAULT now()
);

-- ads table
CREATE TABLE ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  price numeric CHECK (price >= 0),
  status text DEFAULT 'draft',
  created_at timestamp WITH TIME ZONE DEFAULT now(),
  updated_at timestamp WITH TIME ZONE DEFAULT now()
);

-- ad_photos table
CREATE TABLE ad_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid REFERENCES ads(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  uploaded_at timestamp WITH TIME ZONE DEFAULT now()
);

-- moderation_logs table
CREATE TABLE moderation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  moderator_id uuid REFERENCES users(id),
  action text NOT NULL,
  comments text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- whatsapp_messages table
CREATE TABLE whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  direction text NOT NULL,
  payload jsonb,
  status text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);
```  

## 4. API Design and Endpoints

We follow RESTful conventions. All endpoints require a valid JWT in the `Authorization` header.

### Authentication & User Management
- POST `/api/auth/signup`
  - Create a new user (role-based signup).
- POST `/api/auth/login`
  - Email/password login, returns JWT.
- POST `/api/auth/oauth` (future)
  - Google/Apple OAuth flow.

### Absence Management
- POST `/api/absences`
  - Report a new absence (web/app).
- GET `/api/absences`  
  - List absences for the logged-in user (parent or admin).
- PATCH `/api/absences/{id}/status`
  - Admin approves or rejects an absence.
- POST `/api/absences/{id}/justification`
  - Upload justification file.

### Textbook Marketplace (Shop)
- POST `/api/ads`
  - Create a new ad (initially draft).
- GET `/api/ads`
  - Search/filter published ads.
- PATCH `/api/ads/{id}`
  - Update or publish an ad.
- DELETE `/api/ads/{id}`
  - Remove an ad.
- POST `/api/ads/{id}/photos`
  - Upload photos for an ad.
- GET `/api/ads/{id}/contact`
  - Generates "Buy via WhatsApp" chat link.

### WhatsApp Webhook Handling
- POST `/api/whatsapp/webhook`
  - Receives inbound messages from Whapi.cloud. Parses commands for absence or ad creation, stores draft, and acknowledges receipt.

### Moderation & AI Assistance
- POST `/api/moderation/ads/{id}`
  - Calls GPT-4o to do an initial content check.
- GET `/api/moderation/logs`
  - Retrieve moderation history.

### Admin Dashboard
- GET `/api/admin/statistics`
  - Overall counts and metrics by establishment.

## 5. Hosting Solutions

- **Supabase**
  - PostgreSQL database
  - Auth and RLS
  - Storage for file uploads
  - Edge Functions for serverless backend logic
- **Vercel**
  - Hosts Next.js frontend and API routes (Node.js serverless functions)
  - Built-in global CDN for static assets
- **Whapi.cloud**
  - WhatsApp messaging gateway (inbound/outbound)
- **GPT-4o (OpenAI)**
  - AI moderation service

*Benefits*:
- Automatic scaling and high availability by managed services
- Pay-as-you-go cost model
- Minimal DevOps overhead (no servers to maintain)

## 6. Infrastructure Components

- **Load Balancer & CDN**: Provided by Vercel and Supabase edge network
- **Caching**:
  - HTTP caching headers for GET endpoints
  - Client-side PWA caching for offline absence history
- **Queueing (optional future)**:
  - A lightweight message queue (e.g., Supabase Realtime or Redis) for high-volume WhatsApp notifications
- **Storage Buckets**:
  - Separate buckets for absence files and ad photos
  - Signed URL access for security

## 7. Security Measures

- **Authentication & Authorization**
  - Supabase JWT tokens
  - Role-based access control (RBAC) and Row-Level Security (RLS)
- **Data Encryption**
  - TLS for all in-transit data
  - Encryption at rest in Supabase Storage and PostgreSQL
- **Webhook Verification**
  - Validate Whapi.cloud signatures on incoming webhooks
- **Input Validation & Sanitization**
  - Strict schemas on all API inputs
- **Environment Variables**
  - Secrets (API keys, DB URLs) stored securely in Vercel/Supabase settings
- **Rate Limiting**
  - Basic throttling on critical endpoints to prevent abuse

## 8. Monitoring and Maintenance

- **Logging & Error Tracking**
  - Supabase Logs for database queries and Edge Functions
  - Vercel Analytics and logs for API routes
  - Sentry (or similar) for runtime error tracking
- **Performance Monitoring**
  - Supabase Metrics dashboard (CPU, connections, query latency)
  - Vercel Insights (response times, cold starts)
- **Backups & Disaster Recovery**
  - Daily automated database snapshots
  - Storage backups via lifecycle rules
- **Maintenance**
  - Regular dependency updates and security patching
  - Quarterly access reviews and RLS policy audits

## 9. Conclusion and Overall Backend Summary

This backend is designed to be modular, secure, and easy to maintain. By leveraging managed services (Supabase and Vercel), we achieve high reliability and scalability with minimal operational overhead. Key strengths include:

- Clear separation of concerns across services
- Strong data isolation through RLS
- Real-time, event-driven flows for WhatsApp integration
- AI-assisted moderation combined with manual review
- Future-proof design allowing for additional notification channels or payment integrations

Together, these components form a robust foundation for the school communication platform, ensuring fast development cycles and a seamless user experience for parents, teachers, and administrators.