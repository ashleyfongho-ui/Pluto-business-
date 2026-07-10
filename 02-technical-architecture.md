# Pluto Business — Technical Architecture
*Version 1.0 | July 2026*

---

## Overview

Pluto Business is a multi-tenant SaaS CRM. Each organisation (tenant) is fully isolated. The stack is chosen for speed of development, African infrastructure realities (offline support, low bandwidth, MoMo payments), and scalability to 100k+ users without a rewrite.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **UI library:** shadcn/ui + Tailwind CSS
- **State management:** Zustand (client state) + React Query / TanStack Query (server state)
- **Offline support:** Service worker + IndexedDB for inventory stock-take and contacts (PWA)
- **Language:** TypeScript throughout
- **i18n:** next-intl (French default, English toggle, Arabic future)

### Backend
- **API:** Next.js API routes (serverless) for most endpoints. Separate Node.js (Express) or Python (FastAPI) microservice for WhatsApp webhook processing (always-on receiver)
- **Auth:** Supabase Auth (email + OTP via phone number)
- **Database:** PostgreSQL via Supabase (with Row Level Security for tenant isolation)
- **File storage:** Supabase Storage (invoice PDFs, avatars, import files)
- **Job queues:** Supabase Edge Functions (Deno) for async tasks (send broadcasts, generate reports, MoMo polling)
- **Realtime:** Supabase Realtime (websockets) for pipeline drag-and-drop sync, notifications

### Infrastructure
- **Hosting:** Vercel (frontend + API routes) — serverless, auto-scales, fast deploys
- **Database:** Supabase managed PostgreSQL (EU-West initially, af-south-1 Cape Town when available on Supabase)
- **WhatsApp:** 360dialog (WABA — WhatsApp Business API)
- **SMS:** Africa's Talking (primary for Cameroon/CEMAC) or Twilio (fallback)
- **Payments:** MTN MoMo API (merchant account via PreCure Cameroon SARL)
- **Email (transactional):** Resend or Postmark (user invites, invoice PDFs)
- **Monitoring:** Sentry (errors) + Vercel Analytics (performance)
- **CI/CD:** GitHub Actions → Vercel (auto-deploy on merge to main)

---

## Database Architecture

### Multi-tenancy Strategy: Row-Level Security (RLS)

Every table that contains business data has an `organisation_id` column. Supabase RLS policies enforce that users can only read/write rows belonging to their organisation. No data leaks between tenants possible at the database layer.

```sql
-- Example RLS policy
CREATE POLICY "org_isolation" ON contacts
  USING (organisation_id = auth.jwt() -> 'org_id');
```

### Core Schema

