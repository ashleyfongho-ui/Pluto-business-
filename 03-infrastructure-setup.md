# Pluto Business — Infrastructure Setup
*Step 3 of the build roadmap | July 2026*

This document covers everything that needs to exist before a single line of product code is written. Do this once, get it right, and the rest of the build is smooth.

---

## What We're Setting Up

1. GitHub repository (mono-repo)
2. Supabase project (DB + auth + storage + realtime)
3. Next.js scaffold (base app, routing, auth flow)
4. Vercel deployment (staging + production)
5. CI/CD pipeline (GitHub Actions)
6. Environment variables management
7. Development environment for Peter + Larry

---

## 1. GitHub Repository

**Repo name:** `pluto-business`
**Org:** Create a GitHub org: `pluto-business-cm` (or use Ashley's personal account for now)
**Visibility:** Private
**Branch strategy:**
- `main` → production (auto-deploys to prod)
- `develop` → staging (auto-deploys to staging)
- Feature branches: `feat/contacts-module`, `feat/whatsapp-integration`, etc.
- PR required to merge to `develop`. Ashley or Peter reviews.

**Initial repo structure:**
```
pluto-business/
├── apps/
│   └── web/                    # Next.js app (main product)
├── packages/
│   ├── db/                     # Supabase schema + migrations + generated types
│   ├── ui/                     # Shared UI components (shadcn/ui base)
│   └── config/                 # Shared TS/ESLint/Tailwind configs
├── supabase/
│   ├── migrations/             # SQL migration files
│   ├── seed.sql                # Dev seed data (fake orgs, contacts, etc.)
│   └── config.toml             # Supabase local dev config
├── .github/
│   └── workflows/
│       ├── ci.yml              # Lint + typecheck + test on every PR
│       └── deploy.yml          # Deploy on merge to develop/main
├── .env.example                # Template (never commit .env files)
└── README.md
```

**Tools:**
- Package manager: `pnpm` (monorepo workspaces)
- Node version: 20 LTS (pin with `.nvmrc`)

---

## 2. Supabase Project Setup

### Create Two Projects

| Project | Purpose | URL pattern |
|---------|---------|-------------|
| `pluto-business-dev` | Development + staging | dev.plutobusiness.cm (or Supabase default URL) |
| `pluto-business-prod` | Production | app.plutobusiness.cm |

**Steps:**
1. Go to supabase.com → New project
2. Name: `pluto-business-prod`
3. Region: `West EU (Ireland)` — closest with good latency to Cameroon for now
4. Generate a strong database password — save in 1Password/Bitwarden immediately
5. Repeat for `pluto-business-dev`

### Supabase Config (both projects)

**Auth settings:**
- Enable: Email, Phone (OTP via SMS)
- Disable: Google/Apple/etc (add later)
- SMS provider: Twilio (enter Twilio credentials)
- OTP expiry: 600 seconds (10 min)
- Site URL: `https://app.plutobusiness.cm` (prod) / `https://dev.plutobusiness.cm` (staging)

**Storage:**
- Create bucket: `invoices` (private — only org members can access)
- Create bucket: `avatars` (public — profile pictures)
- Create bucket: `imports` (private — CSV upload files, auto-delete after 24h)

**Database:**
- Enable extensions: `pgcrypto`, `uuid-ossp`, `pg_trgm` (for fuzzy search on contacts)
- Set timezone: `Africa/Douala`

### Run Migrations

All schema lives in `/supabase/migrations/`. Naming: `001_initial_schema.sql`, `002_add_inventory.sql`, etc.

Initial migration creates all tables from the architecture doc + all RLS policies.

```bash
# Local development
supabase db reset        # apply all migrations to local DB
supabase db push         # push to remote project (dev or prod)
```

### Generate TypeScript Types

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > packages/db/types.ts
```

Regenerate after every schema change. Commit the types file. This gives full type safety across the app with zero manual work.

---

## 3. Next.js App Scaffold

```bash
cd apps/web
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Additional installs:**
```bash
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add zustand @tanstack/react-query
pnpm add next-intl                          # i18n
pnpm add react-hook-form zod               # forms + validation
pnpm add @radix-ui/react-* lucide-react    # via shadcn
pnpm add recharts                          # dashboard charts
pnpm dlx shadcn-ui@latest init             # shadcn setup
```

**App Router structure:**
```
apps/web/src/
├── app/
│   ├── [locale]/                    # i18n wrapper (fr default, en toggle)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── invite/page.tsx
│   │   ├── (app)/                   # authenticated routes
│   │   │   ├── layout.tsx           # sidebar + nav
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── contacts/
│   │   │   ├── pipeline/
│   │   │   ├── activities/
│   │   │   ├── invoices/            # credit_control module
│   │   │   ├── inventory/           # inventory module
│   │   │   ├── campaigns/           # mass_comms module
│   │   │   └── settings/
│   │   └── layout.tsx
│   └── api/
│       ├── auth/
│       ├── orgs/
│       └── webhooks/
├── components/
│   ├── ui/                          # shadcn components
│   └── app/                        # product-specific components
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # browser client
│   │   ├── server.ts               # server client (SSR)
│   │   └── middleware.ts           # auth session refresh
│   ├── utils.ts
│   └── constants.ts
├── hooks/
├── stores/                          # Zustand stores
└── types/
```

**Middleware (auth protection):**
```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Refresh session + redirect unauthenticated users to /login
  // Runs on every request — keeps sessions fresh
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

---

## 4. Vercel Deployment

### Setup

1. Import GitHub repo to Vercel
2. Set root directory: `apps/web`
3. Framework: Next.js (auto-detected)
4. Create two environments: Preview (develop branch) + Production (main branch)

### Custom Domains

- Production: `app.plutobusiness.cm`
- Staging: `dev.plutobusiness.cm`

(Register `plutobusiness.cm` domain — .cm is Cameroon TLD, more expensive ~£30-50/yr but worth it)
Alternative: `plutobusiness.africa` (~£20/yr) or `plutobiz.app` (~£10/yr)

### Environment Variables (Vercel)

Set these in Vercel dashboard (never commit to git):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # server-only, never expose to client

# 360dialog (WhatsApp)
WABA_API_KEY=
WABA_WEBHOOK_SECRET=

# Africa's Talking (SMS)
AT_API_KEY=
AT_USERNAME=

# MTN MoMo
MOMO_SUBSCRIPTION_KEY=
MOMO_TARGET_ENVIRONMENT=sandbox    # change to production when live

# Resend (email)
RESEND_API_KEY=

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# App
NEXT_PUBLIC_APP_URL=https://app.plutobusiness.cm
```

---

## 5. CI/CD Pipeline (GitHub Actions)

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [develop, main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck        # tsc --noEmit
      - run: pnpm lint             # eslint
      - run: pnpm test             # vitest (unit tests)
```

### `.github/workflows/deploy.yml`

Vercel handles auto-deploy on push to `develop` (staging) and `main` (production) automatically when linked to GitHub. No manual deploy workflow needed.

### Branch Protection Rules

- `main`: Require PR + 1 review. No direct pushes. CI must pass.
- `develop`: Require CI to pass. Direct pushes allowed for Peter/Larry.

---

## 6. Local Dev Setup (For Peter + Larry)

```bash
# Clone repo
git clone https://github.com/pluto-business-cm/pluto-business
cd pluto-business

# Install deps
pnpm install

# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase (runs Postgres + Auth + Storage locally via Docker)
supabase start

# Copy env template
cp .env.example apps/web/.env.local
# Fill in the local Supabase URLs printed by `supabase start`

# Seed database with test data
supabase db reset

# Start dev server
pnpm dev
```

**What the dev environment gives them:**
- Full Postgres running locally (no risk of polluting prod)
- Local Auth (no real SMS OTPs — use magic link or bypass in dev mode)
- Local Storage (S3-compatible)
- Local Edge Functions runtime
- Hot reload on save

---

## 7. Checklist Before First Feature PR

- [ ] GitHub repo created, team invited (Ashley, Peter, Larry)
- [ ] Supabase projects created (dev + prod)
- [ ] Initial schema migration written and applied to both
- [ ] TypeScript types generated
- [ ] Next.js scaffold initialised, deploys to Vercel
- [ ] Custom domains pointed at Vercel
- [ ] All environment variables set in Vercel (prod + preview)
- [ ] `.env.example` committed with all variable names (no values)
- [ ] CI passing on example PR
- [ ] Branch protection rules set
- [ ] Local dev instructions in README.md
- [ ] Peter + Larry can clone, run `supabase start` + `pnpm dev`, and see the app

---

## Estimated Setup Time

| Task | Time |
|------|------|
| GitHub repo + branch setup | 30 min |
| Supabase projects + config | 1 hr |
| Next.js scaffold + shadcn | 1 hr |
| Write initial schema migrations | 2-3 hrs |
| Vercel setup + domains | 30 min |
| CI/CD pipeline | 30 min |
| README + local dev instructions | 30 min |
| **Total** | **~6-7 hrs** |

One focused dev day. Peter or Larry should own this while Ashley reviews.
