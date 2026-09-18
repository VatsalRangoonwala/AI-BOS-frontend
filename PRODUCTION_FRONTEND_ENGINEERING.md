# Production-Grade Next.js Frontend Engineering Rules

## Purpose

This document defines the engineering standards that the frontend agent must follow whenever it:

- Builds a new frontend feature
- Creates or modifies Next.js pages/layouts
- Creates React components
- Wires frontend APIs
- Implements forms
- Handles authentication or authorization UI
- Adds client/server state
- Integrates third-party services
- Fixes frontend bugs
- Refactors frontend code
- Improves performance
- Adds tests
- Changes frontend architecture
- Performs any other frontend-related work

The goal is to produce a **production-grade, maintainable, secure, accessible, performant, and scalable Next.js application**, not merely code that works locally.

---

# 1. Core Engineering Principles

Always prioritize, in this order:

1. Correctness
2. Security
3. Maintainability
4. Simplicity
5. Performance
6. Accessibility
7. Developer experience

Do not introduce complexity without a real requirement.

Before adding a library, ask:

- Does Next.js already provide this?
- Does React already provide this?
- Can a small local abstraction solve it?
- Does the project already have an established solution?
- Is the dependency actively maintained?
- Does it meaningfully improve the architecture?

Avoid dependency duplication.

For example, do not introduce Axios if the project already has a robust `fetch` abstraction unless there is a concrete reason.

---

# 2. First Inspect the Existing Project

Before making changes:

1. Inspect the existing directory structure.
2. Inspect `package.json`.
3. Inspect `tsconfig.json`.
4. Inspect Next.js configuration.
5. Inspect existing UI components.
6. Inspect existing API/client abstractions.
7. Inspect authentication/session handling.
8. Inspect state management.
9. Inspect validation schemas.
10. Inspect error/loading patterns.
11. Inspect tests.
12. Inspect environment variable usage.
13. Inspect existing conventions.

Do **not** create a parallel architecture when an established project architecture already exists.

Reuse existing abstractions when they are correct.

If an existing abstraction is flawed, improve it deliberately rather than silently creating another competing abstraction.

---

# 3. Preferred Technology Stack

Use the following technologies where appropriate.

## Core

- Next.js
- App Router
- TypeScript
- React
- Tailwind CSS

## UI

- shadcn/ui
- Radix UI where needed
- Lucide React for icons

## Forms

- React Hook Form
- Zod

## Server State

- Native Next.js/React server-side data fetching by default
- TanStack Query when substantial client-side server-state management is actually required

## Client State

- Local React state by default
- Zustand for genuinely shared client state when needed

Do not introduce Redux automatically.

## Tables

- TanStack Table for complex data tables

## URL State

- URL/search parameters
- `nuqs` when URL-state management becomes sufficiently complex

## Testing

- Vitest
- React Testing Library
- Playwright

## Quality

- ESLint
- Prettier
- TypeScript strict mode

## Monitoring

- Sentry or the project's existing error-monitoring solution
- PostHog or the project's existing analytics solution when product analytics is required

## CI/CD

- GitHub
- GitHub Actions

Use project-existing tools when they differ, unless there is a concrete reason to migrate.

---

# 4. Next.js Architecture

Use the App Router.

Prefer this mental model:

```text
Server Component
    |
    +-- Server data fetching
    |
    +-- Authentication checks
    |
    +-- Authorization checks
    |
    +-- Static/SEO content
    |
    +-- Client Component only where interaction requires it
```

## Server Components by Default

Prefer Server Components for:

- Data fetching
- SEO content
- Server-side authentication checks
- Server-side authorization checks
- Database access through trusted server code
- Static content
- Server-side computation

Do not add:

```tsx
"use client";
```

unless the component genuinely requires client-side behavior.

## Client Components

Use Client Components for:

- `useState`
- `useEffect` when genuinely required
- Browser APIs
- Interactive forms
- WebSocket/subscription behavior
- Client-only third-party libraries
- Complex interactive UI
- Client-side state