```sql
-- ORGANISATIONS (tenants)
organisations
  id uuid PRIMARY KEY
  name text NOT NULL
  slug text UNIQUE NOT NULL          -- used in URLs: app.plutobusiness.cm/slug
  plan text DEFAULT 'free'           -- free | starter | pro | business
  modules jsonb DEFAULT '[]'         -- enabled modules
  locale text DEFAULT 'fr'
  currency text DEFAULT 'XAF'        -- CFA franc
  created_at timestamptz

-- USERS
users (extends Supabase auth.users)
  id uuid PRIMARY KEY REFERENCES auth.users
  organisation_id uuid REFERENCES organisations
  role text                          -- owner | admin | staff | readonly
  full_name text
  phone text
  avatar_url text
  created_at timestamptz

-- CONTACTS
contacts
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  type text DEFAULT 'person'         -- person | company
  first_name text
  last_name text
  company_id uuid REFERENCES contacts(id)  -- for person → company link
  phone text
  whatsapp text                      -- may differ from phone
  email text
  address text
  city text
  arrondissement text
  country text DEFAULT 'CM'
  tags text[]
  credit_limit numeric DEFAULT 0
  custom_fields jsonb DEFAULT '{}'
  created_by uuid REFERENCES users
  created_at timestamptz
  updated_at timestamptz

-- PIPELINES
pipelines
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  name text
  stages jsonb                        -- ordered array: [{id, name, color, probability}]
  created_at timestamptz

-- DEALS
deals
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  pipeline_id uuid REFERENCES pipelines
  stage_id text                       -- references stage within pipeline
  contact_id uuid REFERENCES contacts
  title text
  value numeric
  currency text DEFAULT 'XAF'
  probability int DEFAULT 50
  expected_close_date date
  status text DEFAULT 'open'          -- open | won | lost
  lost_reason text
  assigned_to uuid REFERENCES users
  custom_fields jsonb DEFAULT '{}'
  created_by uuid REFERENCES users
  created_at timestamptz
  updated_at timestamptz

-- ACTIVITIES
activities
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  type text                           -- call | meeting | whatsapp | note | email | task
  contact_id uuid REFERENCES contacts
  deal_id uuid REFERENCES deals
  subject text
  body text
  direction text                      -- inbound | outbound (for comms)
  status text DEFAULT 'done'          -- done | planned
  due_at timestamptz
  completed_at timestamptz
  created_by uuid REFERENCES users
  created_at timestamptz

-- INVOICES (credit_control module)
invoices
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  invoice_number text UNIQUE
  contact_id uuid REFERENCES contacts
  deal_id uuid REFERENCES deals
  status text DEFAULT 'draft'         -- draft | sent | partial | paid | overdue | cancelled
  line_items jsonb                    -- [{description, qty, unit_price, total}]
  subtotal numeric
  tax_rate numeric DEFAULT 0
  tax_amount numeric DEFAULT 0
  total numeric
  amount_paid numeric DEFAULT 0
  amount_due numeric
  issued_date date
  due_date date
  payment_terms text                  -- e.g. "30 jours"
  notes text
  pdf_url text
  created_by uuid REFERENCES users
  created_at timestamptz
  updated_at timestamptz

-- PAYMENTS (credit_control module)
payments
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  invoice_id uuid REFERENCES invoices
  contact_id uuid REFERENCES contacts
  amount numeric
  method text                         -- cash | momo_mtn | momo_orange | bank_transfer | cheque
  reference text
  momo_request_id text                -- MTN MoMo payment request ID for polling
  status text DEFAULT 'completed'     -- pending | completed | failed
  paid_at timestamptz
  recorded_by uuid REFERENCES users
  created_at timestamptz

-- PRODUCTS (inventory module)
products
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  name text
  sku text
  category text
  unit text                           -- kg | litre | piece | carton | etc.
  buy_price numeric
  sell_price numeric
  track_inventory boolean DEFAULT true
  expiry_tracking boolean DEFAULT false
  reorder_level numeric DEFAULT 0
  created_at timestamptz

-- STOCK_MOVEMENTS (inventory module)
stock_movements
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  product_id uuid REFERENCES products
  location_id uuid REFERENCES locations
  type text                           -- purchase | sale | adjustment | transfer
  quantity numeric
  batch_number text
  expiry_date date
  unit_cost numeric
  notes text
  reference text                      -- invoice/PO number
  created_by uuid REFERENCES users
  created_at timestamptz

-- LOCATIONS (inventory module)
locations
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  name text                           -- "Entrepôt Yaoundé", "Boutique Douala"
  city text
  is_default boolean DEFAULT false

-- COMMS_CAMPAIGNS (mass_comms module)
comms_campaigns
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  name text
  channel text                        -- whatsapp | sms
  template_id text                    -- 360dialog template name
  audience_filter jsonb               -- the segment criteria used
  contact_count int
  status text DEFAULT 'draft'         -- draft | sending | sent | failed
  stats jsonb DEFAULT '{}'            -- {sent, delivered, read, failed}
  scheduled_at timestamptz
  sent_at timestamptz
  created_by uuid REFERENCES users
  created_at timestamptz

-- COMMS_MESSAGES (individual messages, inbound + outbound)
comms_messages
  id uuid PRIMARY KEY
  organisation_id uuid REFERENCES organisations
  contact_id uuid REFERENCES contacts
  channel text                        -- whatsapp | sms
  direction text                      -- inbound | outbound
  body text
  media_url text
  whatsapp_message_id text
  campaign_id uuid REFERENCES comms_campaigns
  status text                         -- sent | delivered | read | failed
  created_at timestamptz
```

---

## API Architecture

### Route Structure (Next.js API Routes)

