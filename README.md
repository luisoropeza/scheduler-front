# Scheduler — Frontend

A React single-page application for managing healthcare providers, their availability schedules, and patient appointments.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build tool | Vite 8 |
| Routing | TanStack Router v1 (file-based) |
| Server state | TanStack Query v5 |
| Styling | Tailwind CSS v4 (Vite plugin, no config file needed) |
| Icons | Lucide React |
| State (client) | Zustand v5 |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Base URL for the REST API |

Create a `.env.local` file at the project root to override defaults:

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

## Commands

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Type-check + production build (tsc -b && vite build)
pnpm lint       # Run ESLint
pnpm preview    # Preview the production build locally
```

## Project structure

```
src/
├── api/                  # Fetch wrappers for each resource
│   ├── client.ts         # Base HTTP client (HttpError, typed request())
│   ├── providers.ts
│   ├── schedules.ts
│   └── appointments.ts
├── hooks/                # TanStack Query hooks (queries + mutations)
│   ├── providerQueries.ts
│   ├── scheduleQueries.ts
│   └── appointmentQueries.ts
├── components/
│   ├── ui/               # Generic UI primitives (Button, Badge, Input, Modal, Spinner, EmptyState)
│   ├── layout/           # App shell (Sidebar)
│   ├── providers/        # ProviderCard, ProviderForm
│   ├── schedules/        # ScheduleItem, ScheduleForm
│   └── appointments/     # AppointmentCard, AppointmentForm
├── routes/               # TanStack Router file-based routes
│   ├── __root.tsx        # Root layout (Sidebar + <Outlet />)
│   ├── index.tsx         # Redirects / → /providers
│   ├── providers/
│   │   ├── index.tsx     # Provider list
│   │   └── $providerId.tsx  # Provider detail + schedules
│   └── appointments/
│       └── index.tsx     # Appointment list
├── types/                # Shared TypeScript interfaces
│   ├── provider.ts
│   ├── schedule.ts
│   └── appointment.ts
└── main.tsx              # App entry point
```

## Domain model

**Provider** — a healthcare professional with an optional specialty, phone, and email. Can be active or inactive.

**Schedule** — a time slot (`startTime` / `endTime`) belonging to a provider. Status is either `AVAILABLE` or `BOOKED`.

**Appointment** — a booking created against an available schedule. Carries client contact details and a status of `PENDING`, `CONFIRMED`, or `CANCELLED`.

## API

All requests go through `src/api/client.ts`. The base URL is read from `VITE_API_BASE_URL` and defaults to `http://localhost:8080`. Errors are surfaced as `HttpError` instances with `status` and optional `errors` fields.

## TypeScript

- `tsconfig.app.json` enforces `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`.
- Use `verbatimModuleSyntax` — import types with `import type { … }`.

## ESLint

Flat config (`eslint.config.js`). The `@tanstack/eslint-plugin-query` package is installed — wire it in when extending lint coverage.
