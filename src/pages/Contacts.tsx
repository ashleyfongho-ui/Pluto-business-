import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import NewContactModal from '../components/NewContactModal'
import TagPills from '../components/TagPills'
import { ChevronRight, MessageCircle, User, Search, Download } from 'lucide-react'
import { systemUsers } from '../data/mockData'
import { downloadCSV } from '../utils/csvExport'

export default function Contacts() {
  const { t } = useLang()
  const { contacts, organisations } = useApp()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    const org = organisations.find(o => o.id === c.orgId)
    const matchSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (org?.name.toLowerCase().includes(q) ?? false)
    const matchOrg = !orgFilter || String(c.orgId) === orgFilter
    const matchOwner = !ownerFilter || c.ownedBy === ownerFilter
    return matchSearch && matchOrg && matchOwner
  })

  const handleExport = () => {
    downloadCSV('contacts.csv', filtered.map(c => ({
      Name: c.name,
      Role: c.role,
      Organisation: organisations.find(o => o.id === c.orgId)?.name ?? '',
      Phone: c.phone,
      Email: c.email,
      City: c.city,
      'Last Contact': c.lastContact,
      'Owner': systemUsers.find(u => u.id === c.ownedBy)?.name ?? '',
    })))
  }

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
            <p className="text-xl font-bold text-pluto-700">
              {contacts.filter(c => c.lastContact.includes('h ago') || c.lastContact === 'Just now').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Total Interactions</p>
            <p className="text-xl font-bold text-gray-900">
              {contacts.reduce((s, c) => s + (c.conversations?.length || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts…"
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300" />
            </div>

            {/* Org filter */}
            <select value={orgFilter} onChange={e => setOrgFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-pluto-300">
              <option value="">All organisations</option>
              {organisations.map(o => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
            </select>

            {/* Owner filter */}
            <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-pluto-300">
              <option value="">All staff</option>
              {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <span className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>

            <div className="ml-auto flex gap-2">
              <button onClick={handleExport}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Download size={13} /> CSV
              </button>
              <button onClick={() => setShowNew(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-semibold hover:bg-pluto-700 transition-colors">
                + New Contact
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tags</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Last Contact</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <User size={36} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium mb-1">No contacts found</p>
                    <p className="text-gray-400 text-xs mb-4">Try adjusting your filters or add a new contact</p>
                    <button onClick={() => setShowNew(true)}
                      className="px-4 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700">
                      + New Contact
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const org = organisations.find(o => o.id === c.orgId)
                  const owner = systemUsers.find(u => u.id === c.ownedBy)
                  const contactWithTags = c as typeof c & { tags?: string[]; whatsapp?: string }
                  return (
                    <tr key={c.id} onClick={() => navigate(`/contacts/${c.id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{org?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{c.role}</td>
                      <td className="px-4 py-3">
                        <TagPills tags={contactWithTags.tags || []} size="xs" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-xs">{c.phone}</span>
                          {contactWithTags.whatsapp && (
                            <a href={`https://wa.me/${contactWithTags.whatsapp.replace(/\D/g, '')}`}
                              target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-green-500 hover:text-green-600">
                              <MessageCircle size={14} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {owner ? (
                          <span className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">{owner.avatar.slice(0,1)}</div>
                            {owner.name.split(' ')[0]}
                          </span>
                        ) : '—'}
                      </td>
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