```
/api/
  auth/
    callback          (Supabase OAuth callback)
    invite            (accept org invitation)
  
  orgs/
    [orgId]/
      contacts/       (CRUD + search + import)
      pipelines/      (CRUD)
      deals/          (CRUD + stage moves)
      activities/     (CRUD)
      invoices/       (CRUD + PDF generation)
      payments/       (record + MoMo request)
      products/       (CRUD)
      stock/          (movements + levels)
      campaigns/      (CRUD + send)
      users/          (invite + role management)
      reports/        (pipeline, aging, inventory)
  
  webhooks/
    whatsapp/360dialog  (inbound message handler)
    momo/mtn            (payment status callback)
```

### WhatsApp Webhook (Separate Always-On Service)

360dialog sends webhook POSTs for every inbound WhatsApp message. This needs a persistent endpoint, not a serverless cold-start. Deploy as:
- **Option A:** Railway.app Node.js microservice (simple, cheap, ~£5/mo)
- **Option B:** Supabase Edge Function (Deno — works but Deno limitations apply)
- **Option C:** Vercel serverless (will work for MVP volumes, watch cold starts)

Webhook handler:
1. Validates 360dialog signature
2. Finds matching contact by phone number
3. Creates `comms_messages` record (inbound, direction: 'inbound')
4. Creates `activities` record (type: 'whatsapp')
5. Triggers realtime notification to any user viewing that contact

---

## Auth & Session Flow

1. User visits app → redirected to login
2. Enters phone number (preferred) or email
3. OTP sent via SMS (Supabase Auth + Twilio)
4. OTP verified → Supabase session created
5. JWT includes: `user_id`, `org_id`, `role`
6. All API requests include JWT in Authorization header
7. Supabase RLS reads `org_id` from JWT → enforces tenant isolation

**Invitation flow:**
1. Owner invites user (email or phone)
2. Magic link / OTP sent
3. User signs up → auto-joined to organisation with specified role

---

## Module Feature Flags

Modules enabled per organisation stored in `organisations.modules` (jsonb array):

```json
["credit_control", "inventory", "mass_comms"]
```

Frontend checks module access before rendering module navigation. API routes check module access before processing module-specific requests. Upgrading plan → auto-enables modules.

---

## Offline Support (Inventory Stock-Take)

The mobile stock-take flow must work without internet (common in Cameroonian warehouses):

1. User opens stock-take on mobile browser
2. PWA service worker caches the products list
3. User scans/counts offline → writes to IndexedDB
4. When connectivity restored → sync queue uploads movements to API
5. Conflict resolution: last-write-wins on quantity (with audit log)

---

## File: Key Third-Party Integrations

| Service | Purpose | Notes |
|---------|---------|-------|
| 360dialog | WhatsApp Business API | Need WABA approval. ~€49/mo + message costs |
| Africa's Talking | SMS (Cameroon) | Best coverage, CFA billing, local support |
| MTN MoMo API | Payment requests | Needs merchant account under PreCure Cameroon SARL |
| Resend | Transactional email | Invites, invoice PDFs |
| Supabase | DB + auth + storage + realtime | Core infrastructure |
| Vercel | Hosting + serverless | Auto-deploy from GitHub |
| Sentry | Error monitoring | Free tier covers MVP |

---

## Data Residency & Compliance

- **Cameroon Law 2024/017:** Health data = sensitive. Business CRM data = personal data requiring DPA registration.
- **Database:** Supabase EU-West (Ireland) initially. Migrate to af-south-1 or set up Supabase on AWS Cape Town when needed.
- **Data Processing Agreement:** Required with Supabase, 360dialog, Africa's Talking before launch.
- **DPA registration:** PreCure Cameroon SARL must register with Cameroon DPA before processing Cameroonian personal data commercially.
- **GDPR:** EU-hosted data for EU users — standard Supabase DPA covers this.

---

## Performance Targets (MVP)

- Page load (cold): < 2s on 3G connection
- API response (p95): < 500ms
- Offline stock-take: zero dependency on connectivity
- WhatsApp message delivery: < 5s from send button to delivery
- Invoice PDF generation: < 3s

---

## Scalability Path

MVP → 100 orgs: Single Supabase project, Vercel serverless, no changes needed
100 → 1,000 orgs: Add read replicas, Redis cache for reports, move WhatsApp webhook to dedicated service
1,000+ orgs: Evaluate Supabase self-hosted on AWS af-south-1, CDN for Africa, consider sharding strategy