Do not make an entire page client-side merely because one small component needs interaction.

Prefer:

```text
Server Page
├── Server Content
├── Server Data
└── Client Interactive Component
```

---

# 5. Avoid Unnecessary `useEffect`

Do not use `useEffect` as a default data-fetching mechanism.

Avoid:

```tsx
useEffect(() => {
  fetchUsers();
}, []);
```

when the data can be fetched through the server.

Prefer server-side data fetching where appropriate.

Use `useEffect` for synchronization with external systems, such as:

- Browser APIs
- Event listeners
- WebSocket subscriptions
- External libraries
- Timers where actually required

Do not use effects to derive values that can be calculated directly during rendering.

---

# 6. Feature-Oriented Architecture

For applications of meaningful size, organize code by feature/domain.

Example:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── forms/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── users/
│   ├── orders/
│   └── payments/
│
├── lib/
│   ├── api/
│   ├── auth/
│   ├── validation/
│   └── utils/
│
├── hooks/
├── types/
├── constants/
├── config/
└── styles/
```

Do not create giant generic folders containing unrelated business logic.

---

# 7. Keep Business Logic Out of UI

Components should primarily handle:

- Rendering
- User interaction
- Presentation
- UI state

Business logic should live in appropriate feature/service/domain abstractions.

Avoid components containing hundreds of lines of:

- API logic
- business calculations
- permission rules
- data transformation
- validation logic
- unrelated state

Prefer:

```text
Component
   |
   +-- Hook / Action
          |
          +-- Service
                 |
                 +-- API
```

Business logic must be independently testable whenever practical.

---

# 8. Component Design

Build components around clear responsibilities.

Prefer small, composable components over giant components.

Example:

```text
DashboardPage
├── DashboardHeader
├── StatsGrid
│   └── StatCard
├── RecentOrders
│   └── OrderTable
└── ActivityFeed
```

Avoid:

```text
DashboardPage.tsx
    1500 lines
    authentication
    API calls
    calculations
    forms
    tables
    modals
    permissions
    everything
```

---

# 9. Reusable UI Primitives

Create and reuse common UI primitives.

Examples:

```text
Button
Input
Select
Textarea
Modal/Dialog
Dropdown
Popover
Tooltip
Badge
Card
Table
Skeleton
Spinner
EmptyState
ErrorState
```

Do not duplicate the same UI pattern throughout the application.

Before creating a new primitive, search the existing component library.

Do not create duplicate `Button`, `Modal`, or `Input` implementations.

---

# 10. Design System

Maintain consistent:

- Typography
- Spacing
- Colors
- Border radius
- Shadows
- Breakpoints
- Component variants
- Focus states
- Dark mode behavior
- Disabled states
- Loading states
- Error states

Avoid arbitrary styling decisions that make different pages look like different products.

Use design tokens and shared component variants where practical.

---

# 11. TypeScript Standards

Use strict TypeScript.

Prefer:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Avoid `any`.

If data is genuinely unknown, prefer `unknown` and validate/narrow it.

Avoid unnecessary type assertions:

```ts
const user = response.data as User;
```

Do not use type assertions to hide API/schema problems.

Types should reflect real contracts.

Prefer discriminated unions for state machines where appropriate.

Example:

```ts
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; message: string };
```

---

# 12. API Architecture

Do not scatter raw API calls throughout UI components.

Create a clear API layer.

Example:

```text
src/lib/api/
├── client.ts
├── auth.ts
├── users.ts
├── orders.ts
└── products.ts
```

Or keep API services inside their feature when appropriate.

Example:

```ts
getUsers()
getUser(id)
createUser(input)
updateUser(id, input)
deleteUser(id)
```

Components should not need to understand:

- Base URLs
- Headers
- Authentication transport
- Retry behavior
- Error normalization
- Response parsing

unless the component genuinely owns that behavior.

---

# 13. API Client Rules

Create one consistent API client abstraction.

It should centralize, where appropriate:

- Base URL
- Credentials
- Headers
- JSON parsing
- Error normalization
- Request IDs/correlation IDs
- Retry policy where safe
- Timeouts/abort signals where appropriate

Do not blindly retry mutations.

Do not retry requests that may cause duplicate side effects unless the API is designed to be idempotent.

---

# 14. API Response Validation

Never assume external data is correct merely because TypeScript says it is.

TypeScript provides compile-time guarantees, not runtime validation.

Validate untrusted/external data where appropriate using Zod or the project's existing schema system.

Example:

```ts
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
});
```

Validate especially when consuming:

- Third-party APIs
- External services
- Untrusted JSON
- Webhook payloads
- Unstable backend contracts

---

# 15. Forms

Use React Hook Form for complex forms.

Use Zod for validation.

Preferred pattern:

```text
Form
 |
 +-- React Hook Form
 |
 +-- Zod schema
 |
 +-- API/service
