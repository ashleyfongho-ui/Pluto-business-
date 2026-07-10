# Pluto Business — CRM Core
*Step 5 of the build roadmap | July 2026*

The CRM core is the beating heart of the product. Every other module (invoices, inventory, campaigns) plugs into contacts and deals. Get this right and everything else is just an extension of it.

---

## What We're Building

1. Contacts (people + companies)
2. Pipeline (deal stages, kanban board)
3. Deals (opportunities + their full lifecycle)
4. Activities (calls, WhatsApp messages, notes, tasks)
5. Contact 360° view (everything about one person in one screen)
6. Search (fast, full-text, fuzzy)
7. CSV import
8. Basic reporting (pipeline value, activity stats)

---

## 1. Contacts

### Data Model (already in architecture doc — UI/UX focus here)

A contact is either a *person* or a *company*. People can belong to a company. Companies aggregate their people.

### Contact List View

```
┌─────────────────────────────────────────────────────────────────┐
│ Contacts                                    [+ Nouveau] [Import] │
├─────────────────────────────────────────────────────────────────┤
│ 🔍 Rechercher...              [Tous ▼] [Secteur ▼] [Ville ▼]   │
├─────────────────────────────────────────────────────────────────┤
│ □  Nom                  Téléphone      Entreprise    Solde dû   │
│ □  Jean Mbarga          +237 677...    Pharma Plus   125,000 F  │
│ □  Pharma Plus          —              —             —          │
│ □  Marie Ngo            +237 699...    Clinique...   0          │
│    [Load more]                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key UI decisions:**
- Default sort: last activity (most recently contacted first)
- Show outstanding balance in list — sales reps need to know this before calling
- Bulk select → bulk tag, bulk assign, bulk export
- Click row → opens Contact 360° view (side panel, not new page — faster)

### Contact 360° View (Side Panel)

```
┌──────────────────────────────────────────────────────┐
│ Jean Mbarga                              [Modifier] X │
│ Directeur des Achats · Pharma Plus                    │
│ +237 677 123 456  📱WhatsApp  📞 Appeler              │
├──────────────────────────────────────────────────────┤
│ [Résumé] [Activités] [Affaires] [Factures] [Fichiers] │
├──────────────────────────────────────────────────────┤
│ Résumé                                               │
│  Ville: Yaoundé · Secteur: Pharma                    │
│  Limite crédit: 500,000 CFA                          │
│  Solde dû: 125,000 CFA (1 facture en retard)         │
│  Assigné à: Marie (vous)                             │
│                                                      │
│ Prochaine action                                     │
│  📅 Appel de suivi — demain 10h00                    │
│                                                      │
│ Dernière activité                                    │
│  💬 WhatsApp (hier) — "D'accord pour la livraison"   │
│                                                      │
│ Affaires en cours (2)                                │
│  🟡 Commande Q3 — 850,000 CFA · Proposition envoyée  │
│  🔵 Renouvellement — 200,000 CFA · Négociation       │
└──────────────────────────────────────────────────────┘
```

### Contact Create/Edit Form

Required: first name OR company name (not both). 
Recommended but not required: phone.

```typescript
// Validation schema (Zod)
const contactSchema = z.object({
  type: z.enum(['person', 'company']),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company_id: z.string().uuid().optional(),
  phone: z.string().optional(),   // validated with libphonenumber
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  city: z.string().optional(),
  arrondissement: z.string().optional(),
  tags: z.array(z.string()).default([]),
  credit_limit: z.number().min(0).default(0),
  custom_fields: z.record(z.any()).default({}),
}).refine(
  (data) => data.first_name || data.last_name || data.type === 'company',
  { message: "Au moins un nom est requis" }
)
```

---

## 2. Pipeline

### Design

Multiple pipelines per organisation. Each pipeline has custom stages. Default pipeline created on org setup:

```
Prospect → Contacté → Proposition → Négociation → [Gagné / Perdu]
```

Pipeline stages stored as ordered JSON array in the `pipelines` table:
```json
[
  { "id": "prospect", "name": "Prospect", "color": "#94a3b8", "probability": 10 },
  { "id": "contacted", "name": "Contacté", "color": "#60a5fa", "probability": 25 },
  { "id": "proposal", "name": "Proposition", "color": "#a78bfa", "probability": 50 },
  { "id": "negotiation", "name": "Négociation", "color": "#fb923c", "probability": 75 }
]
```

### Kanban View

```
┌─────────────────────────────────────────────────────────────────────┐
│ Pipeline principal                    [+ Nouvelle affaire]  [📊 Vue liste] │
├───────────────┬───────────────┬───────────────┬───────────────────────┤
│ PROSPECT (3)  │ CONTACTÉ (5)  │ PROPOSITION(2)│ NÉGOCIATION (1)       │
│ 275K CFA      │ 1.2M CFA      │ 950K CFA      │ 450K CFA              │
├───────────────┼───────────────┼───────────────┼───────────────────────┤
│ ┌───────────┐ │ ┌───────────┐ │ ┌───────────┐ │ ┌───────────────────┐ │
│ │Jean Mbarga│ │ │Pharma Plus│ │ │Clinique...│ │ │Moda Distribution │ │
│ │300K CFA   │ │ │850K CFA   │ │ │500K CFA   │ │ │450K CFA          │ │
│ │📅 demain  │ │ │📅 auj.    │ │ │📅 vendredi│ │ │📅 en retard!     │ │
│ └───────────┘ │ └───────────┘ │ └───────────┘ │ └───────────────────┘ │
│               │               │               │                       │
│ [+ Ajouter]   │ [+ Ajouter]   │ [+ Ajouter]   │ [+ Ajouter]          │
└───────────────┴───────────────┴───────────────┴───────────────────────┘
```

**Drag-and-drop:** Use `@dnd-kit/sortable`. On drop → PATCH `deal.stage_id` → Supabase Realtime broadcasts change to other users viewing same pipeline (instant sync).

**Deal card shows:** contact name, deal value, next activity date. Red if overdue.

### Deal Create/Edit

```typescript
const dealSchema = z.object({
  title: z.string().min(1),
  contact_id: z.string().uuid(),
  pipeline_id: z.string().uuid(),
  stage_id: z.string(),
  value: z.number().min(0).default(0),
  currency: z.string().default('XAF'),
  expected_close_date: z.string().optional(),  // ISO date
  assigned_to: z.string().uuid().optional(),
  custom_fields: z.record(z.any()).default({}),
})
```

### Won / Lost Flow

When marking a deal won or lost:
- **Won:** Confetti animation (small touch, feels good). Ask: "Créer une facture pour cette affaire?" → one-click invoice generation.
- **Lost:** Required: select lost reason (dropdown: Prix, Concurrent, Budget, Timing, Autre). Optional: note. This data feeds reporting.

---

## 3. Activities

Activities are the history of everything that happened with a contact or deal. They're automatically created by:
- WhatsApp messages sent/received (via webhook)
- Manual log: "J'ai appelé Jean, il rappelle vendredi"
- Planned tasks: "Envoyer devis avant vendredi 17h"

### Activity Feed (on Contact 360° view)

```
Today
  10:34  💬 WhatsApp (outbound) — "Bonjour Jean, avez-vous reçu la proposition?"
  09:15  ✅ Tâche complétée — "Envoyer proposition Q3"

