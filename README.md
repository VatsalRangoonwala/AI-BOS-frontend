# AI-BOS — AI Business Operating System

AI-BOS is a complete frontend prototype for an AI-assisted business management SaaS. It is designed for Indian small and medium-sized retailers and connects customers, products, inventory, invoices, orders, payments, analytics, notifications, subscriptions, team settings, and an AI business assistant through one consistent mock dataset.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4 with semantic light/dark design tokens
- Radix UI primitives for focus-managed dialogs, sheets, menus, selects, and tabs
- Lucide icons and Recharts
- React Hook Form with Zod validation

This repository is frontend-only. Razorpay, WhatsApp, email, AI, authentication, storage, and database experiences are polished simulations with no real external connection or secret.

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
npm run build
```

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