```

Validation should provide useful user feedback.

Handle:

- Required fields
- Format errors
- Server validation errors
- Loading/submission state
- Disabled submit state
- Success state
- Retry behavior

Never rely on frontend validation for security.

Backend validation remains mandatory.

---

# 16. Server State vs Client State

Do not put all application state into global state.

Use the smallest appropriate state scope.

## Local UI State

Use React state for:

- Modal open/close
- Dropdown state
- Tabs
- Temporary UI state
- Local form state

## URL State

Use URL/search parameters for state that should be:

- Shareable
- Bookmarkable
- Preserved on refresh
- Compatible with browser back/forward

Examples:

```text
?page=2
?search=phone
?status=active
?sort=createdAt
```

## Server State

Use Next.js server-side fetching by default where appropriate.

Use TanStack Query when the application genuinely needs client-side server-state features such as:

- Client caching
- Background refetching
- Mutations
- Infinite queries
- Complex client-side synchronization

Do not use both Next.js server fetching and TanStack Query for the same data without a clear reason.

## Global Client State

Use Zustand only for genuinely shared client state.

Do not use global state as a replacement for server state.

---

# 17. Authentication

Authentication architecture must be explicit.

Authentication answers:

> Who is the user?

Authorization answers:

> What can the user do?

Never confuse the two.

For cookie-based sessions, prefer secure cookie properties appropriate to the deployment:

```text
HttpOnly
Secure
SameSite
appropriate expiration
```

Never expose sensitive authentication secrets to client JavaScript.

Avoid storing sensitive tokens in `localStorage` unless there is a deliberate, documented architecture requiring it.

---

# 18. Authorization

Frontend authorization is primarily a UX concern.

The backend must enforce actual authorization.

Frontend may hide:

```text
Delete button
Admin menu
Billing page
```

but this is not security.

Correct architecture:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Resource ownership / tenant check
  ↓
Business operation
```

Never assume:

```text
if (user.role === "admin")
```

on the frontend is sufficient to secure an operation.

---

# 19. Multi-Tenant Applications

If the application is multi-tenant:

- Never trust tenant IDs supplied by the client.
- Do not rely solely on URL parameters for tenant authorization.
- Always verify membership/permissions server-side.
- Keep tenant context explicit.
- Ensure API calls cannot cross tenant boundaries.
- Ensure UI state cannot accidentally display data from another tenant.
- Be careful with caches: tenant/user identity must be part of relevant cache keys.

Example:

```text
Request
 ↓
Authenticated User
 ↓
Resolve Tenant Membership
 ↓
Check Permission
 ↓
Check Resource Ownership
 ↓
Fetch Tenant-Scoped Data
```

---

# 20. Loading States

Every asynchronous UI should have an intentional loading state where appropriate.

Use:

```text
loading.tsx
Suspense
Skeletons
pending states
```

Avoid blank screens.

Good loading UI communicates what is happening.

For data tables:

```text
Loading:
[ skeleton row ]
[ skeleton row ]
[ skeleton row ]
```

---

# 21. Error Handling

Every important operation should have an error path.

Handle:

