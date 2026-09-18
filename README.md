# AI-BOS — AI Business Operating System

AI-BOS is a complete frontend prototype for an AI-assisted business management SaaS. It is designed for Indian small and medium-sized retailers and connects customers, products, inventory, invoices, orders, payments, analytics, notifications, subscriptions, team settings, and an AI business assistant through one consistent mock dataset.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4 with semantic light/dark design tokens
- Radix UI primitives for focus-managed dialogs, sheets, menus, selects, and tabs
- Lucide icons and Recharts
- React Hook Form with Zod validation
- Zustand for high-performance client state (drafts, scenario controls, workspace)
- TanStack Query for server state caching and background revalidation
- TanStack Table for headless, accessible data tables
- Nuqs for type-safe URL search parameter state
- Vitest and React Testing Library for fast, isolated unit and component tests

This repository is frontend-only. Most business workflows remain polished simulations backed by the shared mock dataset. Razorpay, WhatsApp, email, AI, storage, and database experiences have no real external connection or secret.

Authentication and business/team settings are integration-ready through a same-origin backend-for-frontend route. The route stores access and refresh tokens only in HTTP-only, secure production cookies; browser JavaScript never reads them. Configure `NEXT_PUBLIC_API_URL` (server-only) before using those flows. The backend remains responsible for token issuance, refresh, authorization, tenant membership, rate limiting, and audit logging.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Quality checks:

```bash
npm run type-check
npm run lint
npm run test
npm run build
# Or run all quality gates at once:
npm run check
```

Use Node.js 20.9+ (Node 20 LTS is recommended). CI runs the same checks on every pull request and push to `main`.

## Deployment prerequisites

- Set `NEXT_PUBLIC_APP_URL` to the public HTTPS application origin.
- Set `NEXT_PUBLIC_API_URL` to the HTTPS backend origin. Do not set an API URL in `NEXT_PUBLIC_*` for production.
- Configure the backend to return the documented JSON envelopes and enforce authorization and tenant isolation for every request.
- Keep all other workflow buttons in demo mode until their backend APIs, server-side validation, authorization, and audit trails are implemented.

## Application areas

- Marketing: landing, features, pricing, about, contact, privacy, and terms
- Authentication: login, registration, verification, OTP, forgot/reset password
- Onboarding: a validated five-step business setup wizard
- Business workspace: dashboard, AI assistant, customers, products, inventory, invoices, orders, payments, analytics, notifications, subscription, settings, help, and support
- Platform administration: users, businesses, subscriptions, revenue, and mock system health
- System states: offline, maintenance, permission/session/subscription expiry, AI limit, 404, and generic errors

The canonical assistant URL is `/ai-assistant`; `/assistant` remains as a permanent compatibility redirect.

## Project structure

```text
src/
  app/
    (marketing)/     public product pages
    (auth)/          authentication flows
    (onboarding)/    business setup
    (dashboard)/     authenticated business workspace
    (system)/        standalone application states
    admin/           platform-administrator portal
  components/
    ui/              accessible design-system primitives
    layout/          responsive shells and navigation
    ai/              conversational assistant
    <feature>/       domain-specific reusable components
  lib/
    mock-data/       connected business fixtures
    services/        delayed success/empty/failure mock services
  types/             shared business-domain models
```

Pages are Server Components by default. Client boundaries are used for interaction-heavy pieces such as forms, filters, builders, charts, dialogs, toasts, navigation state, and chat.

## Demo notes

- Use the state selector in the AI Assistant header to preview ready, offline, usage-limit, and failed-request experiences.
- Login accepts the normal mock path and includes controls for invalid, locked, and unverified states.
- Financial, cancellation, reminder, stock, and destructive actions show confirmations and frontend feedback.
- Mock records intentionally share IDs so customer ledgers, invoices, orders, payments, and inventory views stay consistent.
