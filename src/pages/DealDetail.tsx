import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Bell, FileText, Package, Wrench, User, Calendar } from 'lucide-react'
import TopBar from '../components/TopBar'
import { deals, organisations, contacts, systemUsers } from '../data/mockData'

const stageOptions = ['Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const stageColors: Record<string, string> = {
  Qualified: 'bg-blue-100 text-blue-700',
  Proposal: 'bg-purple-100 text-purple-700',
  Negotiation: 'bg-amber-100 text-amber-700',
  Won: 'bg-green-100 text-green-700',
  Lost: 'bg-red-100 text-red-700',
}

export default function DealDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const deal = deals.find(d => d.id === Number(id))
  const [tab, setTab] = useState<'overview' | 'quote' | 'notes' | 'reminders'>('overview')
  const [showAddLine, setShowAddLine] = useState(false)
  const [newLine, setNewLine] = useState({ type: 'product', description: '', qty: 1, unitPrice: 0 })
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({ date: '', assignedTo: '', note: '' })

  if (!deal) return (
    <><TopBar title="Deal not found" /><main className="p-6"><p className="text-gray-400">Deal not found.</p></main></>
  )

  const org = organisations.find(o => o.id === deal.orgId)
  const contact = contacts.find(c => c.id === deal.contactId)
  const owner = systemUsers.find(u => u.id === deal.owner)
  const totalValue = deal.lineItems.reduce((s, l) => s + l.total, 0)

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'quote', label: `Quote (${deal.lineItems.length} items)` },
    { key: 'notes', label: 'Notes & Correspondence' },
    { key: 'reminders', label: `Reminders (${deal.reminders.length})` },
  ] as const

  return (
    <>
      <TopBar title={deal.name} />
      <main className="p-6 max-w-5xl">
        <button onClick={() => navigate('/pipeline')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
          <ArrowLeft size={14} /> Back to Pipeline
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{deal.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {org && (
                  <Link to={`/organisations/${org.id}`} className="flex items-center gap-1 text-sm text-pluto-600 hover:text-pluto-800 font-medium">
                    🏢 {org.name}
                  </Link>
                )}
                {contact && (
                  <Link to={`/contacts/${contact.id}`} className="flex items-center gap-1 text-sm text-pluto-600 hover:text-pluto-800 font-medium">
                    👤 {contact.name} · {contact.role}
                  </Link>
                )}
                {org && <span className="text-xs text-gray-400">📍 {org.city}, {org.country}</span>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-pluto-700">{totalValue.toLocaleString()} CFA</p>
              <p className="text-xs text-gray-400">{deal.age} days in pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">Stage</p>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {stageOptions.map(s => <option key={s} selected={s === deal.stage}>{s}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Owner</p>
              <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300">
                {systemUsers.map(u => <option key={u.id} selected={u.id === deal.owner}>{u.name}</option>)}
              </select>
            </div>
            {org && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Payment Terms</p>
                <span className="text-sm font-medium text-gray-700">{org.paymentTerms}</span>
              </div>
            )}
            <div className="ml-auto flex gap-2">
              <button className="px-4 py-2 border border-pluto-200 text-pluto-600 rounded-lg text-sm font-medium hover:bg-pluto-50 transition-colors flex items-center gap-1.5">
                <FileText size={13} /> Send Contract
              </button>
              <button
                onClick={() => navigate(`/accounting?fromDeal=${deal.id}&org=${deal.orgId}&value=${totalValue}`)}
                className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors flex items-center gap-1.5">
                <FileText size={13} /> Convert to Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${tab === t.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Deal Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Organisation</span><Link to={`/organisations/${org?.id}`} className="text-pluto-600 font-medium hover:underline">{org?.name}</Link></div>
                <div className="flex justify-between"><span className="text-gray-400">Contact</span><Link to={`/contacts/${contact?.id}`} className="text-pluto-600 font-medium hover:underline">{contact?.name}</Link></div>
                <div className="flex justify-between"><span className="text-gray-400">Location</span><span className="text-gray-700">{org?.city}, {org?.country}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Stage</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[deal.stage]}`}>{deal.stage}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Total Value</span><span className="font-bold text-pluto-700">{totalValue.toLocaleString()} CFA</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Line Items</span><span className="text-gray-700">{deal.lineItems.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Days in Pipeline</span><span className="text-gray-700">{deal.age}d</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Owner</span><span className="text-gray-700">{owner?.name}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Products & Services</h3>
              <div className="space-y-2">
                {deal.lineItems.map(li => (
                  <div key={li.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    {li.type === 'product' ? <Package size={13} className="text-pluto-500 shrink-0" /> : <Wrench size={13} className="text-amber-500 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{li.description}</p>
                      <p className="text-xs text-gray-400">Qty {li.qty} × {li.unitPrice.toLocaleString()} CFA</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">{li.total.toLocaleString()} CFA</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUOTE BUILDER */}
        {tab === 'quote' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Line Items</h3>
                <button onClick={() => setShowAddLine(!showAddLine)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                  <Plus size={13} /> Add Line Item
                </button>
              </div>

              {showAddLine && (
                <div className="px-5 py-4 bg-pluto-50 border-b border-pluto-100">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <select value={newLine.type} onChange={e => setNewLine({...newLine, type: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300">
                        <option value="product">Product</option>
                        <option value="service">Service / Time</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <input value={newLine.description} onChange={e => setNewLine({...newLine, description: e.target.value})}
                        placeholder={newLine.type === 'product' ? 'Product name…' : 'Service description / hours…'}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Qty / Units</p>
                      <input type="number" value={newLine.qty} onChange={e => setNewLine({...newLine, qty: Number(e.target.value)})}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Unit Price (CFA)</p>
                      <input type="number" value={newLine.unitPrice} onChange={e => setNewLine({...newLine, unitPrice: Number(e.target.value)})}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-pluto-700">Total: {(newLine.qty * newLine.unitPrice).toLocaleString()} CFA</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddLine(false)} className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1">Cancel</button>
                      <button onClick={() => setShowAddLine(false)} className="px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700">Add</button>
                    </div>
                  </div>
                </div>
              )}

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Description</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Qty</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Unit Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {deal.lineItems.map(li => (
                    <tr key={li.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${li.type === 'product' ? 'text-pluto-600' : 'text-amber-600'}`}>
                          {li.type === 'product' ? <Package size={12}/> : <Wrench size={12}/>}
                          {li.type === 'product' ? 'Product' : 'Service'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{li.description}</td>
                      <td className="px-4 py-3 text-gray-500">{li.qty}</td>
                      <td className="px-4 py-3 text-gray-500">{li.unitPrice.toLocaleString()} CFA</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{li.total.toLocaleString()} CFA</td>
                      <td className="px-4 py-3">
                        <button className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-pluto-100 bg-pluto-50">
                    <td colSpan={4} className="px-4 py-3 font-semibold text-gray-700 text-right">Total Deal Value</td>
                    <td className="px-4 py-3 font-bold text-pluto-700 text-lg">{totalValue.toLocaleString()} CFA</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-pluto-200 text-pluto-600 rounded-lg text-sm font-medium hover:bg-pluto-50 transition-colors">
                Download Quote PDF
              </button>
              <button onClick={() => navigate(`/accounting?fromDeal=${deal.id}&org=${deal.orgId}&value=${totalValue}`)}
                className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors flex items-center gap-1.5">
                <FileText size={13} /> Convert to Invoice →
              </button>
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === 'notes' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Notes & Correspondence</h3>
            <p className="text-xs text-gray-400 mb-2">Log calls, emails, meetings, and key decisions. This feeds into the contact's conversation history.</p>
            <textarea defaultValue={deal.notes} rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none mb-3" />
            {contact && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-3">
                <span className="text-xs text-blue-700">Linked contact: <strong>{contact.name}</strong> — view their full conversation history in
                  <Link to={`/contacts/${contact.id}`} className="text-pluto-600 font-medium hover:underline ml-1">Contacts →</Link>
                </span>
              </div>
            )}
            <button className="px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">Save Notes</button>
          </div>
        )}

        {/* REMINDERS */}
        {tab === 'reminders' && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button onClick={() => setShowAddReminder(s => !s)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                <Bell size={13} /> Add Reminder
              </button>
            </div>

            {/* Add reminder form */}
            {showAddReminder && (
              <div className="bg-pluto-50 border border-pluto-100 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-pluto-700">New Reminder</p>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Reminder Note</label>
                  <input
                    value={newReminder.note}
                    onChange={e => setNewReminder(r => ({ ...r, note: e.target.value }))}
                    placeholder="e.g. Follow up with Jean-Pierre on revised pricing"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1"><Calendar size={10}/> Due Date</label>
                    <input
                      type="date"
                      value={newReminder.date}
                      onChange={e => setNewReminder(r => ({ ...r, date: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block flex items-center gap-1"><User size={10}/> Assign To</label>
                    <select
                      value={newReminder.assignedTo}
                      onChange={e => setNewReminder(r => ({ ...r, assignedTo: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
                    >
                      <option value="">Select team member…</option>
                      {systemUsers.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddReminder(false)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={() => setShowAddReminder(false)} className="flex-1 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">
                    Save Reminder
                  </button>
                </div>
              </div>
            )}

            {deal.reminders.length === 0 && !showAddReminder ? (
              <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-8 text-center">
                <Bell size={24} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">No reminders set. Add one to keep this deal moving.</p>
              </div>
            ) : (
              deal.reminders.map(r => {
                const assigned = systemUsers.find(u => u.id === r.assignedTo)
                return (
                  <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Bell size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{r.note}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={10}/> {r.date}</p>
                        {assigned && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-pluto-100 text-pluto-700 flex items-center justify-center text-xs font-bold">{assigned.avatar}</div>
                            {assigned.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </main>
    </>
  )
}