- Network failure
- Authentication failure
- Authorization failure
- Validation failure
- Not found
- Server failure
- Timeout
- Unexpected response

Use Next.js error boundaries appropriately:

```text
error.tsx
not-found.tsx
loading.tsx
```

Do not expose internal implementation details to users.

Bad:

```text
PostgreSQL connection failed at 10.0.0.5:5432
```

Good:

```text
Something went wrong while loading your orders.
Please try again.
```

Log technical details securely for developers.

---

# 22. Empty States

Do not treat empty data as an error.

Examples:

```text
No users found.
No orders yet.
No notifications.
No search results.
```

Provide useful next actions where appropriate.

---

# 23. Accessibility

Accessibility is a first-class requirement.

Always consider:

- Semantic HTML
- Keyboard navigation
- Focus management
- Visible focus states
- Labels
- Accessible error messages
- Color contrast
- Screen-reader behavior
- Modal focus trapping
- Escape-key behavior
- Proper button/link semantics

Prefer:

```html
<button>Delete</button>
```

over:

```html
<div onClick={deleteItem}>Delete</div>
```

Do not add ARIA attributes unnecessarily when native HTML semantics already solve the problem.

---

# 24. Performance

Performance must be considered during implementation.

Avoid:

- Huge client bundles
- Unnecessary client components
- Unnecessary dependencies
- Fetching excessive data
- Rendering thousands of DOM nodes unnecessarily
- Unoptimized images
- Unnecessary re-renders
- Duplicate API requests

Use:

- Server Components where appropriate
- Code splitting
- Dynamic imports where justified
- Next/Image
- Pagination
- Virtualization for genuinely large lists
- Caching/revalidation
- Streaming/Suspense where useful

Do not prematurely optimize.

Measure first when optimization is non-obvious.

---

# 25. Data Fetching and Caching

For every API/data source, determine:

> How fresh does this data need to be?

Examples:

```text
Marketing content
→ highly cacheable

Product catalog
→ cache/revalidate as appropriate

User dashboard
→ dynamic or appropriately cached

Account balance
→ freshness is critical

Real-time chat
→ realtime transport
```

Do not make everything `no-store`.

Do not cache everything blindly.

Cache keys must include all relevant identity/context.

Be particularly careful with:

- User-specific data
- Tenant-specific data
- Permission-sensitive data

Never allow cached private data to leak across users or tenants.

---

# 26. Pagination

Never fetch an unlimited dataset just because the API allows it.

Use:

- Offset pagination when appropriate
- Cursor pagination for large/changing datasets where appropriate
- Server-side filtering
- Server-side sorting

Example:

```text
/users?page=2&limit=25
```

or:

```text
/users?cursor=abc123&limit=25
```

The UI should not download thousands of records just to display 25.

---

# 27. Search and Filtering

For large datasets:

```text
Browser
  ↓
Search/filter parameters
  ↓
Backend
  ↓
Database query
  ↓
Paginated response
```

Do not fetch the entire database into the browser and filter it with JavaScript.

Debounce user-entered search where appropriate.

---

# 28. Security

Treat the browser as an untrusted environment.

Follow:

- Secure cookies
- CSP where appropriate
- Secure headers
- Input validation
- Output safety
- Authorization
- Rate limiting on server/API
- File upload validation
- Dependency scanning
- Secret management
- Audit logging for security-sensitive operations

Never put:

```text
DATABASE_URL
JWT_SECRET
PRIVATE_API_KEY
STRIPE_SECRET_KEY
```

in client-accessible environment variables.

Be extremely careful with:

```text
NEXT_PUBLIC_*
```

These values are intended to be exposed to the browser.

---

# 29. File Uploads

For file uploads, validate:

- File size
- MIME type
- Extension
- Content where appropriate
- Upload destination
- User permission
- Tenant ownership

Do not trust the filename or client-provided MIME type.

Prefer direct-to-object-storage uploads using signed URLs when appropriate for large files.

---

# 30. Secrets and Environment Variables

Never commit secrets.

