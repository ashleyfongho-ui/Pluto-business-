import React, { createContext, useContext, useState, useEffect } from 'react'

type Lang = 'en' | 'fr'

interface LangCtx {
  lang: Lang
  toggle: () => void
  t: (key: string) => string
}

const translations: Record<string, Record<Lang, string>> = {
  dashboard: { en: 'Dashboard', fr: 'Tableau de bord' },
  organisations: { en: 'Organisations', fr: 'Organisations' },
  contacts: { en: 'Contacts', fr: 'Contacts' },
  pipeline: { en: 'Pipeline', fr: 'Pipeline' },
  invoices: { en: 'Invoices', fr: 'Factures' },
  inventory: { en: 'Inventory', fr: 'Inventaire' },
  logistics: { en: 'Logistics', fr: 'Logistique' },
  campaigns: { en: 'Campaigns', fr: 'Campagnes' },
  reports: { en: 'Reports', fr: 'Rapports' },
  staff: { en: 'Staff', fr: 'Personnel' },
  chat: { en: 'Chat', fr: 'Messages' },
  settings: { en: 'Settings', fr: 'Paramètres' },
  accounting: { en: 'Accounting', fr: 'Comptabilité' },
  'open deals': { en: 'Open deals', fr: 'Affaires ouvertes' },
  'pipeline value': { en: 'Pipeline value', fr: 'Valeur du pipeline' },
  'won this month': { en: 'Won this month', fr: 'Gagnés ce mois' },
  'activities today': { en: 'Activities today', fr: "Activités aujourd'hui" },
  new: { en: 'New', fr: 'Nouveau' },
  search: { en: 'Search…', fr: 'Rechercher…' },
  save: { en: 'Save', fr: 'Enregistrer' },
  cancel: { en: 'Cancel', fr: 'Annuler' },
  status: { en: 'Status', fr: 'Statut' },
  name: { en: 'Name', fr: 'Nom' },
  date: { en: 'Date', fr: 'Date' },
  amount: { en: 'Amount', fr: 'Montant' },
  actions: { en: 'Actions', fr: 'Actions' },
  'mark as paid': { en: 'Mark as paid', fr: 'Marquer comme payé' },
  paid: { en: 'Paid', fr: 'Payé' },
  unpaid: { en: 'Unpaid', fr: 'Non payé' },
  overdue: { en: 'Overdue', fr: 'En retard' },
  draft: { en: 'Draft', fr: 'Brouillon' },
  sent: { en: 'Sent', fr: 'Envoyé' },
  'copy payment link': { en: 'Copy payment link', fr: 'Copier le lien de paiement' },
  'set reminder': { en: 'Set reminder', fr: 'Définir un rappel' },
  warehouse: { en: 'Warehouse', fr: 'Entrepôt' },
  'in transit': { en: 'In Transit', fr: 'En transit' },
  'at market': { en: 'At Market', fr: 'Au marché' },
  sold: { en: 'Sold', fr: 'Vendu' },
  'low stock': { en: 'Low Stock', fr: 'Stock bas' },
  'expiring soon': { en: 'Expiring Soon', fr: 'Expire bientôt' },
  'stock in transit': { en: 'Stock in Transit', fr: 'Stock en transit' },
  'deliveries today': { en: 'Deliveries Today', fr: "Livraisons aujourd'hui" },
  'goods at market': { en: 'Goods at Market', fr: 'Marchandises au marché' },
  'goods on sale': { en: 'Goods on Sale', fr: 'Marchandises en vente' },
  delivery: { en: 'Delivery', fr: 'Livraison' },
  driver: { en: 'Driver', fr: 'Chauffeur' },
  origin: { en: 'Origin', fr: 'Origine' },
  destination: { en: 'Destination', fr: 'Destination' },
  value: { en: 'Value', fr: 'Valeur' },
  preparing: { en: 'Preparing', fr: 'En préparation' },
  delivered: { en: 'Delivered', fr: 'Livré' },
  'bank reconciliation': { en: 'Bank Reconciliation', fr: 'Rapprochement bancaire' },
  'unmatched transactions': { en: 'Unmatched Transactions', fr: 'Transactions non rapprochées' },
  'connected accounts': { en: 'Connected Accounts', fr: 'Comptes connectés' },
  'connect account': { en: 'Connect Account', fr: 'Connecter un compte' },
  match: { en: 'Match', fr: 'Rapprocher' },
  'auto-matched': { en: 'Auto-matched', fr: 'Rapproché automatiquement' },
  reconciled: { en: 'Reconciled', fr: 'Rapproché' },
  contracts: { en: 'Contracts', fr: 'Contrats' },
  templates: { en: 'Templates', fr: 'Modèles' },
  financials: { en: 'Financials', fr: 'Finances' },
  'import list': { en: 'Import List', fr: 'Importer une liste' },
  overview: { en: 'Overview', fr: 'Vue d\'ensemble' },
  schedule: { en: 'Schedule', fr: 'Planning' },
  'leave & absence': { en: 'Leave & Absence', fr: 'Congés & absences' },
  disciplinary: { en: 'Disciplinary', fr: 'Disciplinaire' },
  role: { en: 'Role', fr: 'Rôle' },
  department: { en: 'Department', fr: 'Département' },
  'start date': { en: 'Start Date', fr: 'Date de début' },
  active: { en: 'Active', fr: 'Actif' },
  'on leave': { en: 'On Leave', fr: 'En congé' },
  suspended: { en: 'Suspended', fr: 'Suspendu' },
  'sales performance': { en: 'Sales Performance', fr: 'Performance commerciale' },
  'inventory health': { en: 'Inventory Health', fr: 'Santé des stocks' },
  'logistics performance': { en: 'Logistics Performance', fr: 'Performance logistique' },
  'staff performance': { en: 'Staff Performance', fr: 'Performance du personnel' },
  'pipeline health': { en: 'Pipeline Health', fr: 'Santé du pipeline' },
}

const LanguageContext = createContext<LangCtx>({
  lang: 'en',
  toggle: () => {},
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('pluto_lang') as Lang) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('pluto_lang', lang)
  }, [lang])

  const toggle = () => setLang((l) => (l === 'en' ? 'fr' : 'en'))

  const t = (key: string) => {
    const entry = translations[key.toLowerCase()]
    return entry ? entry[lang] : key
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
