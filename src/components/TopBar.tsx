import { useState, useRef, useEffect } from 'react'
import { Bell, Plus, Search, Building2, User, GitBranch, X, ChevronRight, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang, languageOptions } from '../context/LanguageContext'
import { usePermissions, allUsers, roleConfig } from '../context/PermissionsContext'
import { useApp } from '../context/AppContext'
import NewOrganisationModal from './NewOrganisationModal'
import NewContactModal from './NewContactModal'
import NewDealModal from './NewDealModal'

interface TopBarProps {
  title: string
  actions?: React.ReactNode
}

type SearchResult = {
  type: 'organisation' | 'contact' | 'deal'
  id: number
  label: string
  sub: string
  route: string
}

import { invoices as rawInvoices, inventory as rawInventory, deals as rawDeals } from '../data/mockData'

function buildNotifications() {
  const notes: { id: number; icon: string; text: string; sub: string; time: string; read: boolean }[] = []
  let id = 1
  // Overdue invoices
  rawInvoices.filter(i => i.status === 'overdue').forEach(inv => {
    notes.push({ id: id++, icon: '🔴', text: `${inv.id} is overdue`, sub: `${inv.amount.toLocaleString()} CFA`, time: '2h ago', read: false })
  })
  // Low stock
  rawInventory.forEach(item => {
    const total = item.batches.reduce((s, b) => s + b.totalUnits, 0)
    const sold = item.batches.reduce((s, b) => s + b.soldUnits, 0)
    if ((total - sold) <= item.lowStockThreshold) {
      notes.push({ id: id++, icon: '⚠️', text: `${item.name} — low stock`, sub: `${total - sold} remaining (threshold: ${item.lowStockThreshold})`, time: '4h ago', read: false })
    }
  })
  // Deal reminders due
  rawDeals.forEach(d => {
    d.reminders?.forEach(r => {
      const due = new Date(r.date)
      const today = new Date()
      if (due <= new Date(today.getTime() + 2 * 86400000)) {
        notes.push({ id: id++, icon: '📅', text: r.note, sub: `Due: ${r.date}`, time: 'Today', read: false })
      }
    })
  })
  // Won deals
  rawDeals.filter(d => d.stage === 'Won').slice(0, 1).forEach(d => {
    notes.push({ id: id++, icon: '✅', text: `Deal won: ${d.name}`, sub: `${(d.value/1000).toFixed(0)}K CFA`, time: '1d ago', read: true })
  })
  return notes.slice(0, 8)
}

const notifications = buildNotifications()

