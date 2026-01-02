# Frontend Guideline Document

This document explains how our frontend is built and why, using simple everyday language. Anyone reading it should understand how the pieces fit together, why they were chosen, and how to work with them.

## 1. Frontend Architecture

### Overview

We’re using Next.js 14 with the App Router as our main framework. It’s built on React and uses TypeScript for type safety. Tailwind CSS handles styling, and we layer in components from shadcn/ui. To make it a Progressive Web App (PWA), we add offline support and installable behavior.

### Key Libraries & Tools

*   **Next.js 14 (App Router)**: Server- and client-side rendering, file-based routing, built-in optimizations.
*   **TypeScript**: Catches errors early and makes code easier to understand.
*   **Tailwind CSS**: Utility-first styling—fast to write and easy to customize.
*   **shadcn/ui**: Prebuilt, accessible components that work with Tailwind.
*   **next-pwa** (or equivalent): Turns our site into a PWA for offline use.

### Why This Architecture?

*   **Scalability**: Next.js scales from small prototypes to large apps. The App Router lets us split code by folder and page.
*   **Maintainability**: TypeScript and a clear folder structure keep code organized and self-documenting.
*   **Performance**: Next.js handles code splitting, image optimization, and caching out of the box. Tailwind’s small runtime and PWA features further boost speed.

## 2. Design Principles

### Usability

We prioritize clear layouts, simple workflows, and meaningful feedback. Forms have clear labels and error messages. Buttons have consistent placement and behavior.

### Accessibility

*   Use semantic HTML (e.g., `<nav>`, `<main>`, `<button>`).
*   Ensure all interactive elements have proper ARIA roles and labels.
*   Contrast ratios meet WCAG 2.1 AA standards.
*   Keyboard navigation is fully supported.

### Responsiveness

Every screen works smoothly on phones, tablets, and desktops. We use Tailwind’s responsive utilities (`sm:`, `md:`, `lg:`) to adjust layouts and font sizes.

## 3. Styling and Theming

### CSS Methodology

We use **Tailwind CSS** exclusively—no separate SASS or BEM files. Tailwind’s utility classes keep styles co-located with markup and easy to maintain.

### Theming

*   **Global Theme**: Defined in `tailwind.config.js`.
*   **Dark/Light Mode**: Controlled by the user’s OS setting or a toggle saved in local storage.
*   **Colors & Fonts**: Extended in Tailwind config for consistency across components.

### Visual Style

*   **Overall Look**: Modern flat design with subtle glassmorphism touches (semi-transparent cards with gentle blur).

*   **Color Palette**:

    *   Primary: #2563EB (Blue 600)
    *   Secondary: #9333EA (Purple 600)
    *   Accent: #F59E0B (Amber 500)
    *   Neutral Background: #F3F4F6 (Gray 100)
    *   Text Primary: #111827 (Gray 900)
    *   Text Secondary: #4B5563 (Gray 600)

*   **Font**: Inter (system-fallback: `ui-sans-serif, system-ui`). Clean and highly readable.

## 4. Component Structure

### Folder Layout

`/app # Next.js App Router entry points /components # Reusable UI bits (buttons, cards, dialogs) /modules # Feature folders (connect, shop, dashboard) /connect # Absence module /shop # Marketplace module /ui # shadcn/ui overrides and theming /lib # Helpers (API clients, hooks) /public # Static assets (icons, images)`

### Reuse & Composition

*   Build small, single-purpose components (e.g., `<Avatar>`, `<Modal>`, `<FormInput>`).
*   Compose them in module-specific containers (e.g., `<ConnectRequestList>` uses `<Card>` and `<Badge>`).
*   Override default shadcn/ui styles in `/ui` when necessary.

### Benefits

*   **Maintainability**: Updates in one component apply everywhere it’s used.
*   **Consistency**: Shared components enforce a unified look and behavior.
*   **Onboarding**: New developers quickly understand where to find or add code.

## 5. State Management

### Approach

We rely mostly on React’s built-in state and server data fetching. For shared client state (e.g., current school, theme toggle), we use React Context.

### Data Fetching

*   **Server Components**: Fetch data in Next.js Server Components where possible.
*   **Client Components**: Use SWR or React Query for caching, revalidation, and optimistic updates (e.g., posting an absence report).

### Contexts

*   **AuthContext**: Holds user session and role (Parent, Teacher, Admin, etc.).
*   **EstablishmentContext**: Stores the selected school ID for multi–establishment support.

This mix ensures real-time data where needed and minimal client bundle size.

## 6. Routing and Navigation

### Next.js App Router

*   **File-based Routing**: Pages live under `/app`.
*   **Layouts**: Shared layout files (`layout.tsx`) wrap pages in nav bars, sidebars, or footers.
*   **Dynamic Routes**: For multi-establishment and module routes (e.g., `/[schoolId]/connect`).

### Navigation Structure

*   **Public**: Landing, About, Onboarding.
*   **Protected** (after login): Dashboard, Connect, Shop, Admin.
*   Role-based menu items rendered based on `AuthContext.role`.

### Client-Side Transitions

We use Next.js’ built-in `<Link>` and `useRouter` to navigate. Prefetching is enabled for anticipated routes.

## 7. Performance Optimization

### Code Splitting & Lazy Loading

*   Next.js automatically splits by page.
*   We use dynamic imports for large, rarely used components (e.g., admin charts).

### Asset Optimization

*   **next/image**: Automatic image resizing and WebP conversion.
*   **SVGs**: Inlined via React components or served from `/public`.

### Caching & CDN

*   Deploy on Vercel for edge caching of static assets.
*   API responses use `Cache-Control` headers where safe.

### PWA Strategies

*   Precaching of critical JS/CSS.
*   Runtime caching for API responses (recent absences, shop listings) so users have partial offline access.

## 8. Testing and Quality Assurance

### Unit Tests

*   **Jest** + **React Testing Library** for components and utility functions.
*   Aim for 80% coverage on core modules (connect & shop).

### Integration Tests

*   Test multi-step flows (e.g., absence report form → submission → list update).
*   Use RTL’s `render` with `Mock Service Worker` (MSW) to stub Supabase and WhatsApp APIs.

### End-to-End Tests

*   **Cypress** for critical user journeys:

    *   Onboarding and login.
    *   Absence reporting and admin approval.
    *   Posting and browsing in shop module.

### Linting & Formatting

*   **ESLint** with TypeScript and Next.js rules.
*   **Prettier** for consistent code formatting.
*   **Tailwind Lint** plugin to ensure only configured classes are used.

## 9. Conclusion and Overall Frontend Summary

We have built a clear, modern, and scalable frontend using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Our architecture supports multi-establishment workflows, offline use as a PWA, and rapid development thanks to utility-first styling and reusable components. By following these guidelines—focusing on simplicity, consistency, and performance—any developer can step in and understand how to add features, fix bugs, and maintain a top-quality user experience.

Key takeaways:

*   File-based routing and server components make data fetching straightforward.
*   Tailwind and shadcn/ui speed up UI work without sacrificing custom branding.
*   Testing at all levels ensures users can reliably report absences, post shop items, and receive WhatsApp notifications.

This setup gives us a solid foundation for future enhancements, like mobile money integration, while keeping the codebase easy to navigate and evolve.
