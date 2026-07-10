# Pluto Business — Core Auth & Multi-Tenancy
*Step 4 of the build roadmap | July 2026*

This is the foundation. If this isn't right, nothing else is. Every feature built after this inherits the security and isolation model defined here. Take the time to get it right before building anything else.

---

## What We're Building

1. Organisation creation (sign-up flow)
2. User authentication (phone OTP primary, email fallback)
3. Role-based access control (RBAC)
4. User invitation system
5. Multi-tenancy enforcement (RLS)
6. Subscription tier gating
7. Session management + middleware

---

## 1. Organisation Model

Every user belongs to exactly one organisation (for MVP). An organisation is a tenant — a company using Pluto Business.

```typescript
type Organisation = {
  id: string              // UUID
  name: string            // "PreCure Cameroon SARL"
  slug: string            // "precure-cameroon" — used in URLs
  plan: 'free' | 'starter' | 'pro' | 'business'
  modules: ModuleName[]   // enabled feature modules
  locale: 'fr' | 'en'
  currency: 'XAF' | 'USD' | 'GBP' | 'NGN'
  created_at: string
}
```

**Slug rules:** lowercase, hyphens only, 3-50 chars, unique. Used for: identifying org in logs, future subdomain routing (`precure-cameroon.plutobusiness.cm`).

---

## 2. Authentication Flow

### Primary: Phone OTP

Most Cameroonian users will authenticate via phone number. No email required.

```
User enters phone: +237 6XX XXX XXX
  → Format/validate (libphonenumber)
  → Supabase Auth: signInWithOtp({ phone })
  → SMS sent via Twilio: "Votre code Pluto Business: 847291"
  → User enters 6-digit code
  → Supabase verifies OTP
  → Session created, JWT returned
  → Middleware stores session in httpOnly cookie
  → Redirect to /dashboard (or /onboarding if new org)
```

### Fallback: Email Magic Link

For users who prefer email:
```
User enters email
  → Supabase Auth: signInWithOtp({ email })
  → Magic link sent via Resend
  → User clicks link
  → Session created
```

### New Organisation Onboarding

First-time sign-up creates both the user AND their organisation:

```
1. Enter phone number → verify OTP
2. "Vous êtes nouveau? Créer votre entreprise"
3. Enter: company name, your name, industry (select)
4. System: 
   - Creates organisation record
   - Creates user record with role='owner'
   - Creates default pipeline ("Pipeline principal")
   - Creates default invoice numbering (FAC-001)
5. Redirect to onboarding checklist:
   - ✅ Compte créé
   - ○ Ajouter votre premier contact
   - ○ Créer votre premier devis
   - ○ Inviter un collaborateur
```

### Joining an Existing Organisation

Via invitation link:
```
Owner sends invite to phone/email
  → System creates invitation record
  → SMS/email: "Jean vous invite à rejoindre PreCure sur Pluto Business. [link]"
  → User clicks link
  → If new user: phone OTP signup
  → If existing user: verify identity
  → User added to organisation with specified role
  → Invitation record marked 'accepted'
```

---

## 3. Role-Based Access Control (RBAC)

### Roles

| Role | Who | Permissions |
|------|-----|-------------|
| `owner` | Company owner (1 per org, cannot be demoted) | Everything + billing + delete org |
| `admin` | Senior staff, managers | Everything except billing |
| `staff` | Sales reps, field staff | Own contacts/deals, shared pipeline view |
| `readonly` | Accountants, silent observers | View-only, no write |

### Permission Matrix

