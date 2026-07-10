# Pluto Business — MVP Scope
*Version 1.0 | July 2026*

---

## What We're Building

Pluto Business is a Salesforce-grade CRM built for African SMEs — starting with Cameroon. French-first, WhatsApp-native, MoMo-integrated. No corporate bloat. Designed for the way business actually works on the continent.

**Target users (MVP):** Cameroonian SMEs in FMCG, retail, services, pharma distribution. First customer: PreCure Cameroon.

**Business model:** SaaS subscription (monthly). Freemium entry tier. Module upsells.

**Platform:** Web app first (Next.js PWA). Mobile app (React Native) in Phase 2.

---

## MVP Scope — What Ships in v1

### Core (Always On — Every Plan)

| Feature | Description |
|---------|-------------|
| Contacts | People + companies. Custom fields. Tags. Import from CSV. |
| Pipeline | Kanban deal stages. Drag-and-drop. Multiple pipelines per org. |
| Activities | Calls, meetings, WhatsApp messages, notes — all logged against contacts/deals. |
| Dashboard | Key metrics: open deals, revenue forecast, activities due today. |
| WhatsApp comms | Send/receive WhatsApp messages from within the CRM (via 360dialog WABA). Log automatically. |
| User management | Owner + Admin + Staff roles. Invite by email or phone number. |
| Basic reporting | Pipeline value by stage, activity by user, won/lost deals. |
| French UI | All UI strings in French by default. Language toggle (FR/EN). |

### Module: Credit Control (MVP)

| Feature | Description |
|---------|-------------|
| Invoices | Create invoices against contacts/deals. Line items. CFA franc primary. |
| Payment tracking | Log payments (cash, MoMo, bank transfer). Partial payments supported. |
| Debt aging | 0–30, 31–60, 61–90, 90+ day aging report. Auto-flags overdue. |
| MoMo payment requests | Send MTN MoMo payment request link directly from invoice. Orange Money Phase 2. |
| Credit limits | Set credit limit per customer. Alert when exceeded. |
| Outstanding balance view | Per-customer total owed. Filters by arrondissement, sector. |

### Module: Inventory (MVP — Lite)

| Feature | Description |
|---------|-------------|
| Products/SKUs | Product catalogue. Category, unit, buy/sell price. |
| Stock levels | Current stock per product per location. |
| Stock movements | In (purchase), Out (sale), Adjustment. All timestamped. |
| Low-stock alerts | Configurable threshold. Alert via WhatsApp or in-app. |
| Expiry tracking | Expiry date per batch. Dashboard flags expiring within 30 days. |
| Mobile stock-take | Camera scan barcode OR manual count. Works offline. Syncs when back online. |

### Module: Mass Comms (MVP — Basic)

| Feature | Description |
|---------|-------------|
| Contact lists | Segment contacts by tag, pipeline stage, location, custom field. |
| WhatsApp broadcast | Send approved template messages to a list. Delivery report. |
| SMS broadcast | Fallback for contacts without WhatsApp. Via Twilio/Africa's Talking. |
| Campaign history | Log every campaign. Open rates where available. |

---

## What's NOT in MVP (Phase 2+)

- AI assistant / French-language chatbot
- Voice broadcast
- Field ops (mobile check-ins, job management)
- Full commerce module (orders, returns, POS)
- Multi-currency (USD/GBP/NGN) — CFA only in MVP
- Orange Money payment requests
- Advanced forecasting & AI analytics
- Customer service / ticketing
- AppExchange / marketplace
- API access for external developers
- SSO / enterprise auth

---

## Subscription Tiers (Draft)

| Tier | Price | Includes |
|------|-------|----------|
| Gratuit (Free) | 0 CFA | 1 user, 100 contacts, pipeline only, no modules |
| Starter | ~5,000 CFA/mo (~£7) | 3 users, 1,000 contacts, core + credit control |
| Pro | ~15,000 CFA/mo (~£20) | 10 users, unlimited contacts, all MVP modules |
| Business | ~40,000 CFA/mo (~£53) | Unlimited users, multi-location, priority support |

*Pricing to be validated with Cameroonian SMEs before launch.*

---

## Success Criteria for MVP

1. PreCure Cameroon is running its full BD pipeline through it
2. At least 3 external Cameroonian businesses onboarded (beta)
3. Invoices created and MoMo payment requests sent successfully
4. WhatsApp messages sent and logged in CRM
5. Zero data loss in 30 days of operation

---

## Build Priority Order

1. Auth + multi-tenancy (nothing works without this)
2. Contacts + Companies
3. Pipeline (kanban)
4. WhatsApp integration (360dialog)
5. Credit control (invoices + MoMo)
6. Inventory (lite)
7. Mass comms
8. Reporting dashboard
9. French i18n pass
10. Beta onboarding flow