Maintain:

```text
.env.example
```

with variable names but no secret values.

Example:

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
AUTH_SECRET=
```

Separate environments where appropriate:

```text
development
staging
production
```

Do not hardcode environment-specific URLs or credentials.

---

# 31. SEO

For public pages, use Next.js metadata capabilities.

Consider:

- Title
- Description
- Canonical URL
- Open Graph
- Social metadata
- Sitemap
- Robots
- Structured data where appropriate

Do not spend SEO effort on private application pages where indexing is not relevant.

---

# 32. Images and Fonts

Use Next.js image capabilities appropriately.

Always provide meaningful `alt` text for informative images.

For decorative images, use appropriate accessibility behavior.

Avoid loading unnecessary image sizes or font weights.

Do not ship huge original images when a smaller optimized asset is sufficient.

---

# 33. Testing Strategy

Use the right test level for the problem.

## Unit Tests

Use Vitest for:

- Business logic
- Utility functions
- Data transformations
- Validation logic

## Component Tests

Use React Testing Library for:

- Form behavior
- User interactions
- UI states
- Accessibility behavior

Test what the user experiences rather than implementation details.

## E2E Tests

Use Playwright for critical flows:

```text
Login
Registration
Checkout
Create resource
Edit resource
Delete resource
Permission boundaries
Important business workflows
```

Do not attempt to E2E-test every tiny component.

---

# 34. Error Monitoring

Production applications need visibility.

Use Sentry or the project's established equivalent for:

- Runtime errors
- Unhandled exceptions
- Failed requests where appropriate
- Release tracking
- Performance issues

Do not log sensitive information.

Never send:

- Passwords
- Access tokens
- Refresh tokens
- Secret keys
- Sensitive personal information

to client analytics or error-monitoring systems.

---

# 35. Analytics

If product analytics are required, use the project's approved analytics system.

Track meaningful product events such as:

```text
user_signed_up
project_created
order_created
subscription_started
```

Do not add arbitrary tracking everywhere.

Avoid collecting sensitive information unnecessarily.

---

# 36. Git and Commits

Use focused commits.

Prefer:

```text
feat: add user pagination
fix: prevent duplicate order submission
refactor: centralize API error handling
test: add checkout flow coverage
docs: update frontend setup
```

Avoid:

```text
update stuff
changes
final
fix everything
```

Do not mix unrelated refactors with feature implementation unless necessary.

---

# 37. Code Review Checklist

Before considering a frontend change complete, review:

## Correctness

- Does it satisfy the requirement?
- Does it work for success and failure cases?
- Are edge cases handled?

## Architecture

- Is the Server/Client boundary correct?
- Is logic in the correct layer?
- Is state scoped correctly?
- Is duplication avoided?

## API

- Is the API contract correct?
- Are errors handled?
- Is response data validated where needed?
- Are loading states handled?
- Is caching appropriate?

## Security

- Are permissions enforced server-side?
- Are secrets protected?
- Is user/tenant data isolated?
- Is untrusted input handled safely?

## Performance

- Is unnecessary client JavaScript avoided?
- Is data fetching efficient?
- Is pagination used?
- Are unnecessary re-renders avoided?

## Accessibility

- Is the UI keyboard accessible?
- Are labels and semantics correct?
- Are errors accessible?
- Is focus behavior correct?

## Testing

- Is important business logic tested?
- Are important user flows covered?
- Are regressions prevented?

---

# 38. Avoid Common Anti-Patterns

Do not:

- Make everything `"use client"`
- Put everything into Zustand
- Use `useEffect` for all data fetching
- Put API calls directly into dozens of components
- Store sensitive tokens in localStorage without a deliberate security architecture
- Trust frontend authorization
- Fetch entire datasets unnecessarily
- Use `any` everywhere
- Duplicate UI components
- Duplicate API clients
- Create multiple competing state-management solutions
- Install libraries without a real need
- Ignore loading/error/empty states
- Ignore accessibility
- Expose backend/internal errors to users
- Hardcode secrets
- Hardcode environment-specific URLs
- Make giant components
- Over-engineer small features
- Perform large unrelated refactors while implementing a feature

---

# 39. Definition of Done

A frontend feature is not "done" merely because the happy path works.

Before declaring it complete, verify:

```text
[ ] Requirement implemented
[ ] Server/Client boundary reviewed
[ ] TypeScript passes
[ ] ESLint passes
[ ] Formatting passes
[ ] API integration verified
[ ] Loading state handled
[ ] Error state handled
[ ] Empty state handled where applicable
[ ] Validation implemented
[ ] Authorization assumptions verified
[ ] Security reviewed
[ ] Responsive behavior checked
[ ] Accessibility checked
[ ] Performance considered
[ ] Tests added/updated where appropriate
[ ] No secrets exposed
[ ] No unnecessary dependencies added
[ ] Existing architecture reused
[ ] No unnecessary duplication introduced
```

---

# 40. Workflow the Agent Must Follow

For every meaningful frontend task:

## Step 1 — Understand

Read the requirement carefully.

Identify:

- User flow
- Data requirements
- API requirements
- Authentication requirements
- Authorization requirements
- UI requirements
- Error cases
- Loading states
- Empty states
- Responsive requirements
- Accessibility requirements

## Step 2 — Inspect

Inspect the existing implementation before changing it.

Find:

- Existing components
- Existing hooks
- Existing API client
- Existing schemas
- Existing state
- Existing types
- Existing auth utilities
- Existing design system

## Step 3 — Plan

Choose:

- Server vs Client Components
- Component boundaries
- State location
- API integration approach
- Validation
- Error handling
- Caching/revalidation
- Testing strategy

Do not code immediately for complex tasks.

## Step 4 — Implement

Implement using existing project conventions.

Prefer small, composable changes.

## Step 5 — Verify

Check:

```text
TypeScript
ESLint
Tests
Build
API behavior
Responsive UI
Accessibility
Security
```

## Step 6 — Review

Ask:

> Would this still be easy to maintain if the application became 10x larger?

If not, improve the design.

---

# 41. Decision Rules

When multiple approaches are possible, use these defaults.

### Server vs Client

```text
Can it run on the server?
        |
       YES
        ↓