Yesterday
  16:40  📞 Appel (5 min) — Note: "Intéressé mais veut réviser les prix. Rappel vendredi"
  11:00  💬 WhatsApp (inbound) — "Merci pour la visite, on se rappelle"

3 July
  14:30  🤝 Réunion (45 min) — "Présentation produit au bureau"
```

### Log Activity Form

```
Type: [Appel ▼]   ←  WhatsApp | Appel | Réunion | Note | Email | Tâche
Contact: Jean Mbarga (pre-filled from context)
Affaire: Commande Q3 (optional link)
Note: [                                    ]
Date: [Aujourd'hui ▼]  Heure: [10:34]
Si Tâche:
  Assigné à: [Marie ▼]
  Échéance: [Vendredi 11 juillet ▼]
```

---

## 4. WhatsApp Integration (360dialog)

This is the most important integration. WhatsApp IS the primary communication channel in Cameroon.

### Setup

1. Apply for WhatsApp Business Account (WABA) via 360dialog (~€49/mo)
2. Connect phone number (PreCure's WhatsApp Business number)
3. Get WABA API key
4. Configure webhook: `https://app.plutobusiness.cm/api/webhooks/whatsapp/360dialog`

### Outbound (Send from CRM)

```typescript
// lib/whatsapp/send.ts
async function sendWhatsAppMessage(
  to: string,          // phone number: +237677123456
  message: string,     // free-form text (only within 24h session window)
  templateName?: string  // for messages outside 24h window
) {
  const response = await fetch('https://waba.360dialog.io/v1/messages', {
    method: 'POST',
    headers: {
      'D360-API-KEY': process.env.WABA_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      type: message ? 'text' : 'template',
      text: message ? { body: message } : undefined,
      template: templateName ? { name: templateName, language: { code: 'fr' } } : undefined,
    })
  })
  
  const { messages } = await response.json()
  return messages[0].id  // WhatsApp message ID for status tracking
}
```

**In the UI:** Every contact with a WhatsApp number shows a "💬 WhatsApp" button. Click → opens a mini chat panel. Type message → send → automatically logged as activity.

### Inbound (Receive in CRM)

Webhook receives every inbound message:

```typescript
// app/api/webhooks/whatsapp/360dialog/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  for (const message of body.messages) {
    // Find contact by phone
    const contact = await findContactByPhone(message.from)
    
    if (contact) {
      // Log as activity
      await createActivity({
        organisation_id: contact.organisation_id,
        type: 'whatsapp',
        direction: 'inbound',
        contact_id: contact.id,
        body: message.text?.body || '[media message]',
        created_at: new Date(parseInt(message.timestamp) * 1000).toISOString()
      })
      
      // Store in comms_messages
      await createMessage({ contact_id: contact.id, direction: 'inbound', ... })
      
      // Realtime notification to users viewing this contact
      await supabase.channel('notifications').send({ type: 'new_whatsapp', contact_id: contact.id })
    }
  }
  
  return Response.json({ status: 'ok' })
}
```

---

## 5. Search

Fast, multi-field search across contacts and deals. Implemented two ways:

**Supabase full-text search (primary):**
```sql
-- Add tsvector column to contacts for fast FTS
ALTER TABLE contacts ADD COLUMN search_vector tsvector;
CREATE INDEX contacts_search_idx ON contacts USING GIN(search_vector);

-- Update trigger keeps search_vector current
CREATE TRIGGER contacts_search_update
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.french', 
    'first_name', 'last_name', 'phone', 'email', 'city');
```

**API:**
```typescript
// Search contacts
const { data } = await supabase
  .from('contacts')
  .select('id, first_name, last_name, phone, city')
  .textSearch('search_vector', query)
  .order('updated_at', { ascending: false })
  .limit(20)
```

**UI:** Global search bar (Cmd+K / Ctrl+K). Results appear in < 200ms. Shows: contacts, deals, recent activities.

---

## 6. CSV Import

Critical for onboarding. Every SME has their customer list in WhatsApp, Excel, or a notebook. Make it easy to get in.

```
Import flow:
1. User uploads CSV file
2. Preview first 5 rows
3. Map columns: "Your column" → "Pluto field"
   Example: "Nom Client" → "Prénom + Nom"
4. Validation: flag missing required fields, duplicate phone numbers
5. Import with progress bar
6. Summary: "347 contacts importés, 12 doublons ignorés"
```

**Supported columns (auto-detected):**
- Nom, Prénom, Nom complet, Full Name
- Téléphone, Phone, WhatsApp
- Email
- Entreprise, Company
- Ville, City
- Notes

**Duplicate handling:** Match on phone number. If duplicate found → skip (default) or update (option).

---

## 7. Reporting (Basic Dashboard)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Tableau de bord                                    Juillet 2026 ▼   │
├──────────────────┬──────────────────┬──────────────────┬────────────┤
│ Affaires ouvertes│ Valeur pipeline  │ Gagnées ce mois  │ Activités  │
│       23         │   4,750,000 CFA  │       8          │    47      │
├──────────────────┴──────────────────┴──────────────────┴────────────┤
│ Pipeline par étape                                                   │
│ Prospect    ████████░░░░░░░░░░░░  3 affaires · 275K                 │
│ Contacté    ████████████████░░░░  5 affaires · 1.2M                 │
│ Proposition ████████░░░░░░░░░░░░  2 affaires · 950K                 │
│ Négociation ████░░░░░░░░░░░░░░░░  1 affaire · 450K                  │
├─────────────────────────────────────────────────────────────────────┤
│ Activités par commercial          │ Affaires gagnées / perdues       │
│ Marie    ████████████  28         │ ████ Gagnées 8 · 3.2M           │
│ Pierre   ██████  12               │ ██ Perdues 3 (Prix: 2, Budget: 1)│
│ Kofi     ███  7                   │                                  │
└─────────────────────────────────────────────────────────────────────┘
```

Charts via Recharts. Data from Supabase aggregate queries. No heavy BI tool needed at MVP.

---

## Component Structure

```
apps/web/src/
├── app/[locale]/(app)/
│   ├── dashboard/
│   │   └── page.tsx                    # Metrics + charts
│   ├── contacts/
│   │   ├── page.tsx                    # Contact list
│   │   ├── [id]/page.tsx               # Contact 360° view
│   │   └── import/page.tsx             # CSV import flow
│   ├── pipeline/
│   │   └── [pipelineId]/page.tsx       # Kanban board
│   └── deals/
│       └── [id]/page.tsx               # Deal detail
├── components/app/
│   ├── contacts/
│   │   ├── ContactList.tsx
│   │   ├── ContactCard.tsx             # Row in list
│   │   ├── ContactPanel.tsx            # 360° side panel
│   │   ├── ContactForm.tsx             # Create/edit
│   │   └── ContactImport.tsx
│   ├── pipeline/
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── DealCard.tsx
│   │   └── DealForm.tsx
│   ├── activities/
│   │   ├── ActivityFeed.tsx
│   │   └── LogActivityForm.tsx
│   ├── whatsapp/
│   │   ├── WhatsAppPanel.tsx           # Mini chat window
│   │   └── MessageBubble.tsx
│   └── dashboard/
│       ├── MetricCard.tsx
│       ├── PipelineChart.tsx
│       └── ActivityByUser.tsx
```

---

## API Routes for CRM Core

```
GET    /api/orgs/[orgId]/contacts              list + search
POST   /api/orgs/[orgId]/contacts              create
GET    /api/orgs/[orgId]/contacts/[id]         get single
PATCH  /api/orgs/[orgId]/contacts/[id]         update
DELETE /api/orgs/[orgId]/contacts/[id]         delete
POST   /api/orgs/[orgId]/contacts/import       CSV import

GET    /api/orgs/[orgId]/pipelines             list pipelines
POST   /api/orgs/[orgId]/pipelines             create pipeline
PATCH  /api/orgs/[orgId]/pipelines/[id]        update stages

GET    /api/orgs/[orgId]/deals                 list + filter
POST   /api/orgs/[orgId]/deals                 create
PATCH  /api/orgs/[orgId]/deals/[id]            update (inc. stage move)
DELETE /api/orgs/[orgId]/deals/[id]            delete

GET    /api/orgs/[orgId]/activities            list (filter by contact/deal)
POST   /api/orgs/[orgId]/activities            log activity
PATCH  /api/orgs/[orgId]/activities/[id]       update (complete task)
DELETE /api/orgs/[orgId]/activities/[id]       delete

POST   /api/orgs/[orgId]/whatsapp/send         send message
GET    /api/orgs/[orgId]/whatsapp/[contactId]  message history

GET    /api/orgs/[orgId]/reports/pipeline      pipeline by stage
GET    /api/orgs/[orgId]/reports/activities    activity by user
GET    /api/orgs/[orgId]/reports/won-lost      won/lost breakdown
```

---

## Acceptance Criteria for Step 5

Before moving to credit control:

- [ ] Create, edit, delete contacts (person + company)
- [ ] Link person to company
- [ ] View contact 360° panel with activity timeline
- [ ] Create deal from contact or standalone
- [ ] Drag deal between stages on kanban board
- [ ] Stage move reflects immediately for another logged-in user (realtime)
- [ ] Mark deal won → prompt to create invoice (invoice creation in Step 6)
- [ ] Mark deal lost → capture reason
- [ ] Log activity against contact/deal manually
- [ ] Inbound WhatsApp message creates activity automatically
- [ ] Send WhatsApp from CRM → logged as activity
- [ ] CSV import works with 1,000+ contacts
- [ ] Search returns results in < 500ms
- [ ] Dashboard shows correct pipeline metrics
- [ ] All text renders in French
- [ ] RLS: no cross-org data leakage (tested with two orgs)
