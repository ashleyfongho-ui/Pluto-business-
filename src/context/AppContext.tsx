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

// ─── Business Type ──────────────────────────────────────────────────────────
export type BusinessType = 'pharma' | 'produce' | 'retail' | 'services' | 'manufacturing'

export const businessTypeConfig: Record<BusinessType, {
  label: string
  emoji: string
  description: string
  unitLabel: string
  unitOptions: string[]
  hasExpiry: boolean
  hasVariants: boolean
  hasWaste: boolean
  hasWeight: boolean
  showLogistics: boolean
  stockLabel: string
  itemLabel: string
}> = {
  pharma: {
    label: 'Pharma / Medical', emoji: '💊',
    description: 'Medicines, devices, consumables with batch/lot tracking',
    unitLabel: 'units', unitOptions: ['units', 'boxes', 'vials', 'strips'],
    hasExpiry: true, hasVariants: false, hasWaste: false, hasWeight: false,
    showLogistics: true, stockLabel: 'Stock', itemLabel: 'Product',
  },
  produce: {
    label: 'Produce / Perishables', emoji: '🌿',
    description: 'Fresh goods — fruits, veg, fish, meat, dairy',
    unitLabel: 'kg', unitOptions: ['kg', 'tonnes', 'bunches', 'crates', 'litres', 'units'],
    hasExpiry: false, hasVariants: false, hasWaste: true, hasWeight: true,
    showLogistics: true, stockLabel: 'Produce', itemLabel: 'Product',
  },
  retail: {
    label: 'Retail / Hard Goods', emoji: '👟',
    description: 'Shoes, clothing, tyres, electronics, hardware',
    unitLabel: 'units', unitOptions: ['units', 'pairs', 'sets'],
    hasExpiry: false, hasVariants: true, hasWaste: false, hasWeight: false,
    showLogistics: true, stockLabel: 'Stock', itemLabel: 'Item',
  },
  services: {
    label: 'Services / Time', emoji: '🕐',
    description: 'Consulting, cleaning, repairs — bill by hour or job',
    unitLabel: 'hours', unitOptions: ['hours', 'days', 'sessions', 'jobs'],
    hasExpiry: false, hasVariants: false, hasWaste: false, hasWeight: false,
    showLogistics: false, stockLabel: 'Capacity', itemLabel: 'Service',
  },
  manufacturing: {
    label: 'Raw Materials / Mfg', emoji: '🏗️',
    description: 'Timber, cement, fabric — consumed in production',
    unitLabel: 'units', unitOptions: ['kg', 'tonnes', 'm²', 'rolls', 'litres', 'units'],
    hasExpiry: false, hasVariants: false, hasWaste: true, hasWeight: true,
    showLogistics: true, stockLabel: 'Materials', itemLabel: 'Material',
  },
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
  businessType: BusinessType
  setBusinessType: (t: BusinessType) => void
}

const AppContext = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [organisations, setOrganisations] = useState<Organisation[]>(initOrgs as Organisation[])
  const [contacts, setContacts] = useState<Contact[]>(initContacts as unknown as Contact[])
  const [deals, setDeals] = useState<Deal[]>(initDeals as unknown as Deal[])
  const [invoices, setInvoices] = useState<Invoice[]>(initInvoices as unknown as Invoice[])
  const [businessType, setBusinessTypeState] = useState<BusinessType>(
    () => (localStorage.getItem('pluto_business_type') as BusinessType) || 'pharma'
  )
  const setBusinessType = (t: BusinessType) => {
    setBusinessTypeState(t)
    localStorage.setItem('pluto_business_type', t)
  }

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
      businessType, setBusinessType,
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
