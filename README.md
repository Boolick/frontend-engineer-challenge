# Orbitto Auth Frontend (Atlantis Engineer Challenge)

Production-ready Authentication Frontend built with **Next.js 15**, **FSD**, **XState**, and **Tailwind v4**.

## 🚀 Architecture: Feature-Sliced Design (FSD)
The project follows a strict FSD structure to ensure scalability and clear boundaries:
- **app**: Next.js App Router, global styles, and providers.
- **pages**: Full-page assemblies.
- **widgets**: Complex UI blocks (e.g., `LoginForm`, `RegisterForm`).
- **features**: User-facing actions (e.g., `useAuth` hook).
- **entities**: Domain logic and business models (e.g., `authMachine`, Zod schemas).
- **shared**: Reusable UI Kit, API clients, and utilities.

## 🧠 State Management: XState v5
Authentication is a complex state machine, not just a set of booleans. We use XState to handle:
- **Rate Limiting (429)**: Automatic transition to a `rateLimited` state with a countdown timer.
- **BFF Integration**: Orchestrating requests between the client and Next.js Route Handlers.
- **Predictable Transitions**: Ensuring the UI never enters an invalid state (e.g., submitting while already authenticated).

## 🔒 Security: BFF (Backend For Frontend)
To protect user sessions, we implemented a BFF pattern:
- **HttpOnly Cookies**: Access and Refresh tokens are stored in secure, HttpOnly cookies. They are inaccessible to client-side JavaScript, mitigating XSS risks.
- **Proxying**: The Next.js Route Handlers (`/api/auth/*`) act as a secure proxy to the Go-based backend.
- **Middleware Protection**: Route protection is handled server-side in `middleware.ts`.

## 🎨 UI/UX Decisions
- **Tailwind v4**: Leveraging the latest CSS-first configuration for design tokens.
- **Motion (Framer Motion)**: Used for the "Floating Label" input effect and smooth page transitions.
- **Accessibility**: Semantic HTML and focus management for all forms.

## 🛠️ Trade-offs & Assumptions
- **Backend Mocking**: Since the external Go backend might be offline, the `useAuth` hook is designed to handle real API responses but can be easily extended with MSW for local development.
- **Refresh Token Rotation**: Assumed the backend supports rotation; the BFF layer is ready to handle refresh logic in the middleware or a dedicated route.

## 📦 Next Steps for Production
1. **Internationalization (i18n)**: Implement `next-intl` for multi-language support.
2. **E2E Testing**: Add Playwright tests for the full auth flow.
3. **Observability**: Integrate Sentry for error tracking and OpenTelemetry for performance monitoring.