export default function TopBar({ title, actions }: TopBarProps) {
  const { lang, setLang } = useLang()
  const { currentUser, setCurrentUser } = usePermissions()
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const currentLang = languageOptions.find(o => o.code === lang)
  const { organisations, contacts, deals } = useApp()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showNewMenu, setShowNewMenu] = useState(false)
  const [modal, setModal] = useState<'org' | 'contact' | 'deal' | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const newMenuRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Search
  const results: SearchResult[] = query.trim().length < 2 ? [] : [
    ...organisations
      .filter(o => o.name.toLowerCase().includes(query.toLowerCase()) || o.city.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(o => ({ type: 'organisation' as const, id: o.id, label: o.name, sub: `${o.sector} · ${o.city}`, route: `/organisations/${o.id}` })),
    ...contacts
      .filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(c => ({ type: 'contact' as const, id: c.id, label: c.name, sub: `${c.role} · ${organisations.find(o => o.id === c.orgId)?.name || ''}`, route: `/contacts/${c.id}` })),
    ...deals
      .filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(d => ({ type: 'deal' as const, id: d.id, label: d.name, sub: `${d.stage} · ${(d.value / 1000).toFixed(0)}K CFA`, route: `/pipeline/${d.id}` })),
  ]

  const typeIcon = (type: SearchResult['type']) => {
    if (type === 'organisation') return <Building2 size={13} className="text-pluto-500" />
    if (type === 'contact') return <User size={13} className="text-green-500" />
    return <GitBranch size={13} className="text-violet-500" />
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (newMenuRef.current && !newMenuRef.current.contains(e.target as Node)) setShowNewMenu(false)
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangMenu(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleResultClick = (route: string) => {
    setQuery('')
    setShowResults(false)
    navigate(route)
  }

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 fixed top-0 left-56 right-0 z-20 gap-4">
        <h1 className="text-lg font-bold text-gray-900 shrink-0">{title}</h1>

        {/* Global Search */}
        <div ref={searchRef} className="flex-1 max-w-md relative">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-pluto-300 focus-within:ring-2 focus-within:ring-pluto-100 transition-all">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setShowResults(true) }}
              onFocus={() => setShowResults(true)}
              placeholder="Search organisations, contacts, deals… (⌘K)"
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(''); setShowResults(false) }} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search results dropdown */}
          {showResults && query.length >= 2 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400">No results for "{query}"</div>
              ) : (
                <>
                  {results.map((r, i) => (
                    <button key={i} onClick={() => handleResultClick(r.route)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                        {typeIcon(r.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.label}</p>
                        <p className="text-xs text-gray-400 truncate">{r.sub}</p>
                      </div>
                      <ChevronRight size={13} className="text-gray-300 shrink-0" />
                    </button>
                  ))}
                  <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center">
                    {results.length} result{results.length !== 1 ? 's' : ''} — press Enter for full search
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {actions}

          {/* User switcher (dev/demo) */}
          <div ref={userMenuRef} className="relative">
            <button onClick={() => setShowUserMenu(s => !s)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600">
              <div className="w-5 h-5 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">{currentUser.avatar.slice(0,2)}</div>
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400 font-medium">Switch User (Demo)</p>
                </div>
                {allUsers.map(u => (
                  <button key={u.id}
                    onClick={() => { setCurrentUser(u); setShowUserMenu(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0 ${
                      currentUser.id === u.id ? 'bg-pluto-50' : ''
                    }`}>
                    <div className="w-6 h-6 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">{u.avatar.slice(0,2)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{u.name}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${roleConfig[u.role].color}`}>{roleConfig[u.role].label}</span>
                    </div>
                    {currentUser.id === u.id && <div className="w-1.5 h-1.5 rounded-full bg-pluto-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language selector */}
          <div ref={langRef} className="relative">
            <button onClick={() => { setShowLangMenu(s => !s); setShowNotifs(false); setShowNewMenu(false) }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-medium text-gray-600">
              <Globe size={13} />
              <span>{currentLang?.nativeLabel}</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {languageOptions.map(opt => (
                  <button key={opt.code}
                    onClick={() => { setLang(opt.code); setShowLangMenu(false) }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${
                      lang === opt.code ? 'bg-pluto-50 text-pluto-700' : 'text-gray-700'
                    }`}>
                    <span className="text-sm font-medium">{opt.nativeLabel}</span>
                    <span className="text-xs text-gray-400">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => { setShowNotifs(s => !s); setShowNewMenu(false) }}
              className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                  <span className="text-xs text-pluto-600 font-medium">{unreadCount} unread</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-pluto-50/40' : ''}`}>
                      <span className="text-base mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                        <p className="text-xs text-gray-300 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-pluto-500 mt-1 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-center">
                  <button className="text-xs text-pluto-600 font-medium hover:underline">Mark all as read</button>
                </div>
              </div>
            )}
          </div>

          {/* Quick create */}
          <div ref={newMenuRef} className="relative">
            <button onClick={() => { setShowNewMenu(s => !s); setShowNotifs(false) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 hover:bg-pluto-700 text-white rounded-xl text-sm font-semibold transition-colors">
              <Plus size={15} />
              New
            </button>
            {showNewMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {[
                  { icon: Building2, label: 'Organisation', color: 'text-pluto-600', action: () => setModal('org') },
                  { icon: User, label: 'Contact', color: 'text-green-600', action: () => setModal('contact') },
                  { icon: GitBranch, label: 'Deal', color: 'text-violet-600', action: () => setModal('deal') },
                ].map(item => (
                  <button key={item.label}
                    onClick={() => { item.action(); setShowNewMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0">
                    <item.icon size={15} className={item.color} />
                    <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {modal === 'org' && <NewOrganisationModal onClose={() => setModal(null)} onCreated={id => navigate(`/organisations/${id}`)} />}
      {modal === 'contact' && <NewContactModal onClose={() => setModal(null)} onCreated={id => navigate(`/contacts/${id}`)} />}
      {modal === 'deal' && <NewDealModal onClose={() => setModal(null)} onCreated={id => navigate(`/pipeline/${id}`)} />}
    </>
  )
}
