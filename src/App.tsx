import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import KeyboardShortcutsModal from './components/KeyboardShortcuts'
import { LanguageProvider } from './context/LanguageContext'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Organisations from './pages/Organisations'
import OrganisationDetail from './pages/OrganisationDetail'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import Pipeline from './pages/Pipeline'
import DealDetail from './pages/DealDetail'
import Invoices from './pages/Invoices'
import Inventory from './pages/Inventory'
import InventoryDetail from './pages/InventoryDetail'
import Logistics from './pages/Logistics'
import Campaigns from './pages/Campaigns'
import Reports from './pages/Reports'
import Staff from './pages/Staff'
import StaffDetail from './pages/StaffDetail'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import Accounting from './pages/Accounting'

function ShortcutsWrapper({ children }: { children: React.ReactNode }) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === '?') setShowShortcuts(s => !s)
      if (e.key === 'Escape') setShowShortcuts(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  return (
    <>{children}{showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}</>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
      <BrowserRouter>
      <ShortcutsWrapper>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organisations" element={<Organisations />} />
            <Route path="/organisations/:id" element={<OrganisationDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/pipeline/:id" element={<DealDetail />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<InventoryDetail />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/:id" element={<StaffDetail />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accounting" element={<Accounting />} />
          </Route>
        </Routes>
      </ShortcutsWrapper>
      </BrowserRouter>
      </AppProvider>
    </LanguageProvider>
  )
}
