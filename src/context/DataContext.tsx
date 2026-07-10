import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  organisations as initialOrgs,
  contacts as initialContacts,
  deals as initialDeals,
  invoices as initialInvoices,
  sectorOptions,
  countryOptions,
  paymentTermOptions,
  systemUsers,
} from '../data/mockData'

// ─── Types ────────────────────────────────────────────────────────────────────

type Conversation = {
  id: string; date: string; type: string; direction: string; summary: string; user: string
}
export type Org = typeof initialOrgs[0]
export type Contact = typeof initialContacts[0] & { conversations: Conversation[] }
export type Deal = typeof initialDeals[0]
type InvoiceLineItem = { description: string; amount: number }
export type Invoice = {
  id: string; orgId: number; dealId: number | null; amount: number; dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  paymentRef: string | null; paidVia: string | null; paidAt: string | null
  reminders: { date: string; type: string }[]
  paymentLink: string
  lineItems: InvoiceLineItem[]
  templateUsed: string
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DataContextValue {
  orgs: Org[]
  contacts: Contact[]
  deals: Deal[]
  invoices: Invoice[]
  addOrg: (org: Org) => void
  addContact: (contact: Contact) => void
  addDeal: (deal: Deal) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, patch: Partial<Invoice>) => void
  // expose reference data
  sectorOptions: typeof sectorOptions
  countryOptions: typeof countryOptions
  paymentTermOptions: typeof paymentTermOptions
  systemUsers: typeof systemUsers
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [orgs, setOrgs] = useState<Org[]>(initialOrgs)
  const [contacts, setContacts] = useState<Contact[]>(
    initialContacts as unknown as Contact[]
  )
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [invoices, setInvoices] = useState<Invoice[]>(
    initialInvoices as unknown as Invoice[]
  )

  const addOrg = (org: Org) => setOrgs(prev => [org, ...prev])
  const addContact = (contact: Contact) => setContacts(prev => [contact, ...prev])
  const addDeal = (deal: Deal) => setDeals(prev => [deal, ...prev])
  const addInvoice = (invoice: Invoice) => setInvoices(prev => [invoice, ...prev])
  const updateInvoice = (id: string, patch: Partial<Invoice>) =>
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)))

  return (
    <DataContext.Provider value={{
      orgs, contacts, deals, invoices,
      addOrg, addContact, addDeal, addInvoice, updateInvoice,
      sectorOptions, countryOptions, paymentTermOptions, systemUsers,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
