import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import NewContactModal from '../components/NewContactModal'
import { ChevronRight, MessageCircle, User, Search } from 'lucide-react'

export default function Contacts() {
  const { t } = useLang()
  const { contacts, organisations } = useApp()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return !search || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) ||
      organisations.find(o => o.id === c.orgId)?.name.toLowerCase().includes(q)
  })

  return (
    <>
      <TopBar title={t('contacts')} />
      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Total Contacts</p>
            <p className="text-xl font-bold text-gray-900">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Contacted This Week</p>
            <p className="text-xl font-bold text-pluto-700">{contacts.filter(c => c.lastContact.includes('h ago') || c.lastContact === 'Just now').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Total Interactions</p>
            <p className="text-xl font-bold text-gray-900">{contacts.reduce((s, c) => s + (c.conversations?.length || 0), 0)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search contacts…"
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                />
              </div>
              <span className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-semibold hover:bg-pluto-700 transition-colors whitespace-nowrap">
              + New Contact
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">City</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Interactions</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Last Contact</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <User size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm font-medium">No contacts found</p>
                    <button onClick={() => setShowNew(true)}
                      className="mt-3 px-4 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">
                      + New Contact
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const org = organisations.find(o => o.id === c.orgId)
                  return (
                    <tr key={c.id} onClick={() => navigate(`/contacts/${c.id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {c.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {org ? (
                          <Link to={`/organisations/${org.id}`} onClick={e => e.stopPropagation()}
                            className="text-pluto-600 hover:text-pluto-800 text-xs font-medium hover:underline">
                            {org.name}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-500 text-xs">{c.phone}</span>
                          <a href={`https://wa.me/${c.phone.replace(/\s+/g, '').replace('+', '')}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1 rounded hover:bg-green-100 transition-colors" title="WhatsApp">
                            <MessageCircle size={12} className="text-green-500" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.city}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.conversations?.length ?? 0} logged</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.lastContact}</td>
                      <td className="px-4 py-3">
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500 transition-colors" />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showNew && (
        <NewContactModal
          onClose={() => setShowNew(false)}
          onCreated={id => { setShowNew(false); navigate(`/contacts/${id}`) }}
        />
      )}
    </>
  )
}