| Action | owner | admin | staff | readonly |
|--------|-------|-------|-------|----------|
| View all contacts | ✅ | ✅ | ✅ | ✅ |
| Create/edit contacts | ✅ | ✅ | ✅ | ❌ |
| Delete contacts | ✅ | ✅ | ❌ | ❌ |
| View all deals | ✅ | ✅ | ✅ | ✅ |
| Create/edit deals | ✅ | ✅ | ✅ | ❌ |
| Delete deals | ✅ | ✅ | ❌ | ❌ |
| View own activities only | — | — | ✅* | ✅* |
| View all activities | ✅ | ✅ | ❌ | ❌ |
| Create invoices | ✅ | ✅ | ✅ | ❌ |
| Record payments | ✅ | ✅ | ✅ | ❌ |
| View all invoices | ✅ | ✅ | ✅ | ✅ |
| Manage users | ✅ | ✅ | ❌ | ❌ |
| Manage billing/plan | ✅ | ❌ | ❌ | ❌ |
| Access settings | ✅ | ✅ | ❌ | ❌ |
| Send campaigns | ✅ | ✅ | ✅ | ❌ |
| Manage inventory | ✅ | ✅ | ✅ | ✅ (view) |

*`staff` can see all contacts in pipeline but activities default to own. Admin can expand this per org in settings.

### Implementation

**In JWT:** Include `org_id` and `role` in the user's JWT claims.

```sql
-- Supabase custom JWT hook (adds org context to token)
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb AS $$
DECLARE
  user_org_id uuid;
  user_role text;
BEGIN
  SELECT organisation_id, role INTO user_org_id, user_role
  FROM public.users WHERE id = (event ->> 'user_id')::uuid;
  
  event := jsonb_set(event, '{claims,org_id}', to_jsonb(user_org_id));
  event := jsonb_set(event, '{claims,role}', to_jsonb(user_role));
  RETURN event;
END;
$$ LANGUAGE plpgsql;
```

**In API routes:** Read from JWT, check permissions before executing:

```typescript
// lib/auth/permissions.ts
export function requireRole(
  userRole: Role, 
  requiredRole: Role
): void {
  const hierarchy = ['readonly', 'staff', 'admin', 'owner']
  if (hierarchy.indexOf(userRole) < hierarchy.indexOf(requiredRole)) {
    throw new ForbiddenError('Insufficient permissions')
  }
}

// In an API route:
const { user } = await getServerSession(request)
requireRole(user.role, 'admin')  // throws if not admin+
```

**In UI:** Hide/disable actions based on role:

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useUser()
  return {
    canDeleteContacts: ['owner', 'admin'].includes(user.role),
    canManageUsers: ['owner', 'admin'].includes(user.role),
    canManageBilling: user.role === 'owner',
    // etc.
  }
}

// In component:
const { canDeleteContacts } = usePermissions()
{canDeleteContacts && <DeleteButton />}
```

---

## 4. Multi-Tenancy: Row-Level Security

Every data table has `organisation_id`. Supabase RLS policies enforce that all queries are scoped to the current user's organisation. This happens at the database layer — even if there's a bug in the API code, data from one org cannot leak to another.

### Core RLS Policies

```sql
-- Enable RLS on all data tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE comms_messages ENABLE ROW LEVEL SECURITY;

-- SELECT: users can only read their org's data
CREATE POLICY "select_own_org" ON contacts
  FOR SELECT USING (
    organisation_id = (auth.jwt() ->> 'org_id')::uuid
  );

-- INSERT: users can only create records in their org
CREATE POLICY "insert_own_org" ON contacts
  FOR INSERT WITH CHECK (
    organisation_id = (auth.jwt() ->> 'org_id')::uuid
  );

-- UPDATE: users can only update their org's records
CREATE POLICY "update_own_org" ON contacts
  FOR UPDATE USING (
    organisation_id = (auth.jwt() ->> 'org_id')::uuid
  );

-- DELETE: only owner/admin can delete (check role in JWT)
CREATE POLICY "delete_admin_only" ON contacts
  FOR DELETE USING (
    organisation_id = (auth.jwt() ->> 'org_id')::uuid
    AND (auth.jwt() ->> 'role') IN ('owner', 'admin')
  );

-- Repeat equivalent policies for all data tables
```

### Service Role Bypass

For admin tasks (migrations, system jobs, support tooling) use the `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS. This key is *never* exposed to the client. Only server-side API routes and Edge Functions.