Prefer Server Component

Needs browser interaction?
        |
       YES
        ↓
Use Client Component
```

### State

```text
Only one component?
→ Local state

Shareable/bookmarkable?
→ URL state

Comes from backend?
→ Server state

Complex client-only shared state?
→ Zustand when justified
```

### Data Fetching

```text
Server-rendered data?
→ Next.js server-side fetching

Complex client-side synchronization?
→ TanStack Query when justified

Real-time data?
→ WebSocket/SSE/realtime mechanism
```

### Forms

```text
Simple form
→ native React/HTML may be enough

Complex form
→ React Hook Form + Zod
```

### UI

```text
Existing component?
→ Reuse it

Similar component exists?
→ Extend/reuse it

Repeated primitive?
→ Create shared primitive
```

---

# 42. Production Mindset

The agent must not optimize only for:

> "Make the feature work."

It must optimize for:

> "Make the feature work correctly, securely, accessibly, efficiently, and in a way that the next engineer can maintain."

Always think about:

```text
Today
 ↓
Next month
 ↓
Next year
 ↓
10x traffic
 ↓
More developers
 ↓
More features
```

Do not over-engineer prematurely, but do not knowingly create technical debt when a clean solution is reasonably simple.

---

# 43. Final Rule

When making frontend changes, always prefer:

```text
Existing correct abstraction
        ↓
Small reusable abstraction
        ↓
Feature-level abstraction
        ↓
New dependency only when justified
```

And always remember:

> **Use Next.js and React capabilities first. Add libraries only when they solve real complexity. Keep the Server/Client boundary intentional. Keep business logic out of UI. Treat the browser as untrusted. Make APIs, state, validation, errors, security, accessibility, testing, and performance first-class parts of the implementation.**
