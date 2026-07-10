import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import NewOrganisationModal from '../components/NewOrganisationModal'
import { ChevronRight, Building2, Search } from 'lucide-react'

export default function Organisations() {
  const { t } = useLang()
  const { organisations, contacts } = useApp()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')

  const sectors = [...new Set(organisations.map(o => o.sector))].sort()
  const filtered = organisations.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search || o.name.toLowerCase().includes(q) || o.city.toLowerCase().includes(q) || o.sector.toLowerCase().includes(q)
    const matchSector = !sectorFilter || o.sector === sectorFilter
    return matchSearch && matchSector
  })

  return (
    <>
      <TopBar title={t('organisations')} />
      <main className="p-6">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Organisations', value: organisations.length, color: 'text-gray-900' },
            { label: 'With Outstanding', value: organisations.filter(o => o.outstanding > 0).length, color: 'text-red-600' },
            { label: 'Total Outstanding', value: `${(organisations.reduce((s, o) => s + o.outstanding, 0) / 1000).toFixed(0)}K CFA`, color: 'text-red-600' },
            { label: 'Total Contacts', value: contacts.length, color: 'text-pluto-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search organisations…"
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                />
              </div>
              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-pluto-300"
              >
                <option value="">All sectors</option>
                {sectors.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-semibold hover:bg-pluto-700 transition-colors whitespace-nowrap"
            >
              + New Organisation
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Sector</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">City</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Contacts</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Outstanding</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Payment Terms</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Last Activity</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Building2 size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm font-medium">No organisations found</p>
                    <p className="text-gray-300 text-xs mt-1">Try a different search or add a new one</p>
                    <button onClick={() => setShowNew(true)}
                      className="mt-3 px-4 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">
                      + New Organisation
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.id}
                    onClick={() => navigate(`/organisations/${o.id}`)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {o.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{o.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{o.sector}</td>
                    <td className="px-4 py-3 text-gray-500">{o.city}</td>
                    <td className="px-4 py-3 text-gray-500">{contacts.filter(c => c.orgId === o.id).length}</td>
                    <td className="px-4 py-3 font-medium">
                      {o.outstanding ? <span className="text-red-500">{o.outstanding.toLocaleString()} CFA</span> : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{o.paymentTerms}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{o.lastActivity}</td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showNew && (
        <NewOrganisationModal
          onClose={() => setShowNew(false)}
          onCreated={id => { setShowNew(false); navigate(`/organisations/${id}`) }}
        />
      )}
    </>
  )
}