---

## 5. Invitation System

```sql
-- invitations table
CREATE TABLE invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES organisations NOT NULL,
  invited_by uuid REFERENCES users NOT NULL,
  email text,
  phone text,
  role text NOT NULL DEFAULT 'staff',
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text DEFAULT 'pending',  -- pending | accepted | expired
  expires_at timestamptz DEFAULT now() + interval '7 days',
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

**Invitation flow:**

```typescript
// POST /api/orgs/[orgId]/users/invite
async function inviteUser(orgId: string, email: string, role: Role) {
  // 1. Create invitation record
  const { data: invite } = await supabase
    .from('invitations')
    .insert({ organisation_id: orgId, email, role })
    .select()
    .single()
  
  // 2. Send invite message
  if (isPhone(email)) {
    await sendSMS(email, `Rejoignez ${org.name} sur Pluto Business: ${inviteUrl}`)
  } else {
    await sendEmail(email, 'invitation', { org, inviteUrl })
  }
}

// GET /invite?token=xxx (accept invitation)
async function acceptInvitation(token: string) {
  const invite = await getValidInvitation(token)
  // Link authenticated user to organisation
  // Update invitation status to 'accepted'
  // Redirect to onboarding
}
```

---

## 6. Subscription Tier Gating

Module access is checked in two places:

**Server-side (API):**
```typescript
async function checkModuleAccess(orgId: string, module: ModuleName) {
  const org = await getOrganisation(orgId)
  if (!org.modules.includes(module)) {
    throw new ForbiddenError(`Module '${module}' not enabled for this plan`)
  }
}
```

**Client-side (UI):**
```typescript
// hooks/useModules.ts
export function useModules() {
  const { org } = useOrganisation()
  return {
    hasCreditControl: org.modules.includes('credit_control'),
    hasInventory: org.modules.includes('inventory'),
    hasMassComms: org.modules.includes('mass_comms'),
  }
}
```

When a user tries to access a disabled module, show: *"Fonctionnalité non incluse dans votre abonnement. Passer à Pro →"*

---

## 7. Session Management & Middleware

```typescript
// middleware.ts (runs on every request)
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  
  const isAuthRoute = request.nextUrl.pathname.startsWith('/(auth)')
  const isPublicRoute = ['/', '/pricing', '/about'].includes(request.nextUrl.pathname)
  
  if (!session && !isAuthRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return response
}
```

Session is stored in httpOnly cookies (Supabase SSR handles this). Refresh happens automatically via middleware on every request — users never get logged out mid-session.

---

## Files to Create for This Step

```
apps/web/src/
├── app/[locale]/(auth)/
│   ├── login/
│   │   ├── page.tsx              # Phone/email input
│   │   └── verify/page.tsx       # OTP input
│   ├── onboarding/
│   │   └── page.tsx              # Org setup for new users
│   └── invite/
│       └── page.tsx              # Accept invitation
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── auth/
│       ├── permissions.ts
│       └── roles.ts
├── hooks/
│   ├── useUser.ts
│   ├── useOrganisation.ts
│   └── usePermissions.ts
└── middleware.ts

supabase/migrations/
├── 001_initial_schema.sql         # All tables from architecture doc
├── 002_rls_policies.sql           # All RLS policies
├── 003_auth_hooks.sql             # JWT customisation hook
└── 004_invitations.sql            # Invitation system
```

---

## Testing Auth

Before moving to Step 5 (CRM core), verify:

- [ ] New user can sign up via phone OTP and create an org
- [ ] Existing user can log in with phone OTP
- [ ] Invitation flow works end-to-end
- [ ] RLS: User A cannot read User B's contacts (test with two orgs)
- [ ] Role gating: Staff cannot delete contacts (test in UI + API)
- [ ] Module gating: Free plan user cannot access credit control
- [ ] Session persists across page refresh
- [ ] Unauthenticated user redirected to /login
- [ ] Authenticated user redirected away from /login
