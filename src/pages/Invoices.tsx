import { useState } from 'react'
import { Link2, Bell, CheckCircle, CreditCard, RefreshCw, X, Landmark, Plus, Search, FileText } from 'lucide-react'
import TopBar from '../components/TopBar'
import { useLang } from '../context/LanguageContext'
import { invoices as rawInvoices, bankTransactions as initialTxns, connectedBankAccounts, organisations } from '../data/mockData'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
type Invoice = {
  id: string
  orgId: number
  dealId: number
  amount: number
  dueDate: string
  issueDate?: string
  status: InvoiceStatus
  paymentRef: string | null
  paidVia: string | null
  paidAt: string | null
  reminders: { date: string; type: string }[]
  paymentLink: string
  lineItems: { description: string; amount: number }[]
  templateUsed: string
  notes?: string
}
const initialInvoices: Invoice[] = rawInvoices as unknown as Invoice[]
type Txn = typeof initialTxns[0]

const statusColor: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  sent: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-600',
}

// ─── New Invoice Modal ─────────────────────────────────────────────────────
type NewInvoiceForm = {
  orgId: string
  dealRef: string
  dueDate: string
  notes: string
  lineItems: { description: string; amount: number }[]
}

function NewInvoiceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (inv: Invoice) => void }) {
  const [form, setForm] = useState<NewInvoiceForm>({
    orgId: '', dealRef: '', dueDate: '', notes: '', lineItems: [{ description: '', amount: 0 }]
  })

  const total = form.lineItems.reduce((s, li) => s + (Number(li.amount) || 0), 0)

  const addLine = () => setForm(f => ({ ...f, lineItems: [...f.lineItems, { description: '', amount: 0 }] }))
  const removeLine = (i: number) => setForm(f => ({ ...f, lineItems: f.lineItems.filter((_, idx) => idx !== i) }))
  const updateLine = (i: number, field: 'description' | 'amount', val: string) =>
    setForm(f => ({
      ...f,
      lineItems: f.lineItems.map((li, idx) => idx === i ? { ...li, [field]: field === 'amount' ? Number(val) : val } : li)
    }))

  const handleSave = () => {
    if (!form.orgId || !form.dueDate || total === 0) return
    const newInv: Invoice = {
      id: `INV-${String(Date.now()).slice(-4)}`,
      orgId: Number(form.orgId),
      dealId: 0,
      amount: total,
      dueDate: form.dueDate,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      paymentRef: null, paidVia: null, paidAt: null,
      reminders: [],
      paymentLink: `https://pay.plutobusiness.cm/inv/INV-${String(Date.now()).slice(-4)}`,
      lineItems: form.lineItems.filter(li => li.description),
      templateUsed: 'Standard Invoice',
      notes: form.notes,
    }
    onCreated(newInv)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-gray-900">New Invoice</h2>
            <p className="text-xs text-gray-400">Draft saved automatically</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Org */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Organisation *</label>
            <select
              value={form.orgId}
              onChange={e => setForm(f => ({ ...f, orgId: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
            >
              <option value="">Select organisation…</option>
              {organisations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>

          {/* Deal reference */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Deal / Reference</label>
            <input
              value={form.dealRef}
              onChange={e => setForm(f => ({ ...f, dealRef: e.target.value }))}
              placeholder="e.g. Q3 Supply Agreement, Ref #123"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
            />
          </div>

          {/* Due date */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Due Date *</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300"
            />
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">Line Items *</label>
              <button onClick={addLine} className="text-xs text-pluto-600 hover:text-pluto-800 font-medium flex items-center gap-1">
                <Plus size={11} /> Add line
              </button>
            </div>
            <div className="space-y-2">
              {form.lineItems.map((li, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={li.description}
                    onChange={e => updateLine(i, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300"
                  />
                  <input
                    type="number"
                    value={li.amount || ''}
                    onChange={e => updateLine(i, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-28 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-pluto-300"
                  />
                  {form.lineItems.length > 1 && (
                    <button onClick={() => removeLine(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {total > 0 && (
              <div className="mt-3 flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-500 font-medium">Total</span>
                <span className="text-sm font-bold text-gray-900">{total.toLocaleString()} CFA</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Internal notes (not shown on invoice)"
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 resize-none"
            />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-2 sticky bottom-0 bg-white pt-2 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!form.orgId || !form.dueDate || total === 0}
            className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-xl text-sm font-semibold hover:bg-pluto-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Invoices() {
  const { t } = useLang()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [txns, setTxns] = useState(initialTxns)
  const [tab, setTab] = useState<'invoices' | 'reconciliation'>('invoices')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [reminderModal, setReminderModal] = useState<Invoice | null>(null)
  const [showNewInvoice, setShowNewInvoice] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const markPaid = (id: string) => {
    setInvoices(prev => prev.map(i =>
      i.id === id ? { ...i, status: 'paid', paidAt: new Date().toISOString().split('T')[0], paidVia: 'Manual' } : i
    ))
  }

  const copyLink = (inv: Invoice) => {
    navigator.clipboard?.writeText(inv.paymentLink).catch(() => {})
    setCopied(inv.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const matchTxn = (txnId: string, invoiceId: string) => {
    setTxns(prev => prev.map(t => t.id === txnId ? { ...t, matched: true } : t))
    setInvoices(prev => prev.map(i =>
      i.id === invoiceId ? { ...i, status: 'paid', paidAt: new Date().toISOString().split('T')[0], paidVia: 'Bank Reconciliation', paymentRef: txnId } : i
    ))
  }

  const filtered = invoices.filter(inv => {
    const orgName = organisations.find(o => o.id === inv.orgId)?.name?.toLowerCase() || ''
    const q = search.toLowerCase()
    const matchSearch = !search || inv.id.toLowerCase().includes(q) || orgName.includes(q)
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const tabs = [
    { key: 'invoices', label: t('invoices') },
    { key: 'reconciliation', label: t('bank reconciliation') },
  ] as const

  // Summary stats
  const totalOutstanding = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  return (
    <>
      <TopBar title={t('invoices')} actions={
        <button
          onClick={() => setShowNewInvoice(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-xl text-sm font-semibold hover:bg-pluto-700 transition-colors"
        >
          <Plus size={14} /> New Invoice
        </button>
      } />

      <main className="p-6">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Outstanding</p>
            <p className="text-xl font-bold text-blue-600">{(totalOutstanding / 1000).toFixed(0)}K CFA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Overdue</p>
            <p className="text-xl font-bold text-red-600">{(totalOverdue / 1000).toFixed(0)}K CFA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Collected</p>
            <p className="text-xl font-bold text-green-600">{(totalPaid / 1000).toFixed(0)}K CFA</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
          {tabs.map(tab_ => (
            <button key={tab_.key} onClick={() => setTab(tab_.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${tab === tab_.key ? 'bg-white shadow text-pluto-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab_.label}
            </button>
          ))}
        </div>

        {tab === 'invoices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filter bar */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search invoices…"
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pluto-300 w-44"
                />
              </div>

              <div className="w-px h-5 bg-gray-200" />

              {/* Status filters */}
              {(['all', 'sent', 'overdue', 'paid', 'draft'] as const).map(s => {
                const count = s === 'all' ? invoices.length : invoices.filter(i => i.status === s).length
                const activeClasses = s === 'all' ? 'bg-pluto-600 text-white'
                  : s === 'overdue' ? 'bg-red-500 text-white'
                  : s === 'paid' ? 'bg-green-500 text-white'
                  : s === 'sent' ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-white'
                const inactiveClasses = s === 'all' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : s === 'overdue' ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : s === 'paid' ? 'bg-green-50 text-green-600 hover:bg-green-100'
                  : s === 'sent' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                return (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all flex items-center gap-1.5 ${statusFilter === s ? activeClasses : inactiveClasses}`}>
                    {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                    <span className="font-bold opacity-70">{count}</span>
                  </button>
                )
              })}

              <div className="ml-auto text-xs text-gray-400">
                {filtered.length} invoice{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Invoice</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Organisation</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Issued</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Due Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Paid Via</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <FileText size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm font-medium">No invoices found</p>
                      <button onClick={() => setShowNewInvoice(true)}
                        className="mt-3 px-4 py-1.5 bg-pluto-600 text-white rounded-lg text-xs font-medium hover:bg-pluto-700">
                        + New Invoice
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtered.map(inv => (
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-pluto-700 text-xs">{inv.id}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{organisations.find(o => o.id === inv.orgId)?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{inv.amount.toLocaleString()} CFA</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{inv.issueDate || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{inv.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{inv.paidVia || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {inv.status !== 'paid' && (
                            <>
                              <button onClick={() => copyLink(inv)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-pluto-50 text-pluto-600 hover:bg-pluto-100 text-xs font-medium transition-colors">
                                <Link2 size={11} />
                                {copied === inv.id ? 'Copied!' : 'Link'}
                              </button>
                              <button onClick={() => setReminderModal(inv)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-medium transition-colors">
                                <Bell size={11} /> Remind
                              </button>
                              <button onClick={() => markPaid(inv.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 text-xs font-medium transition-colors">
                                <CheckCircle size={11} /> Paid
                              </button>
                            </>
                          )}
                          {inv.status === 'paid' && inv.paymentRef && (
                            <span className="text-xs text-gray-400 font-mono">{inv.paymentRef}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reconciliation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Landmark size={16} className="text-pluto-600" />
                  {t('connected accounts')}
                </h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700 transition-colors">
                  <CreditCard size={13} /> {t('connect account')}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {connectedBankAccounts.map(acc => (
                  <div key={acc.id} className={`p-4 rounded-xl border-2 ${acc.status === 'connected' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-gray-900">{acc.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${acc.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {acc.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{acc.type} · {acc.accountNo}</p>
                    {acc.balance !== null && (
                      <p className="text-sm font-bold text-gray-900 mt-1">{acc.balance.toLocaleString()} CFA</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw size={16} className="text-pluto-600" />
                  {t('unmatched transactions')}
                </h2>
                <span className="text-xs text-gray-400">{txns.filter(t => !t.matched).length} pending</span>
              </div>
              <div className="space-y-3">
                {txns.filter(tx => !tx.matched).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-gray-400">{tx.id}</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{tx.source}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{tx.reference}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">{tx.amount.toLocaleString()} CFA</p>
                      {tx.suggestedInvoice && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Looks like {tx.suggestedInvoice}
                          </span>
                          <button onClick={() => matchTxn(tx.id, tx.suggestedInvoice!)}
                            className="px-2 py-0.5 bg-pluto-600 text-white text-xs rounded font-medium hover:bg-pluto-700 transition-colors">
                            {t('match')}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {txns.filter(t => !t.matched).length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-6">All transactions reconciled ✓</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reminder modal */}
      {reminderModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Set Reminders — {reminderModal.id}</h3>
              <button onClick={() => setReminderModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Reminders sent to <strong>{organisations.find(o => o.id === reminderModal.orgId)?.name}</strong> via WhatsApp/Email.
            </p>
            <div className="space-y-2 mb-4">
              {[
                { label: '3 days before due date', checked: true },
                { label: 'On due date', checked: true },
                { label: '7 days overdue', checked: true },
                { label: '14 days overdue', checked: false },
                { label: '30 days overdue', checked: false },
              ].map((r, i) => (
                <label key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" defaultChecked={r.checked} className="accent-pluto-600 w-4 h-4" />
                  <span className="text-sm text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReminderModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">{t('cancel')}</button>
              <button onClick={() => setReminderModal(null)}
                className="flex-1 px-4 py-2 bg-pluto-600 text-white rounded-lg text-sm font-medium hover:bg-pluto-700">Save Reminders</button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice modal */}
      {showNewInvoice && (
        <NewInvoiceModal
          onClose={() => setShowNewInvoice(false)}
          onCreated={(inv) => setInvoices(prev => [inv, ...prev])}
        />
      )}
    </>
  )
}
