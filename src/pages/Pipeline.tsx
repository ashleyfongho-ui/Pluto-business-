import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { useApp } from '../context/AppContext'
import NewDealModal from '../components/NewDealModal'
import { contracts, contractTemplates, contacts as allContacts } from '../data/mockData'
import { FileText, TrendingUp, FileCheck, ChevronRight, LayoutGrid, List, GitBranch, User, Package } from 'lucide-react'

const stages = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const stageColors: Record<string, string> = {
  Qualified: 'bg-blue-100 text-blue-700',
  Proposal: 'bg-purple-100 text-purple-700',
  Negotiation: 'bg-amber-100 text-amber-700',
  Won: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
}
const stageBorder: Record<string, string> = {
  Qualified: 'border-blue-200',
  Proposal: 'border-purple-200',
  Negotiation: 'border-amber-200',
  Won: 'border-green-200',
  Lost: 'border-red-200',
}
const contractStatusColors: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600',
  Sent: 'bg-blue-100 text-blue-700',
  Signed: 'bg-green-100 text-green-700',
  Expired: 'bg-red-100 text-red-700',
}

export default function Pipeline() {
  const { t } = useLang()
  const { deals, organisations } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'deals' | 'contracts' | 'financials'>('deals')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [showNew, setShowNew] = useState(false)

  const totalPipeline = deals.filter(d => !['Won', 'Lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0)
  const wonValue = deals.filter(d => d.stage === 'Won').reduce((s, d) => s + d.value, 0)
  const target = 2000000
  const gap = target - wonValue

  const getOrg = (orgId: number) => organisations.find(o => o.id === orgId)?.name || '—'
  const getContact = (contactId?: number) => contactId ? allContacts.find(c => c.id === contactId) : null
  const getPrimaryProduct = (deal: typeof deals[0]) => deal.lineItems?.[0]?.description || null

  return (
    <>
      <TopBar title={t('pipeline')} />
      <main className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {(['deals', 'contracts', 'financials'] as const).map(k => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${tab === k ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
                {t(k) || k}
              </button>
            ))}
          </div>
          {tab === 'deals' && (
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow text-pluto-700' : 'text-gray-400 hover:text-gray-600'}`}>
                  <List size={15} />
                </button>
                <button onClick={() => setView('kanban')}
                  className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow text-pluto-700' : 'text-gray-400 hover:text-gray-600'}`}>
                  <LayoutGrid size={15} />
                </button>
              </div>
              <button onClick={() => setShowNew(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-semibold hover:bg-pluto-700 transition-colors">
                + New Deal
              </button>
            </div>
          )}
        </div>

        {tab === 'deals' && (
          <div className="space-y-4">
            {/* Stage summary */}
            <div className="grid grid-cols-5 gap-3">
              {stages.map(s => {
                const stageDeals = deals.filter(d => d.stage === s)
                const val = stageDeals.reduce((acc, d) => acc + d.value, 0)
                return (
                  <div key={s} className={`bg-white rounded-xl p-4 shadow-sm border-2 ${stageBorder[s]}`}>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColors[s]}`}>{s}</span>
                    <p className="text-xl font-bold text-gray-900 mt-2">{stageDeals.length}</p>
                    <p className="text-xs text-gray-400">{val > 0 ? `${(val / 1000).toFixed(0)}K CFA` : '—'}</p>
                  </div>
                )
              })}
            </div>

            {/* LIST VIEW */}
            {view === 'list' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Deal</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Stage</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500">Age</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center">
                          <GitBranch size={32} className="text-gray-200 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No deals yet</p>
                          <button onClick={() => setShowNew(true)}
                            className="mt-3 px-4 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700 transition-colors">
                            + New Deal
                          </button>
                        </td>
                      </tr>
                    ) : (
                      deals.map(d => {
                        const contact = getContact(d.contactId)
                        const product = getPrimaryProduct(d)
                        return (
                        <tr key={d.id} onClick={() => navigate(`/pipeline/${d.id}`)}
                          className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer group">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900 group-hover:text-pluto-700 transition-colors">{d.name}</p>
                            {product && <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Package size={10}/>{product}{d.lineItems.length > 1 ? ` +${d.lineItems.length - 1}` : ''}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-700">{getOrg(d.orgId)}</p>
                            {contact && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><User size={10}/>{contact.name}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[d.stage]}`}>{d.stage}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{(d.value / 1000).toFixed(0)}K CFA</td>
                          <td className="px-4 py-3 text-gray-400">{d.age}d</td>
                          <td className="px-4 py-3">
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-pluto-500" />
                          </td>
                        </tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* KANBAN VIEW */}
            {view === 'kanban' && (
              <div className="flex gap-3 overflow-x-auto pb-4">
                {stages.map(stage => {
                  const stageDeals = deals.filter(d => d.stage === stage)
                  return (
                    <div key={stage} className="flex-shrink-0 w-64">
                      <div className={`flex items-center justify-between mb-2 px-1`}>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageColors[stage]}`}>{stage}</span>
                        <span className="text-xs text-gray-400">{stageDeals.length}</span>
                      </div>
                      <div className="space-y-2">
                        {stageDeals.length === 0 ? (
                          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                            <p className="text-xs text-gray-300">No deals</p>
                          </div>
                        ) : (
                          stageDeals.map(d => {
                            const contact = getContact(d.contactId)
                            const product = getPrimaryProduct(d)
                            return (
                            <div key={d.id}
                              onClick={() => navigate(`/pipeline/${d.id}`)}
                              className={`bg-white rounded-xl p-4 shadow-sm border-2 ${stageBorder[stage]} hover:shadow-md cursor-pointer transition-all group`}>
                              <p className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-pluto-700 transition-colors leading-snug">{d.name}</p>
                              <p className="text-xs text-gray-400">{getOrg(d.orgId)}</p>
                              {contact && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                  <User size={9} />{contact.name} · {contact.role}
                                </p>
                              )}
                              {product && (
                                <p className="text-xs text-pluto-600 flex items-center gap-1 mt-1 bg-pluto-50 rounded px-1.5 py-0.5 w-fit">
                                  <Package size={9} />{product}{d.lineItems.length > 1 ? ` +${d.lineItems.length-1}` : ''}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-sm font-bold text-gray-900">{(d.value / 1000).toFixed(0)}K CFA</p>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${d.age > 14 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                  {d.age}d
                                </span>
                              </div>
                              {d.reminders && d.reminders.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-50">
                                  <p className="text-xs text-amber-600 truncate">📅 {d.reminders[0].note}</p>
                                </div>
                              )}
                            </div>
                          )})
                        )}
                        {stage !== 'Won' && stage !== 'Lost' && (
                          <button onClick={() => setShowNew(true)}
                            className="w-full py-2 text-xs text-gray-400 hover:text-pluto-600 hover:bg-pluto-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-pluto-200 transition-all">
                            + Add deal
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'contracts' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileCheck size={16} className="text-pluto-600" /> Contracts Sent
                </h2>
                <button className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">+ New Contract</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Contract</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Sent</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map(c => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.org}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{c.sentDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${contractStatusColors[c.status]}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{c.value ? `${(c.value / 1000).toFixed(0)}K CFA` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FileText size={16} className="text-pluto-600" /> {t('templates') || 'Templates'}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {contractTemplates.map(tp => (
                  <div key={tp.id} className="p-4 rounded-xl border border-pluto-100 bg-pluto-50 hover:border-pluto-300 transition-colors cursor-pointer">
                    <p className="font-medium text-pluto-800 text-sm mb-1">{tp.name}</p>
                    <p className="text-xs text-pluto-600">{tp.description}</p>
                    <button className="mt-3 text-xs text-pluto-700 font-medium hover:underline">Use template →</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'financials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Revenue This Month</p>
                <p className="text-2xl font-bold text-green-600">{(wonValue / 1000).toFixed(0)}K CFA</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Monthly Target</p>
                <p className="text-2xl font-bold text-gray-900">{(target / 1000).toFixed(0)}K CFA</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Gap to Target</p>
                <p className={`text-2xl font-bold ${gap > 0 ? 'text-red-500' : 'text-green-600'}`}>{gap > 0 ? '' : '+'}{(Math.abs(gap) / 1000).toFixed(0)}K CFA</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-pluto-600" /> Target Progress
              </h3>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                <div className="bg-pluto-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((wonValue / target) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mb-4">{((wonValue / target) * 100).toFixed(0)}% of target achieved</p>
              <div className="space-y-2">
                {[
                  { issue: 'Deals stalled in Negotiation stage', impact: `${deals.filter(d => d.stage === 'Negotiation').reduce((s, d) => s + d.value, 0).toLocaleString()} CFA at risk`, color: 'text-amber-600 bg-amber-50' },
                  { issue: 'Open pipeline value', impact: `${(totalPipeline / 1000).toFixed(0)}K CFA total`, color: 'text-blue-600 bg-blue-50' },
                  { issue: 'Deals closed & won', impact: `${deals.filter(d => d.stage === 'Won').length} deal${deals.filter(d => d.stage === 'Won').length !== 1 ? 's' : ''}`, color: 'text-green-600 bg-green-50' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.color}`}>
                    <span className="text-sm font-medium">{item.issue}</span>
                    <span className="text-xs font-semibold">{item.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {showNew && (
        <NewDealModal
          onClose={() => setShowNew(false)}
          onCreated={id => { setShowNew(false); navigate(`/pipeline/${id}`) }}
        />
      )}
    </>
  )
}
