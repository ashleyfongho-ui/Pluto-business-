import React, { createContext, useContext, useState } from 'react'
import {
  organisations as initOrgs,
  contacts as initContacts,
  deals as initDeals,
  invoices as initInvoices,
} from '../data/mockData'

// ─── Types ────────────────────────────────────────────────────────────────────
export type Organisation = {
  id: number
  name: string
  sector: string
  country: string
  city: string
  address: string
  phone: string
  email: string
  website: string
  outstanding: number
  lastActivity: string
  paymentTerms: string
  paymentTermsCustom: string
  ownedBy: string
  teamRelevance: string
  parentOrgId: number | null
  notes: string
  invoiceDetails: { vatNumber: string; bankName: string; accountNumber: string; swift: string }
  customFields: Record<string, unknown>
}

export type Conversation = {
  id: string
  date: string
  type: string
  direction: string
  summary: string
  user: string
}

export type Contact = {
  id: number
  orgId: number
  name: string
  role: string
  phone: string
  email: string
  country: string
  city: string
  address: string
  lastContact: string
  ownedBy: string
  notes: string
  conversations: Conversation[]
}

export type LineItem = {
  id: string
  type: string
  description: string
  sku?: string
  qty: number
  unitPrice: number
  total: number
}

export type Reminder = {
  id: string
  date: string
  assignedTo: string
  note: string
}

export type Deal = {
  id: number
  name: string
  orgId: number
  contactId: number
  stage: string
  value: number
  age: number
  owner: string
  lineItems: LineItem[]
  notes: string
  reminders: Reminder[]
}

export type Invoice = {
  id: string
  orgId: number
  dealId: number
  amount: number
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  paymentRef: string | null
  paidVia: string | null
  paidAt: string | null
  reminders: { date: string; type: string }[]
  paymentLink: string
  lineItems: { description: string; amount: number }[]
  templateUsed: string
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppCtx {
  organisations: Organisation[]
  contacts: Contact[]
  deals: Deal[]
  invoices: Invoice[]
  addOrganisation: (org: Omit<Organisation, 'id' | 'outstanding' | 'lastActivity' | 'customFields' | 'invoiceDetails'>) => Organisation
  addContact: (contact: Omit<Contact, 'id' | 'conversations' | 'lastContact'>) => Contact
  addDeal: (deal: Omit<Deal, 'id' | 'age' | 'lineItems' | 'reminders'>) => Deal
  addInvoice: (invoice: Omit<Invoice, 'paymentRef' | 'paidVia' | 'paidAt' | 'reminders' | 'paymentLink'>) => Invoice
  updateOrganisation: (id: number, updates: Partial<Organisation>) => void
  updateContact: (id: number, updates: Partial<Contact>) => void
  updateDeal: (id: number, updates: Partial<Deal>) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
}

const AppContext = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [organisations, setOrganisations] = useState<Organisation[]>(initOrgs as Organisation[])
  const [contacts, setContacts] = useState<Contact[]>(initContacts as unknown as Contact[])
  const [deals, setDeals] = useState<Deal[]>(initDeals as unknown as Deal[])
  const [invoices, setInvoices] = useState<Invoice[]>(initInvoices as unknown as Invoice[])

  const addOrganisation = (data: Omit<Organisation, 'id' | 'outstanding' | 'lastActivity' | 'customFields' | 'invoiceDetails'>) => {
    const org: Organisation = {
      ...data,
      id: Date.now(),
      outstanding: 0,
      lastActivity: 'Just now',
      customFields: {},
      invoiceDetails: { vatNumber: '', bankName: '', accountNumber: '', swift: '' },
    }
    setOrganisations(prev => [org, ...prev])
    return org
  }

  const addContact = (data: Omit<Contact, 'id' | 'conversations' | 'lastContact'>) => {
    const contact: Contact = {
      ...data,
      id: Date.now(),
      conversations: [],
      lastContact: 'Just now',
    }
    setContacts(prev => [contact, ...prev])
    return contact
  }

  const addDeal = (data: Omit<Deal, 'id' | 'age' | 'lineItems' | 'reminders'>) => {
    const deal: Deal = {
      ...data,
      id: Date.now(),
      age: 0,
      lineItems: [],
      reminders: [],
    }
    setDeals(prev => [deal, ...prev])
    return deal
  }

  const addInvoice = (data: Omit<Invoice, 'paymentRef' | 'paidVia' | 'paidAt' | 'reminders' | 'paymentLink'>) => {
    const invoice: Invoice = {
      ...data,
      paymentRef: null,
      paidVia: null,
      paidAt: null,
      reminders: [],
      paymentLink: `https://pay.plutobusiness.cm/inv/${data.id}`,
    }
    setInvoices(prev => [invoice, ...prev])
    return invoice
  }

  const updateOrganisation = (id: number, updates: Partial<Organisation>) =>
    setOrganisations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o))

  const updateContact = (id: number, updates: Partial<Contact>) =>
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))

  const updateDeal = (id: number, updates: Partial<Deal>) =>
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))

  const updateInvoice = (id: string, updates: Partial<Invoice>) =>
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))

  return (
    <AppContext.Provider value={{
      organisations, contacts, deals, invoices,
      addOrganisation, addContact, addDeal, addInvoice,
      updateOrganisation, updateContact, updateDeal, updateInvoice,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
